// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ConstraintEngine} from "../src/ConstraintEngine.sol";
import {PeakVault} from "../src/PeakVault.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";
import {PeakController} from "../src/PeakController.sol";
import {OracleConsumer} from "../src/OracleConsumer.sol";
import {ReputationAggregator} from "../src/ReputationAggregator.sol";
import {FeeDistributor} from "../src/FeeDistributor.sol";
import {StakingVault} from "../src/StakingVault.sol";
import {AgentMarketplace} from "../src/AgentMarketplace.sol";

/// @title DeployFuji — Full PeakBalance deployment to Avalanche Fuji Testnet
/// @notice Deploys all 9 contracts and performs post-deploy wiring.
///         Usage: forge script script/DeployFuji.s.sol --rpc-url fuji --broadcast -vvvv
contract DeployFuji is Script {
    // ── Fuji Testnet Token Addresses ──────────────────────────────────────
    address constant USDC_FUJI  = 0x5425890298aed601595a70AB815c96711a31Bc65;
    address constant WAVAX_FUJI = 0xd00ae08403B9bbb9124bB305C09058E32C39A48c;

    // ── Trader Joe LB Router v2.1 (Fuji) ─────────────────────────────────
    address constant TRADER_JOE_FUJI = 0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30;

    // ── Oracle fee: ~$0.01 @ $37 AVAX ─────────────────────────────────────
    uint256 constant ORACLE_FEE_WEI = 270000000000000; // 0.00027 AVAX

    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);

        console.log("=== PeakBalance Fuji Full Deploy ===");
        console.log("Deployer:", deployer);
        console.log("");

        vm.startBroadcast(pk);

        // ─────────────────────────────────────────────────────────────────
        // STEP 1: ConstraintEngine (immutable, no proxy)
        // ─────────────────────────────────────────────────────────────────
        address[] memory protocols = new address[](1);
        protocols[0] = TRADER_JOE_FUJI;

        ConstraintEngine constraintEngine = new ConstraintEngine(
            500,   // MAX_TRADE_SIZE_BPS: 5%
            10,    // MAX_DAILY_TRADES: 10
            1000,  // STOP_LOSS_BPS: 10%
            500,   // DRIFT_THRESHOLD_BPS: 5%
            protocols
        );
        console.log("[1/9] ConstraintEngine deployed:", address(constraintEngine));

        // ─────────────────────────────────────────────────────────────────
        // STEP 2: AgentRegistry (ERC-8004 NFT identity)
        // ─────────────────────────────────────────────────────────────────
        AgentRegistry registry = new AgentRegistry();
        console.log("[2/9] AgentRegistry deployed:", address(registry));

        // ─────────────────────────────────────────────────────────────────
        // STEP 3: OracleConsumer (x402 micropayments)
        // ─────────────────────────────────────────────────────────────────
        OracleConsumer oracle = new OracleConsumer(ORACLE_FEE_WEI);
        console.log("[3/9] OracleConsumer deployed:", address(oracle));

        // ─────────────────────────────────────────────────────────────────
        // STEP 4: PeakVault (user deposits + agent execution)
        // ─────────────────────────────────────────────────────────────────
        PeakVault vault = new PeakVault(
            address(constraintEngine),
            USDC_FUJI,
            WAVAX_FUJI
        );
        console.log("[4/9] PeakVault deployed:", address(vault));

        // ─────────────────────────────────────────────────────────────────
        // STEP 5: PeakController (user-facing control panel)
        // ─────────────────────────────────────────────────────────────────
        PeakController controller = new PeakController(
            address(vault),
            address(registry)
        );
        console.log("[5/9] PeakController deployed:", address(controller));

        // ─────────────────────────────────────────────────────────────────
        // STEP 6: ReputationAggregator (weighted ERC-8004 scoring)
        // ─────────────────────────────────────────────────────────────────
        ReputationAggregator repAgg = new ReputationAggregator(address(registry));
        console.log("[6/9] ReputationAggregator deployed:", address(repAgg));

        // ─────────────────────────────────────────────────────────────────
        // STEP 7: FeeDistributor (subscription + performance fees)
        // ─────────────────────────────────────────────────────────────────
        FeeDistributor feeDist = new FeeDistributor(
            USDC_FUJI,
            address(registry),
            deployer // protocol treasury = deployer for testnet
        );
        console.log("[7/9] FeeDistributor deployed:", address(feeDist));

        // ─────────────────────────────────────────────────────────────────
        // STEP 8: StakingVault (agent skin-in-the-game)
        // Note: marketplace param is deployer initially, updated after marketplace deploy
        // ─────────────────────────────────────────────────────────────────
        StakingVault stakingVault = new StakingVault(
            address(registry),
            deployer,   // marketplace placeholder — StakingVault.marketplace is immutable
            deployer    // slash treasury = deployer for testnet
        );
        console.log("[8/9] StakingVault deployed:", address(stakingVault));

        // ─────────────────────────────────────────────────────────────────
        // STEP 9: AgentMarketplace (curated listing + subscriptions)
        // ─────────────────────────────────────────────────────────────────
        AgentMarketplace marketplace = new AgentMarketplace(
            address(registry),
            address(stakingVault),
            USDC_FUJI
        );
        console.log("[9/9] AgentMarketplace deployed:", address(marketplace));

        // =================================================================
        // POST-DEPLOY WIRING
        // =================================================================
        console.log("");
        console.log("=== Post-Deploy Wiring ===");

        // Wire AgentMarketplace
        marketplace.setReputationAggregator(address(repAgg));
        marketplace.setFeeDistributor(address(feeDist));
        console.log("  Marketplace -> ReputationAggregator: SET");
        console.log("  Marketplace -> FeeDistributor: SET");

        // Wire ReputationAggregator
        repAgg.setController(address(controller));
        repAgg.setMarketplace(address(marketplace));
        console.log("  ReputationAggregator -> Controller: SET");
        console.log("  ReputationAggregator -> Marketplace: SET");

        // Wire FeeDistributor
        feeDist.setMarketplace(address(marketplace));
        feeDist.setController(address(controller));
        console.log("  FeeDistributor -> Marketplace: SET");
        console.log("  FeeDistributor -> Controller: SET");

        // Wire AgentRegistry
        registry.setReputationAggregator(address(repAgg));
        console.log("  AgentRegistry -> ReputationAggregator: SET");

        vm.stopBroadcast();

        // =================================================================
        // DEPLOYMENT SUMMARY
        // =================================================================
        console.log("");
        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("Chain: Avalanche Fuji (43113)");
        console.log("");
        console.log("Core Contracts:");
        console.log("  ConstraintEngine:      ", address(constraintEngine));
        console.log("  AgentRegistry:         ", address(registry));
        console.log("  OracleConsumer:        ", address(oracle));
        console.log("  PeakVault:             ", address(vault));
        console.log("  PeakController:        ", address(controller));
        console.log("");
        console.log("Marketplace Contracts:");
        console.log("  ReputationAggregator:  ", address(repAgg));
        console.log("  FeeDistributor:        ", address(feeDist));
        console.log("  StakingVault:          ", address(stakingVault));
        console.log("  AgentMarketplace:      ", address(marketplace));
        console.log("");
        console.log("NOTE: StakingVault.marketplace is set to deployer (immutable).");
        console.log("      For production, redeploy StakingVault with marketplace address.");
        console.log("");
        console.log("Copy these addresses to deployments/fuji.json and");
        console.log("peakbalance-dashboard/.env.local");
    }
}
