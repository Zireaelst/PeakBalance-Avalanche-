// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ConstraintEngine} from "../src/ConstraintEngine.sol";

/// @title ConstraintEngine Unit Tests
contract ConstraintEngineTest {
    ConstraintEngine public engine;
    address public user = address(0x1);
    address public protocol = address(0x2);

    function setUp() public {
        address[] memory protocols = new address[](1);
        protocols[0] = protocol;

        engine = new ConstraintEngine(
            500,   // 5% max trade
            10,    // 10 daily trades
            1000,  // 10% stop-loss
            500,   // 5% drift threshold
            protocols
        );
    }

    function test_immutableParams() public view {
        assert(engine.MAX_TRADE_SIZE_BPS() == 500);
        assert(engine.MAX_DAILY_TRADES() == 10);
        assert(engine.STOP_LOSS_BPS() == 1000);
        assert(engine.DRIFT_THRESHOLD_BPS() == 500);
    }

    function test_protocolWhitelist() public view {
        assert(engine.whitelistedProtocols(protocol) == true);
        assert(engine.whitelistedProtocols(address(0x99)) == false);
    }

    function test_validateTrade_success() public {
        // Trade 4% of portfolio (below 5% max)
        (bool valid, string memory reason) = engine.validateTrade(
            user,
            protocol,
            4 ether,      // amountIn
            100 ether      // portfolioValue
        );
        assert(valid == true);
        assert(keccak256(bytes(reason)) == keccak256(bytes("OK")));
    }

    function test_validateTrade_exceedsMaxSize() public {
        // Trade 6% of portfolio (above 5% max)
        (bool valid, ) = engine.validateTrade(
            user,
            protocol,
            6 ether,      // 6% of 100
            100 ether
        );
        assert(valid == false);
    }

    function test_validateTrade_unwhitelistedProtocol() public {
        (bool valid, string memory reason) = engine.validateTrade(
            user,
            address(0x99),  // Not whitelisted
            1 ether,
            100 ether
        );
        assert(valid == false);
        assert(keccak256(bytes(reason)) == keccak256(bytes("Protocol not whitelisted")));
    }

    function test_validateTrade_dailyLimit() public {
        // Execute 10 trades (max)
        for (uint256 i = 0; i < 10; i++) {
            engine.validateTrade(user, protocol, 1 ether, 100 ether);
        }
        // 11th trade should fail
        (bool valid, string memory reason) = engine.validateTrade(
            user, protocol, 1 ether, 100 ether
        );
        assert(valid == false);
        assert(keccak256(bytes(reason)) == keccak256(bytes("Daily trade limit exceeded")));
    }

    function test_checkStopLoss_notBreached() public {
        engine.updatePeakValue(user, 100 ether);
        (bool breached, uint256 drawdown) = engine.checkStopLoss(user, 95 ether);
        assert(breached == false);
        assert(drawdown == 500); // 5%
    }

    function test_checkStopLoss_breached() public {
        engine.updatePeakValue(user, 100 ether);
        (bool breached, uint256 drawdown) = engine.checkStopLoss(user, 85 ether);
        assert(breached == true);
        assert(drawdown == 1500); // 15%
    }

    function test_isDriftExceeded_below() public view {
        assert(engine.isDriftExceeded(5200, 5000) == false); // 2% drift
    }

    function test_isDriftExceeded_above() public view {
        assert(engine.isDriftExceeded(5600, 5000) == true); // 6% drift
    }

    function test_getRemainingTrades() public {
        assert(engine.getRemainingTrades(user) == 10);
        engine.validateTrade(user, protocol, 1 ether, 100 ether);
        assert(engine.getRemainingTrades(user) == 9);
    }

    function test_updatePeakValue() public {
        engine.updatePeakValue(user, 100 ether);
        assert(engine.peakPortfolioValue(user) == 100 ether);
        // Lower value should not update peak
        engine.updatePeakValue(user, 90 ether);
        assert(engine.peakPortfolioValue(user) == 100 ether);
        // Higher value should update
        engine.updatePeakValue(user, 110 ether);
        assert(engine.peakPortfolioValue(user) == 110 ether);
    }
}
