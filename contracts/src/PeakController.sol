// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PeakVault} from "./PeakVault.sol";
import {AgentRegistry} from "./AgentRegistry.sol";

/// @title PeakController — User-facing control panel for agent management
/// @notice Allows users to pause/resume their agent, force checks, and manage settings.
///         Sits between the user and the vault/agent system.
contract PeakController {
    PeakVault public immutable vault;
    AgentRegistry public immutable registry;

    struct UserSettings {
        bool    isPaused;
        uint256 agentNFTId;
        uint256 lastForceCheck;
        uint256 targetAllocationBps;  // Default: 5000 = 50%
    }

    mapping(address => UserSettings) public settings;

    // ═══ EVENTS ═══
    event AgentPaused(address indexed user, uint256 indexed agentId);
    event AgentResumed(address indexed user, uint256 indexed agentId);
    event ForceCheckRequested(address indexed user, uint256 timestamp);
    event TargetAllocationUpdated(address indexed user, uint256 newTargetBps);
    event AgentLinked(address indexed user, uint256 indexed agentId);

    // ═══ ERRORS ═══
    error AlreadyPaused();
    error NotPaused();
    error ForceCheckCooldown();
    error InvalidAllocation();
    error NoAgentLinked();

    constructor(address _vault, address _registry) {
        vault = PeakVault(payable(_vault));
        registry = AgentRegistry(_registry);
    }

    /// @notice Link an agent NFT to your account
    function linkAgent(uint256 agentNFTId) external {
        settings[msg.sender].agentNFTId = agentNFTId;
        settings[msg.sender].targetAllocationBps = 5000; // Default 50/50
        emit AgentLinked(msg.sender, agentNFTId);
    }

    /// @notice Pause the agent — stops all automated trading
    function pauseAgent() external {
        if (settings[msg.sender].isPaused) revert AlreadyPaused();
        settings[msg.sender].isPaused = true;
        emit AgentPaused(msg.sender, settings[msg.sender].agentNFTId);
    }

    /// @notice Resume the agent — re-enables automated trading
    function resumeAgent() external {
        if (!settings[msg.sender].isPaused) revert NotPaused();
        settings[msg.sender].isPaused = false;
        emit AgentResumed(msg.sender, settings[msg.sender].agentNFTId);
    }

    /// @notice Force an immediate portfolio check (max once per 5 minutes)
    function forceCheck() external {
        if (block.timestamp < settings[msg.sender].lastForceCheck + 5 minutes) {
            revert ForceCheckCooldown();
        }
        settings[msg.sender].lastForceCheck = block.timestamp;
        emit ForceCheckRequested(msg.sender, block.timestamp);
    }

    /// @notice Update target allocation (within safe bounds: 20-80%)
    function setTargetAllocation(uint256 newTargetBps) external {
        if (newTargetBps < 2000 || newTargetBps > 8000) revert InvalidAllocation();
        settings[msg.sender].targetAllocationBps = newTargetBps;
        emit TargetAllocationUpdated(msg.sender, newTargetBps);
    }

    // ═══ VIEW FUNCTIONS ═══

    function isPaused(address user) external view returns (bool) {
        return settings[user].isPaused;
    }

    function getAgentId(address user) external view returns (uint256) {
        return settings[user].agentNFTId;
    }

    function getTargetAllocation(address user) external view returns (uint256) {
        return settings[user].targetAllocationBps;
    }

    function canForceCheck(address user) external view returns (bool) {
        return block.timestamp >= settings[user].lastForceCheck + 5 minutes;
    }
}
