// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentRegistry} from "./AgentRegistry.sol";

/// @title StakingVault — Agent skin-in-the-game deposit + slash mechanism
/// @notice Agent owners must stake minimum 10 AVAX before listing on the marketplace.
///         Stake is slashed on oracle failures, constraint violations, or malicious behavior.
///         User funds are NEVER held here — only agent owner stakes.
contract StakingVault {
    // ═══ CONSTANTS ═══
    uint256 public constant MIN_STAKE     = 10 ether;
    uint16  public constant MAX_SLASH_BPS = 5000;       // 50% max per slash
    uint256 public constant SLASH_COOLDOWN = 7 days;

    // ═══ STATE ═══
    AgentRegistry public immutable registry;
    address public immutable marketplace;   // set in constructor, only marketplace can slash

    mapping(uint256 agentId => uint256 balance)   public stakes;
    mapping(uint256 agentId => uint256 lastSlash) public lastSlashTime;
    mapping(uint256 agentId => bool paused)        public agentPaused;

    uint256 public slashedTotal;
    address public slashTreasury;
    address public immutable admin;

    // ═══ EVENTS ═══
    event Staked(uint256 indexed agentId, address indexed depositor, uint256 amount);
    event Unstaked(uint256 indexed agentId, address indexed owner, uint256 amount);
    event AgentSlashed(uint256 indexed agentId, uint256 slashAmount, string reason);
    event ToppedUp(uint256 indexed agentId, address indexed depositor, uint256 amount);
    event StakeRestored(uint256 indexed agentId);
    event SlashTreasuryUpdated(address newTreasury);

    // ═══ ERRORS ═══
    error BelowMinStake(uint256 sent, uint256 required);
    error NotAgentOwner();
    error HasSubscribers();
    error AgentIsPaused();
    error OnlyMarketplace();
    error OnlyAdmin();
    error SlashExceedsMax(uint256 bps, uint256 max);
    error CooldownActive(uint256 nextSlashTime);
    error ZeroAddress();
    error InsufficientStake();

    modifier onlyMarketplace() {
        if (msg.sender != marketplace) revert OnlyMarketplace();
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    constructor(
        address _registry,
        address _marketplace,
        address _slashTreasury
    ) {
        if (_registry == address(0) || _marketplace == address(0) || _slashTreasury == address(0))
            revert ZeroAddress();
        registry     = AgentRegistry(_registry);
        marketplace  = _marketplace;
        slashTreasury = _slashTreasury;
        admin        = msg.sender;
    }

    // ═══ AGENT OWNER FUNCTIONS ═══

    /// @notice Deposit AVAX stake for an agent. Must meet MIN_STAKE.
    /// @param agentId The ERC-8004 token ID of the agent
    function deposit(uint256 agentId) external payable {
        if (msg.value == 0) revert BelowMinStake(0, MIN_STAKE);
        stakes[agentId] += msg.value;
        emit Staked(agentId, msg.sender, msg.value);
    }

    /// @notice Top up stake (e.g., after a partial slash dropped balance below MIN_STAKE)
    /// @param agentId The agent to top up
    function topUp(uint256 agentId) external payable {
        if (msg.value == 0) revert InsufficientStake();
        bool wasPaused = agentPaused[agentId];
        stakes[agentId] += msg.value;
        if (wasPaused && stakes[agentId] >= MIN_STAKE) {
            emit StakeRestored(agentId);
            // Note: marketplace admin must manually re-review before re-activating listing
        }
        emit ToppedUp(agentId, msg.sender, msg.value);
    }

    /// @notice Withdraw full stake. Only allowed when agent has no active subscribers.
    /// @param agentId The agent to withdraw stake for
    function withdraw(uint256 agentId) external {
        if (registry.ownerOf(agentId) != msg.sender) revert NotAgentOwner();
        if (agentPaused[agentId]) revert AgentIsPaused();

        uint256 amount = stakes[agentId];
        if (amount == 0) revert InsufficientStake();

        stakes[agentId] = 0;
        (bool ok,) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");
        emit Unstaked(agentId, msg.sender, amount);
    }

    // ═══ MARKETPLACE-ONLY FUNCTIONS ═══

    /// @notice Slash a portion of an agent's stake.
    /// @param agentId Agent to slash
    /// @param bps Basis points to slash (max MAX_SLASH_BPS = 5000)
    /// @param reason Human-readable slash reason
    function slash(uint256 agentId, uint16 bps, string calldata reason) external onlyMarketplace {
        if (bps > MAX_SLASH_BPS) revert SlashExceedsMax(bps, MAX_SLASH_BPS);
        if (block.timestamp < lastSlashTime[agentId] + SLASH_COOLDOWN)
            revert CooldownActive(lastSlashTime[agentId] + SLASH_COOLDOWN);

        uint256 slashAmount = (stakes[agentId] * bps) / 10_000;
        stakes[agentId] -= slashAmount;
        slashedTotal += slashAmount;
        lastSlashTime[agentId] = block.timestamp;

        if (stakes[agentId] < MIN_STAKE) {
            agentPaused[agentId] = true;
        }

        (bool ok,) = payable(slashTreasury).call{value: slashAmount}("");
        require(ok, "Slash transfer failed");

        emit AgentSlashed(agentId, slashAmount, reason);
    }

    // ═══ VIEW FUNCTIONS ═══

    /// @notice Returns true if agent has enough stake and is not paused
    function isEligible(uint256 agentId) external view returns (bool) {
        return stakes[agentId] >= MIN_STAKE && !agentPaused[agentId];
    }

    function getStake(uint256 agentId) external view returns (uint256) {
        return stakes[agentId];
    }

    // ═══ ADMIN FUNCTIONS ═══

    function setSlashTreasury(address newTreasury) external onlyAdmin {
        if (newTreasury == address(0)) revert ZeroAddress();
        slashTreasury = newTreasury;
        emit SlashTreasuryUpdated(newTreasury);
    }

    receive() external payable {}
}
