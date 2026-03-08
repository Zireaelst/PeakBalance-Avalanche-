// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "./interfaces/IERC20.sol";
import {ConstraintEngine} from "./ConstraintEngine.sol";

/// @title PeakVault — User deposit vault for PeakBalance
/// @notice Holds user AVAX and USDC deposits. Only the authorized agent can execute
///         trades, and all trades must pass through the ConstraintEngine first.
contract PeakVault {
    // ═══ STATE ═══
    ConstraintEngine public immutable constraintEngine;
    address public immutable usdc;
    address public immutable wavax;
    
    struct UserVault {
        uint256 avaxBalance;    // native AVAX held (in wei)
        uint256 usdcBalance;    // USDC held (6 decimals)
        uint256 depositedAt;
        bool    emergencyExited;
    }

    mapping(address => UserVault) public vaults;
    mapping(address => address)   public authorizedAgent; // user => agent wallet
    
    bool public globalPaused;
    address public immutable owner;

    // ═══ EVENTS ═══
    event Deposited(address indexed user, address token, uint256 amount);
    event Withdrawn(address indexed user, address token, uint256 amount);
    event EmergencyExitExecuted(address indexed user, uint256 avaxReturned, uint256 usdcReturned);
    event AgentAuthorized(address indexed user, address indexed agent);
    event AgentRevoked(address indexed user, address indexed agent);
    event TradeExecuted(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    // ═══ ERRORS ═══
    error NotAuthorizedAgent();
    error VaultPaused();
    error AlreadyExited();
    error InsufficientBalance();
    error OnlyOwner();
    error InvalidAmount();

    modifier onlyAgent(address user) {
        if (msg.sender != authorizedAgent[user]) revert NotAuthorizedAgent();
        _;
    }

    modifier whenNotPaused() {
        if (globalPaused) revert VaultPaused();
        _;
    }

    constructor(address _constraintEngine, address _usdc, address _wavax) {
        constraintEngine = ConstraintEngine(_constraintEngine);
        usdc = _usdc;
        wavax = _wavax;
        owner = msg.sender;
    }

    // ═══ USER FUNCTIONS ═══

    /// @notice Deposit AVAX into vault
    function depositAVAX() external payable whenNotPaused {
        if (msg.value == 0) revert InvalidAmount();
        vaults[msg.sender].avaxBalance += msg.value;
        if (vaults[msg.sender].depositedAt == 0) {
            vaults[msg.sender].depositedAt = block.timestamp;
        }
        emit Deposited(msg.sender, address(0), msg.value);
    }

    /// @notice Deposit USDC into vault (requires approval first)
    function depositUSDC(uint256 amount) external whenNotPaused {
        if (amount == 0) revert InvalidAmount();
        IERC20(usdc).transferFrom(msg.sender, address(this), amount);
        vaults[msg.sender].usdcBalance += amount;
        if (vaults[msg.sender].depositedAt == 0) {
            vaults[msg.sender].depositedAt = block.timestamp;
        }
        emit Deposited(msg.sender, usdc, amount);
    }

    /// @notice Withdraw AVAX from vault (user-only, no agent permission needed)
    function withdrawAVAX(uint256 amount) external {
        if (vaults[msg.sender].avaxBalance < amount) revert InsufficientBalance();
        vaults[msg.sender].avaxBalance -= amount;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "AVAX transfer failed");
        emit Withdrawn(msg.sender, address(0), amount);
    }

    /// @notice Withdraw USDC from vault (user-only)
    function withdrawUSDC(uint256 amount) external {
        if (vaults[msg.sender].usdcBalance < amount) revert InsufficientBalance();
        vaults[msg.sender].usdcBalance -= amount;
        IERC20(usdc).transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, usdc, amount);
    }

    /// @notice Emergency exit — withdraw everything immediately. Cannot be undone.
    function emergencyExit() external {
        UserVault storage v = vaults[msg.sender];
        if (v.emergencyExited) revert AlreadyExited();
        v.emergencyExited = true;

        uint256 avax = v.avaxBalance;
        uint256 usdcBal = v.usdcBalance;
        v.avaxBalance = 0;
        v.usdcBalance = 0;

        if (avax > 0) {
            (bool ok, ) = msg.sender.call{value: avax}("");
            require(ok, "AVAX transfer failed");
        }
        if (usdcBal > 0) {
            IERC20(usdc).transfer(msg.sender, usdcBal);
        }

        // Revoke agent
        delete authorizedAgent[msg.sender];

        emit EmergencyExitExecuted(msg.sender, avax, usdcBal);
    }

    /// @notice Authorize an agent wallet to trade on your behalf
    function authorizeAgent(address agent) external {
        authorizedAgent[msg.sender] = agent;
        emit AgentAuthorized(msg.sender, agent);
    }

    /// @notice Revoke agent authorization
    function revokeAgent() external {
        address agent = authorizedAgent[msg.sender];
        delete authorizedAgent[msg.sender];
        emit AgentRevoked(msg.sender, agent);
    }

    // ═══ AGENT FUNCTIONS ═══

    /// @notice Execute a swap on behalf of user (agent-only, constraint-checked)
    /// @dev In production, this would call Trader Joe router. For now, records the trade.
    function executeTrade(
        address user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 portfolioValueUSD
    ) external onlyAgent(user) whenNotPaused returns (uint256 amountOut) {
        // Validate through ConstraintEngine
        (bool valid, string memory reason) = constraintEngine.validateTrade(
            user, tokenIn, amountIn, portfolioValueUSD
        );
        require(valid, reason);

        // Execute swap (simplified — production would use DEX router)
        if (tokenIn == address(0) || tokenIn == wavax) {
            if (vaults[user].avaxBalance < amountIn) revert InsufficientBalance();
            vaults[user].avaxBalance -= amountIn;
            // In production: swap via Trader Joe router
            // For now: simulate with 1:1 value conversion
            amountOut = amountIn; // placeholder
            vaults[user].usdcBalance += amountOut;
        } else {
            if (vaults[user].usdcBalance < amountIn) revert InsufficientBalance();
            vaults[user].usdcBalance -= amountIn;
            amountOut = amountIn; // placeholder
            vaults[user].avaxBalance += amountOut;
        }

        // Update peak portfolio value
        constraintEngine.updatePeakValue(user, portfolioValueUSD);

        emit TradeExecuted(user, tokenIn, tokenOut, amountIn, amountOut);
    }

    // ═══ VIEW FUNCTIONS ═══

    function getPortfolioValue(address user) external view returns (uint256 avax, uint256 usdcBal) {
        avax = vaults[user].avaxBalance;
        usdcBal = vaults[user].usdcBalance;
    }

    function isEmergencyExited(address user) external view returns (bool) {
        return vaults[user].emergencyExited;
    }

    // ═══ ADMIN ═══
    function setPaused(bool _paused) external {
        if (msg.sender != owner) revert OnlyOwner();
        globalPaused = _paused;
    }

    receive() external payable {}
}
