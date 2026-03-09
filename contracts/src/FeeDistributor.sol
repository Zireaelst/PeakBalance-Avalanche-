// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "./interfaces/IERC20.sol";
import {AgentRegistry} from "./AgentRegistry.sol";

/// @title FeeDistributor — Performance + subscription fee split with high-watermark
/// @notice Collects all fees from subscriptions and profitable trades.
///         Uses pull pattern: accrues balances, owners claim when ready.
///         CEI pattern throughout to prevent reentrancy.
///         NEVER holds user principal — only earned fees.
contract FeeDistributor {
    // ═══ STATE ═══
    IERC20         public immutable usdc;
    AgentRegistry  public immutable registry;
    address        public immutable admin;
    address        public protocolTreasury;
    address        public marketplace;
    address        public controller;

    uint16 public protocolFeeBps = 50;  // 0.5%
    uint256 public constant MIN_PROFIT_USD = 1e6; // $1 in USDC (6 decimals)
    uint256 public constant MONTHLY_FEE_CAP_BPS = 1000; // 10% of AUM per month

    mapping(uint256 agentId => uint256) public agentOwnerAccrued;
    mapping(address user => mapping(uint256 agentId => uint256)) public highWatermark;
    mapping(address user => mapping(uint256 agentId => uint256)) public monthlyFeePaid;
    mapping(address user => mapping(uint256 agentId => uint256)) public monthlyFeeReset;
    uint256 public protocolAccrued;

    // ═══ EVENTS ═══
    event SubscriptionFeesSplit(uint256 indexed agentId, uint256 ownerShare, uint256 protocolShare);
    event PerformanceFeeRecorded(address indexed user, uint256 indexed agentId, uint256 agentFee, uint256 protocolFee);
    event FeesClaimed(uint256 indexed agentId, address indexed owner, uint256 amount);
    event ProtocolFeesClaimed(address indexed treasury, uint256 amount);
    event WatermarkUpdated(address indexed user, uint256 indexed agentId, uint256 newWatermark);

    // ═══ ERRORS ═══
    error OnlyAdmin();
    error OnlyMarketplace();
    error OnlyController();
    error ZeroAddress();
    error NothingToClaim();
    error NotAgentOwner();

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    modifier onlyMarketplace() {
        if (msg.sender != marketplace) revert OnlyMarketplace();
        _;
    }

    modifier onlyController() {
        if (msg.sender != controller) revert OnlyController();
        _;
    }

    constructor(address _usdc, address _registry, address _protocolTreasury) {
        if (_usdc == address(0) || _registry == address(0) || _protocolTreasury == address(0))
            revert ZeroAddress();
        usdc             = IERC20(_usdc);
        registry         = AgentRegistry(_registry);
        protocolTreasury = _protocolTreasury;
        admin            = msg.sender;
    }

    // ═══ WIRING ═══

    function setMarketplace(address _marketplace) external onlyAdmin {
        if (_marketplace == address(0)) revert ZeroAddress();
        marketplace = _marketplace;
    }

    function setController(address _controller) external onlyAdmin {
        if (_controller == address(0)) revert ZeroAddress();
        controller = _controller;
    }

    // ═══ SUBSCRIPTION FEE FLOW ═══
    // Called by AgentMarketplace.subscribe() — USDC already transferred to this contract

    function splitSubscriptionFee(uint256 agentId, uint256 amount) external onlyMarketplace {
        uint256 protocolShare = (amount * protocolFeeBps) / 10_000;
        uint256 ownerShare    = amount - protocolShare;

        protocolAccrued           += protocolShare;
        agentOwnerAccrued[agentId] += ownerShare;

        emit SubscriptionFeesSplit(agentId, ownerShare, protocolShare);
    }

    // ═══ PERFORMANCE FEE FLOW ═══
    // Called by PeakController after each profitable trade

    /// @notice Record performance fee for a trade.
    /// @param agentId   The agent that executed the trade
    /// @param user      The user whose vault was traded
    /// @param profitUSD Trade profit in USDC (6 decimals)
    /// @param perfFeeBps Agent's configured performance fee in basis points
    /// @param portfolioUSD User's total portfolio value in USDC (6 decimals) — for monthly cap
    function recordPerformance(
        uint256 agentId,
        address user,
        uint256 profitUSD,
        uint16  perfFeeBps,
        uint256 portfolioUSD
    ) external onlyController returns (uint256 totalFeeCharged) {
        // Rule 1: No fee on losses or dust profits
        if (profitUSD < MIN_PROFIT_USD) return 0;

        // Rule 2: High watermark — only fee on net new highs
        uint256 wm = highWatermark[user][agentId];
        uint256 currentValue = portfolioUSD; // simplified — in production track cumulative
        if (currentValue <= wm) return 0;
        highWatermark[user][agentId] = currentValue;
        emit WatermarkUpdated(user, agentId, currentValue);

        // Rule 3: Monthly fee cap — max 10% of AUM per month
        _resetMonthlyIfNeeded(user, agentId);
        uint256 monthCap = (portfolioUSD * MONTHLY_FEE_CAP_BPS) / 10_000;
        if (monthlyFeePaid[user][agentId] >= monthCap) return 0;

        // Compute fees
        uint256 agentFee    = (profitUSD * perfFeeBps) / 10_000;
        uint256 protocolFee = (profitUSD * protocolFeeBps) / 10_000;
        uint256 totalFee    = agentFee + protocolFee;

        // Apply monthly cap
        uint256 remaining = monthCap - monthlyFeePaid[user][agentId];
        if (totalFee > remaining) {
            totalFee    = remaining;
            agentFee    = (remaining * perfFeeBps) / (perfFeeBps + protocolFeeBps);
            protocolFee = remaining - agentFee;
        }

        // CEI: update state before any transfer
        agentOwnerAccrued[agentId]        += agentFee;
        protocolAccrued                   += protocolFee;
        monthlyFeePaid[user][agentId]     += totalFee;

        emit PerformanceFeeRecorded(user, agentId, agentFee, protocolFee);
        return totalFee;
    }

    // ═══ CLAIM FUNCTIONS ═══

    /// @notice Agent owner claims accrued fees. CEI: zero balance BEFORE transfer.
    function claimAgentFees(uint256 agentId) external {
        if (registry.ownerOf(agentId) != msg.sender) revert NotAgentOwner();
        uint256 amount = agentOwnerAccrued[agentId];
        if (amount == 0) revert NothingToClaim();

        // CEI pattern — state updated BEFORE transfer
        agentOwnerAccrued[agentId] = 0;
        usdc.transfer(msg.sender, amount);

        emit FeesClaimed(agentId, msg.sender, amount);
    }

    /// @notice Protocol admin claims protocol treasury fees.
    function claimProtocolFees() external onlyAdmin {
        uint256 amount = protocolAccrued;
        if (amount == 0) revert NothingToClaim();

        // CEI pattern
        protocolAccrued = 0;
        usdc.transfer(protocolTreasury, amount);

        emit ProtocolFeesClaimed(protocolTreasury, amount);
    }

    // ═══ VIEW FUNCTIONS ═══

    function getAccruedFees(uint256 agentId) external view returns (uint256) {
        return agentOwnerAccrued[agentId];
    }

    // ═══ INTERNAL ═══

    function _resetMonthlyIfNeeded(address user, uint256 agentId) internal {
        if (block.timestamp >= monthlyFeeReset[user][agentId] + 30 days) {
            monthlyFeePaid[user][agentId]  = 0;
            monthlyFeeReset[user][agentId] = block.timestamp;
        }
    }

    // ═══ ADMIN ═══

    function setProtocolFeeBps(uint16 bps) external onlyAdmin {
        require(bps <= 100, "Max 1%");
        protocolFeeBps = bps;
    }

    function setProtocolTreasury(address treasury) external onlyAdmin {
        if (treasury == address(0)) revert ZeroAddress();
        protocolTreasury = treasury;
    }
}
