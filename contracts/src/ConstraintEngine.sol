// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ConstraintEngine — Immutable safety rails for PeakBalance
/// @notice Enforces trade-size caps, daily limits, stop-loss drawdown, and protocol whitelisting.
///         All critical parameters are set at deployment and CANNOT be changed.
contract ConstraintEngine {
    // ═══ IMMUTABLE CONSTRAINTS ═══
    uint256 public immutable MAX_TRADE_SIZE_BPS;   // e.g. 500 = 5% of portfolio
    uint256 public immutable MAX_DAILY_TRADES;     // e.g. 10
    uint256 public immutable STOP_LOSS_BPS;        // e.g. 1000 = 10% drawdown
    uint256 public immutable DRIFT_THRESHOLD_BPS;  // e.g. 500 = 5%
    uint256 public constant BPS = 10_000;

    // ═══ STORAGE ═══
    mapping(address => uint256) public dailyTradeCount;
    mapping(address => uint256) public dailyResetTimestamp;
    mapping(address => uint256) public peakPortfolioValue;
    mapping(address => bool)    public whitelistedProtocols;
    address public immutable owner;

    // ═══ EVENTS ═══
    event TradeValidated(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, bool valid, string reason);
    event StopLossTriggered(address indexed user, uint256 currentValue, uint256 peakValue, uint256 drawdownBps);
    event ProtocolWhitelisted(address indexed protocol, bool status);
    event DailyCountReset(address indexed user, uint256 timestamp);

    // ═══ ERRORS ═══
    error TradeExceedsMaxSize(uint256 tradeBps, uint256 maxBps);
    error DailyLimitExceeded(uint256 count, uint256 max);
    error StopLossBreached(uint256 drawdownBps, uint256 maxBps);
    error ProtocolNotWhitelisted(address protocol);
    error OnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(
        uint256 _maxTradeSizeBps,
        uint256 _maxDailyTrades,
        uint256 _stopLossBps,
        uint256 _driftThresholdBps,
        address[] memory _whitelistedProtocols
    ) {
        MAX_TRADE_SIZE_BPS = _maxTradeSizeBps;
        MAX_DAILY_TRADES = _maxDailyTrades;
        STOP_LOSS_BPS = _stopLossBps;
        DRIFT_THRESHOLD_BPS = _driftThresholdBps;
        owner = msg.sender;

        for (uint256 i = 0; i < _whitelistedProtocols.length; i++) {
            whitelistedProtocols[_whitelistedProtocols[i]] = true;
            emit ProtocolWhitelisted(_whitelistedProtocols[i], true);
        }
    }

    /// @notice Validate a proposed trade against all constraints
    /// @param user The user whose portfolio is being traded
    /// @param protocol The DEX protocol address being used
    /// @param amountIn The input amount for the trade
    /// @param portfolioValue The user's total portfolio value in USD (18 decimals)
    /// @return valid Whether the trade passes all constraints
    /// @return reason Human-readable reason if invalid
    function validateTrade(
        address user,
        address protocol,
        uint256 amountIn,
        uint256 portfolioValue
    ) external returns (bool valid, string memory reason) {
        // Check 1: Protocol whitelist
        if (!whitelistedProtocols[protocol]) {
            emit TradeValidated(user, address(0), address(0), amountIn, false, "Protocol not whitelisted");
            return (false, "Protocol not whitelisted");
        }

        // Check 2: Max trade size (as % of portfolio)
        uint256 tradeBps = (amountIn * BPS) / portfolioValue;
        if (tradeBps > MAX_TRADE_SIZE_BPS) {
            emit TradeValidated(user, address(0), address(0), amountIn, false, "Trade exceeds max size");
            return (false, "Trade exceeds max size");
        }

        // Check 3: Daily trade limit
        _resetDailyIfNeeded(user);
        if (dailyTradeCount[user] >= MAX_DAILY_TRADES) {
            emit TradeValidated(user, address(0), address(0), amountIn, false, "Daily trade limit exceeded");
            return (false, "Daily trade limit exceeded");
        }

        // Check 4: Stop-loss drawdown
        if (peakPortfolioValue[user] > 0) {
            uint256 drawdownBps = ((peakPortfolioValue[user] - portfolioValue) * BPS) / peakPortfolioValue[user];
            if (drawdownBps >= STOP_LOSS_BPS) {
                emit StopLossTriggered(user, portfolioValue, peakPortfolioValue[user], drawdownBps);
                return (false, "Stop-loss triggered");
            }
        }

        // All checks passed — increment daily counter
        dailyTradeCount[user]++;

        // Update peak if current value is higher
        if (portfolioValue > peakPortfolioValue[user]) {
            peakPortfolioValue[user] = portfolioValue;
        }

        emit TradeValidated(user, address(0), address(0), amountIn, true, "OK");
        return (true, "OK");
    }

    /// @notice Check if stop-loss has been breached
    function checkStopLoss(address user, uint256 currentValue) external view returns (bool breached, uint256 drawdownBps) {
        uint256 peak = peakPortfolioValue[user];
        if (peak == 0 || currentValue >= peak) return (false, 0);
        drawdownBps = ((peak - currentValue) * BPS) / peak;
        breached = drawdownBps >= STOP_LOSS_BPS;
    }

    /// @notice Get remaining trades for today
    function getRemainingTrades(address user) external view returns (uint256) {
        if (block.timestamp >= dailyResetTimestamp[user] + 1 days) {
            return MAX_DAILY_TRADES;
        }
        if (dailyTradeCount[user] >= MAX_DAILY_TRADES) return 0;
        return MAX_DAILY_TRADES - dailyTradeCount[user];
    }

    /// @notice Check if portfolio drift exceeds threshold
    function isDriftExceeded(uint256 currentAllocationBps, uint256 targetAllocationBps) external view returns (bool) {
        uint256 drift = currentAllocationBps > targetAllocationBps
            ? currentAllocationBps - targetAllocationBps
            : targetAllocationBps - currentAllocationBps;
        return drift >= DRIFT_THRESHOLD_BPS;
    }

    /// @dev Reset daily trade count if 24h have passed
    function _resetDailyIfNeeded(address user) internal {
        if (block.timestamp >= dailyResetTimestamp[user] + 1 days) {
            dailyTradeCount[user] = 0;
            dailyResetTimestamp[user] = block.timestamp;
            emit DailyCountReset(user, block.timestamp);
        }
    }

    /// @notice Update peak value (called by vault after deposits/trades)
    function updatePeakValue(address user, uint256 currentValue) external {
        if (currentValue > peakPortfolioValue[user]) {
            peakPortfolioValue[user] = currentValue;
        }
    }
}
