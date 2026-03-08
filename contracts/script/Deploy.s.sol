// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ConstraintEngine} from "../src/ConstraintEngine.sol";
import {PeakVault} from "../src/PeakVault.sol";
import {AgentRegistry} from "../src/AgentRegistry.sol";
import {PeakController} from "../src/PeakController.sol";
import {OracleConsumer} from "../src/OracleConsumer.sol";

/// @title DeployPeakBalance — Deploys all PeakBalance contracts
contract DeployPeakBalance {
    function run(
        address usdc,
        address wavax,
        address traderJoe
    ) external returns (
        ConstraintEngine constraintEngine,
        PeakVault vault,
        AgentRegistry registry,
        PeakController controller,
        OracleConsumer oracle
    ) {
        // 1. Deploy ConstraintEngine with immutable params
        address[] memory protocols = new address[](1);
        protocols[0] = traderJoe;
        constraintEngine = new ConstraintEngine(
            500,   // MAX_TRADE_SIZE: 5%
            10,    // MAX_DAILY_TRADES: 10
            1000,  // STOP_LOSS: 10%
            500,   // DRIFT_THRESHOLD: 5%
            protocols
        );

        // 2. Deploy PeakVault
        vault = new PeakVault(address(constraintEngine), usdc, wavax);

        // 3. Deploy AgentRegistry
        registry = new AgentRegistry();

        // 4. Deploy PeakController  
        controller = new PeakController(address(vault), address(registry));

        // 5. Deploy OracleConsumer (fee: ~$0.01 in AVAX @ $37 = ~270000000000000 wei)
        oracle = new OracleConsumer(270000000000000);
    }
}
