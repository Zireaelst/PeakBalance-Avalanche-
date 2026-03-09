// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title AgentRegistry — ERC-8004 compatible agent identity NFT
/// @notice Each PeakBalance agent gets an NFT identity with on-chain reputation tracking.
///         Score is updated after every trade based on outcome.
contract AgentRegistry {
    // ═══ STATE ═══
    string public constant name = "PeakBalance Agent";
    string public constant symbol = "PEAK-AGENT";
    uint256 private _nextTokenId = 1;

    struct Agent {
        address wallet;
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 reputationScore;  // 0-1000 scale
        uint256 registeredAt;
        bool    active;
        bytes   metadata;        // IPFS hash or JSON for extra info
    }

    mapping(uint256 => Agent)  public agents;
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public agentIdByWallet;

    // ═══ EVENTS ═══
    event AgentRegistered(uint256 indexed tokenId, address indexed wallet, address indexed owner);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newScore, uint256 totalTrades, uint256 successRate);
    event TradeRecorded(uint256 indexed tokenId, bool success, int256 pnlBps);
    event AgentDeactivated(uint256 indexed tokenId);
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    // ═══ ERRORS ═══
    error NotOwner();
    error AgentAlreadyRegistered();
    error InvalidTokenId();

    /// @notice Register a new agent and mint identity NFT
    function registerAgent(address agentWallet, bytes calldata _metadata) external returns (uint256 tokenId) {
        if (agentIdByWallet[agentWallet] != 0) revert AgentAlreadyRegistered();

        tokenId = _nextTokenId++;
        agents[tokenId] = Agent({
            wallet: agentWallet,
            totalTrades: 0,
            successfulTrades: 0,
            reputationScore: 500, // Start at 50%
            registeredAt: block.timestamp,
            active: true,
            metadata: _metadata
        });
        ownerOf[tokenId] = msg.sender;
        agentIdByWallet[agentWallet] = tokenId;

        emit AgentRegistered(tokenId, agentWallet, msg.sender);
        emit Transfer(address(0), msg.sender, tokenId);
    }

    /// @notice Record a trade outcome and update reputation
    /// @param tokenId The agent's NFT ID
    /// @param success Whether the trade was profitable
    /// @param pnlBps Profit/loss in basis points (can be negative)
    function recordTrade(uint256 tokenId, bool success, int256 pnlBps) external {
        Agent storage agent = agents[tokenId];
        if (agent.wallet == address(0)) revert InvalidTokenId();
        if (ownerOf[tokenId] != msg.sender) revert NotOwner();

        agent.totalTrades++;
        if (success) agent.successfulTrades++;

        // Update reputation score (weighted moving average)
        // Successful trades: +5 to +15 based on PnL
        // Failed trades: -10 to -25 based on loss severity
        int256 delta;
        if (success) {
            delta = 5 + (pnlBps / 100); // More profit = more reputation
            if (delta > 15) delta = 15;
            if (delta < 5) delta = 5;
        } else {
            delta = -10 - (-pnlBps / 200); // More loss = more penalty
            if (delta < -25) delta = -25;
            if (delta > -10) delta = -10;
        }

        int256 newScore = int256(agent.reputationScore) + delta;
        if (newScore > 1000) newScore = 1000;
        if (newScore < 0) newScore = 0;
        agent.reputationScore = uint256(newScore);

        uint256 successRate = agent.totalTrades > 0
            ? (agent.successfulTrades * 10000) / agent.totalTrades
            : 0;

        emit TradeRecorded(tokenId, success, pnlBps);
        emit ReputationUpdated(tokenId, agent.reputationScore, agent.totalTrades, successRate);
    }

    /// @notice Deactivate an agent (owner only)
    function deactivateAgent(uint256 tokenId) external {
        if (ownerOf[tokenId] != msg.sender) revert NotOwner();
        agents[tokenId].active = false;
        emit AgentDeactivated(tokenId);
    }

    // ═══ VIEW FUNCTIONS ═══

    function getReputation(uint256 tokenId) external view returns (
        uint256 score,
        uint256 totalTrades,
        uint256 successfulTrades,
        uint256 successRate
    ) {
        Agent storage a = agents[tokenId];
        score = a.reputationScore;
        totalTrades = a.totalTrades;
        successfulTrades = a.successfulTrades;
        successRate = a.totalTrades > 0 ? (a.successfulTrades * 10000) / a.totalTrades : 0;
    }

    function getAgent(uint256 tokenId) external view returns (
        address wallet,
        uint256 reputationScore,
        uint256 totalTrades,
        bool active,
        uint256 registeredAt
    ) {
        Agent storage a = agents[tokenId];
        return (a.wallet, a.reputationScore, a.totalTrades, a.active, a.registeredAt);
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // ═══ MARKETPLACE INTEGRATION ═══

    address public reputationAggregator;
    address public immutable registryAdmin = msg.sender;

    event ReputationAggregatorSet(address indexed ra);

    error NotRegistryAdmin();

    /// @notice Set the ReputationAggregator address. One-time wiring after deployment.
    function setReputationAggregator(address ra) external {
        if (msg.sender != registryAdmin) revert NotRegistryAdmin();
        reputationAggregator = ra;
        emit ReputationAggregatorSet(ra);
    }
}
