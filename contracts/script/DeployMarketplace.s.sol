// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {StakingVault} from "../src/StakingVault.sol";
import {AgentMarketplace} from "../src/AgentMarketplace.sol";
import {ReputationAggregator} from "../src/ReputationAggregator.sol";
import {FeeDistributor} from "../src/FeeDistributor.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";

/// @notice Deploy marketplace system. Requires existing ConstraintEngine, AgentRegistry,
///         OracleConsumer, PeakVault, and PeakController already deployed on Fuji.
contract DeployMarketplace is Script {
    // ── Fuji existing deployments (update before running) ──────────────────
    address constant AGENT_REGISTRY  = address(0); // TODO: fill after base deploy
    address constant PEAK_CONTROLLER = address(0); // TODO: fill after base deploy
    address constant USDC_FUJI       = 0x5425890298aed601595a70AB815c96711a31Bc65;
    // ───────────────────────────────────────────────────────────────────────

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);

        vm.startBroadcast(pk);

        // ── STEP 5: ReputationAggregator ────────────────────────────────
        ReputationAggregator repAgg = new ReputationAggregator(AGENT_REGISTRY);
        console.log("ReputationAggregator:", address(repAgg));

        // ── STEP 6: FeeDistributor ───────────────────────────────────────
        FeeDistributor feeDist = new FeeDistributor(USDC_FUJI, AGENT_REGISTRY, deployer);
        console.log("FeeDistributor:", address(feeDist));

        // ── STEP 7 placeholder: StakingVault (needs marketplace addr) ────
        // Deployed below after we have marketplace

        // ── STEP 8: AgentMarketplace (temp — needs StakingVault addr) ────
        // Deploy StakingVault with a placeholder then update
        // Pattern: deploy StakingVault with deterministic salt instead

        // Simple two-step: deploy marketplace with deployer as temp stakingVault
        // then we'll use Create2 or pre-compute. For testnet, deploy in order:

        // Temp: Deploy StakingVault with deployer as treasury placeholder
        StakingVault stakingVault = new StakingVault(
            AGENT_REGISTRY,
            deployer,     // marketplace — overwritten after marketplace deployed
            deployer      // slash treasury = deployer for testnet
        );
        console.log("StakingVault (pre-wire):", address(stakingVault));

        AgentMarketplace marketplace = new AgentMarketplace(
            AGENT_REGISTRY,
            address(stakingVault),
            USDC_FUJI
        );
        console.log("AgentMarketplace:", address(marketplace));

        // ── STEP 9: Post-deploy wiring ───────────────────────────────────
        marketplace.setReputationAggregator(address(repAgg));
        marketplace.setFeeDistributor(address(feeDist));

        repAgg.setController(PEAK_CONTROLLER);
        repAgg.setMarketplace(address(marketplace));

        feeDist.setMarketplace(address(marketplace));
        feeDist.setController(PEAK_CONTROLLER);

        AgentRegistry(AGENT_REGISTRY).setReputationAggregator(address(repAgg));

        console.log("--- Wiring complete ---");
        console.log("NOTE: Update StakingVault.marketplace via admin call after deploy");
        console.log("NOTE: Set PeakController.setFeeDistributor and setReputationAggregator");

        vm.stopBroadcast();
    }
}
