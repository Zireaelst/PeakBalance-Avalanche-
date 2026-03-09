// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentRegistry} from "./AgentRegistry.sol";

/// @title ReputationAggregator — ERC-8004 score computation, tier assignment, leaderboard
/// @notice Extends AgentRegistry with a weighted scoring formula (0-1000).
///         Raw trade counters updated per-trade. Computed score batched hourly via Chainlink Automation.
///         Score = win_rate(300) + return(250) + consistency(200) + volume(150) + subscribers(100)
///                - drawdown_penalty(200) - slash_penalty(∞)
contract ReputationAggregator {
    // ═══ TYPES ═══
    enum Tier { UNVERIFIED, RISING, TRUSTED, ELITE, APEX }

    struct AgentReputation {
        // Raw counters — updated every trade
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 totalVolumeUSD;       // cumulative USD volume (18 decimals)
        int256  cumulativePnlBps;

        // Derived metrics — updated on updateScore()
        int256  ret30dBps;            // 30-day return in basis points
        uint256 maxDrawdownBps;       // worst drawdown since listing
        uint256 currentStreak;        // consecutive profitable trades
        uint256 bestStreak;

        // Marketplace metrics
        uint256 activeSubscribers;
        uint256 totalSubscribersEver;

        // Computed score
        uint256 score;
        Tier    tier;
        uint256 lastUpdated;

        // Penalty tracking
        uint256 slashCount;           // each slash = permanent -100 pts
    }

    // ═══ STATE ═══
    AgentRegistry public immutable registry;
    address public controller;   // PeakController — only source of trade data
    address public marketplace;  // AgentMarketplace — can update subscriber counts and apply slash
    address public immutable admin;

    mapping(uint256 agentId => AgentReputation) public reputations;
    uint256[20] public leaderboard;   // top 20 agentIds by score, sorted desc
    uint256 public leaderboardCount;

    // ═══ EVENTS ═══
    event ScoreUpdated(uint256 indexed agentId, uint256 newScore, Tier newTier);
    event TradeRecorded(uint256 indexed agentId, bool success, uint256 volumeUSD, int256 pnlBps);
    event SlashPenaltyApplied(uint256 indexed agentId, uint256 newSlashCount, uint256 newScore);
    event LeaderboardUpdated();

    // ═══ ERRORS ═══
    error OnlyController();
    error OnlyMarketplace();
    error OnlyAdmin();
    error ZeroAddress();

    modifier onlyController() {
        if (msg.sender != controller) revert OnlyController();
        _;
    }

    modifier onlyMarketplace() {
        if (msg.sender != marketplace) revert OnlyMarketplace();
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    constructor(address _registry) {
        if (_registry == address(0)) revert ZeroAddress();
        registry = AgentRegistry(_registry);
        admin    = msg.sender;
    }

    // ═══ WIRING ═══

    function setController(address _controller) external onlyAdmin {
        if (_controller == address(0)) revert ZeroAddress();
        controller = _controller;
    }

    function setMarketplace(address _marketplace) external onlyAdmin {
        if (_marketplace == address(0)) revert ZeroAddress();
        marketplace = _marketplace;
    }

    // ═══ TRADE RECORDING (called by PeakController per trade) ═══

    /// @notice Record raw trade data. Does NOT compute score (batched for gas).
    function recordTrade(
        uint256 agentId,
        bool success,
        uint256 volumeUSD,
        int256 pnlBps
    ) external onlyController {
        AgentReputation storage r = reputations[agentId];
        r.totalTrades++;
        r.totalVolumeUSD += volumeUSD;
        r.cumulativePnlBps += pnlBps;

        if (success) {
            r.successfulTrades++;
            r.currentStreak++;
            if (r.currentStreak > r.bestStreak) r.bestStreak = r.currentStreak;
        } else {
            r.currentStreak = 0;
            // Update drawdown tracking — if pnl is negative
            if (pnlBps < 0) {
                uint256 ddBps = uint256(-pnlBps);
                if (ddBps > r.maxDrawdownBps) r.maxDrawdownBps = ddBps;
            }
        }

        emit TradeRecorded(agentId, success, volumeUSD, pnlBps);
    }

    // ═══ SUBSCRIBER COUNT (called by AgentMarketplace) ═══

    function updateSubscriberCount(uint256 agentId, uint256 count) external onlyMarketplace {
        AgentReputation storage r = reputations[agentId];
        if (count > r.activeSubscribers) {
            r.totalSubscribersEver += count - r.activeSubscribers;
        }
        r.activeSubscribers = count;
        // Score update triggered separately by keeper
    }

    // ═══ SLASH PENALTY (called by AgentMarketplace) ═══

    /// @notice Permanently reduce score by 100 per slash. Immediately recalculated.
    function applySlashPenalty(uint256 agentId) external onlyMarketplace {
        reputations[agentId].slashCount++;
        _computeScore(agentId);
        emit SlashPenaltyApplied(agentId, reputations[agentId].slashCount, reputations[agentId].score);
    }

    // ═══ SCORE COMPUTATION ═══

    /// @notice Compute and store the current score for one agent. Anyone can call.
    function updateScore(uint256 agentId) public {
        _computeScore(agentId);
        _updateLeaderboard(agentId);
    }

    /// @notice Batch update scores — called by Chainlink Automation keeper hourly.
    function batchUpdateScores(uint256[] calldata agentIds) external {
        for (uint256 i = 0; i < agentIds.length; i++) {
            _computeScore(agentIds[i]);
        }
        // Rebuild leaderboard after batch
        _rebuildLeaderboard(agentIds);
    }

    function _computeScore(uint256 agentId) internal {
        AgentReputation storage r = reputations[agentId];

        // 1. Win rate score (0-300)
        uint256 winRateScore = 0;
        if (r.totalTrades > 0) {
            winRateScore = (r.successfulTrades * 300) / r.totalTrades;
        }

        // 2. Return score (0-250): capped at 20% monthly return (2000 bps)
        uint256 returnScore = 0;
        if (r.ret30dBps > 0) {
            returnScore = (uint256(r.ret30dBps) * 250) / 2000;
            if (returnScore > 250) returnScore = 250;
        }

        // 3. Consistency score (0-200): streak × 2, cap at 100 streak
        uint256 consistencyScore = r.currentStreak * 2;
        if (consistencyScore > 200) consistencyScore = 200;

        // 4. Volume score (0-150): log10 approximation
        //    $1M = 90pts, $10M = 120pts, $100M = 150pts
        uint256 volumeScore = 0;
        if (r.totalVolumeUSD > 0) {
            // Each order of magnitude from $10k adds 30 pts
            uint256 v = r.totalVolumeUSD / 1e18; // USD as integer
            if (v >= 100_000_000) volumeScore = 150;
            else if (v >= 10_000_000) volumeScore = 120;
            else if (v >= 1_000_000) volumeScore = 90;
            else if (v >= 100_000) volumeScore = 60;
            else if (v >= 10_000) volumeScore = 30;
        }

        // 5. Subscriber score (0-100): 50 active subs = max
        uint256 subscriberScore = r.activeSubscribers * 2;
        if (subscriberScore > 100) subscriberScore = 100;

        // 6. Drawdown penalty (0-200): 10% drawdown = -200
        uint256 drawdownPenalty = (r.maxDrawdownBps * 200) / 1000;
        if (drawdownPenalty > 200) drawdownPenalty = 200;

        // 7. Slash penalty (permanent, 100 per slash)
        uint256 slashPenalty = r.slashCount * 100;

        // Final score
        uint256 rawScore = winRateScore + returnScore + consistencyScore + volumeScore + subscriberScore;
        if (rawScore > drawdownPenalty + slashPenalty) {
            rawScore = rawScore - drawdownPenalty - slashPenalty;
        } else {
            rawScore = 0;
        }
        if (rawScore > 1000) rawScore = 1000;

        r.score      = rawScore;
        r.tier       = _assignTier(rawScore);
        r.lastUpdated = block.timestamp;

        emit ScoreUpdated(agentId, rawScore, r.tier);
    }

    function _assignTier(uint256 score) internal pure returns (Tier) {
        if (score >= 850) return Tier.APEX;
        if (score >= 700) return Tier.ELITE;
        if (score >= 500) return Tier.TRUSTED;
        if (score >= 300) return Tier.RISING;
        return Tier.UNVERIFIED;
    }

    function _updateLeaderboard(uint256 agentId) internal {
        uint256 score = reputations[agentId].score;
        // Check if already in leaderboard
        for (uint256 i = 0; i < leaderboardCount; i++) {
            if (leaderboard[i] == agentId) {
                _sortLeaderboard();
                return;
            }
        }
        // Try to insert if better than lowest or leaderboard not full
        if (leaderboardCount < 20) {
            leaderboard[leaderboardCount] = agentId;
            leaderboardCount++;
            _sortLeaderboard();
        } else if (score > reputations[leaderboard[19]].score) {
            leaderboard[19] = agentId;
            _sortLeaderboard();
        }
    }

    function _rebuildLeaderboard(uint256[] calldata agentIds) internal {
        // Add any new agents to leaderboard candidates
        for (uint256 i = 0; i < agentIds.length; i++) {
            _updateLeaderboard(agentIds[i]);
        }
        emit LeaderboardUpdated();
    }

    function _sortLeaderboard() internal {
        // Insertion sort over small fixed array (max 20 elements)
        for (uint256 i = 1; i < leaderboardCount; i++) {
            uint256 key = leaderboard[i];
            uint256 keyScore = reputations[key].score;
            int256  j = int256(i) - 1;
            while (j >= 0 && reputations[leaderboard[uint256(j)]].score < keyScore) {
                leaderboard[uint256(j + 1)] = leaderboard[uint256(j)];
                j--;
            }
            leaderboard[uint256(j + 1)] = key;
        }
    }

    // ═══ VIEW FUNCTIONS ═══

    /// @notice Get top N agents from leaderboard, sorted by score desc
    function getLeaderboard(uint8 count) external view returns (uint256[] memory ids, uint256[] memory scores) {
        uint8 n = count < uint8(leaderboardCount) ? count : uint8(leaderboardCount);
        ids    = new uint256[](n);
        scores = new uint256[](n);
        for (uint8 i = 0; i < n; i++) {
            ids[i]    = leaderboard[i];
            scores[i] = reputations[leaderboard[i]].score;
        }
    }

    function getTier(uint256 agentId) external view returns (Tier) {
        return reputations[agentId].tier;
    }

    /// @notice Returns the 7 components of the score for radar chart rendering
    function getScoreBreakdown(uint256 agentId) external view returns (
        uint256 winRateScore,
        uint256 returnScore,
        uint256 consistencyScore,
        uint256 volumeScore,
        uint256 subscriberScore,
        uint256 drawdownPenalty,
        uint256 slashPenalty
    ) {
        AgentReputation storage r = reputations[agentId];

        winRateScore = (r.totalTrades > 0) ? (r.successfulTrades * 300) / r.totalTrades : 0;

        returnScore = 0;
        if (r.ret30dBps > 0) {
            returnScore = (uint256(r.ret30dBps) * 250) / 2000;
            if (returnScore > 250) returnScore = 250;
        }

        consistencyScore = r.currentStreak * 2;
        if (consistencyScore > 200) consistencyScore = 200;

        uint256 v = r.totalVolumeUSD / 1e18;
        if (v >= 100_000_000) volumeScore = 150;
        else if (v >= 10_000_000) volumeScore = 120;
        else if (v >= 1_000_000) volumeScore = 90;
        else if (v >= 100_000) volumeScore = 60;
        else if (v >= 10_000) volumeScore = 30;

        subscriberScore = r.activeSubscribers * 2;
        if (subscriberScore > 100) subscriberScore = 100;

        drawdownPenalty = (r.maxDrawdownBps * 200) / 1000;
        if (drawdownPenalty > 200) drawdownPenalty = 200;

        slashPenalty = r.slashCount * 100;
    }

    // ═══ ADMIN: allow setting 30d return from off-chain source ═══
    // (In production, this would be set by a trusted oracle / Chainlink Function)
    function setRet30d(uint256 agentId, int256 ret30dBps_) external onlyController {
        reputations[agentId].ret30dBps = ret30dBps_;
    }
}
