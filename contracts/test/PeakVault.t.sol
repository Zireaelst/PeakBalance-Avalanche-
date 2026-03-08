// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PeakVault} from "../src/PeakVault.sol";
import {ConstraintEngine} from "../src/ConstraintEngine.sol";

/// @title Mock ERC20 for testing
contract MockERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(string memory _n, string memory _s, uint8 _d) {
        name = _n; symbol = _s; decimals = _d;
    }
    function mint(address to, uint256 amt) external { balanceOf[to] += amt; }
    function approve(address spender, uint256 amt) external returns (bool) { allowance[msg.sender][spender] = amt; return true; }
    function transfer(address to, uint256 amt) external returns (bool) { balanceOf[msg.sender] -= amt; balanceOf[to] += amt; return true; }
    function transferFrom(address from, address to, uint256 amt) external returns (bool) { allowance[from][msg.sender] -= amt; balanceOf[from] -= amt; balanceOf[to] += amt; return true; }
}

/// @title PeakVault Unit Tests
contract PeakVaultTest {
    PeakVault public vault;
    ConstraintEngine public engine;
    MockERC20 public usdc;
    MockERC20 public wavax;
    address public user = address(0x1);
    address public agent = address(0x2);
    address public protocol = address(0x3);

    function setUp() public {
        usdc = new MockERC20("USD Coin", "USDC", 6);
        wavax = new MockERC20("Wrapped AVAX", "WAVAX", 18);

        address[] memory protocols = new address[](1);
        protocols[0] = protocol;
        engine = new ConstraintEngine(500, 10, 1000, 500, protocols);
        vault = new PeakVault(address(engine), address(usdc), address(wavax));
    }

    function test_depositAVAX() public {
        // Simulate user depositing 1 AVAX
        vault.depositAVAX{value: 1 ether}();
        (uint256 avax, uint256 usdcBal) = vault.getPortfolioValue(address(this));
        assert(avax == 1 ether);
        assert(usdcBal == 0);
    }

    function test_depositUSDC() public {
        usdc.mint(address(this), 1000e6);
        usdc.approve(address(vault), 1000e6);
        vault.depositUSDC(1000e6);
        (, uint256 usdcBal) = vault.getPortfolioValue(address(this));
        assert(usdcBal == 1000e6);
    }

    function test_withdrawAVAX() public {
        vault.depositAVAX{value: 2 ether}();
        vault.withdrawAVAX(1 ether);
        (uint256 avax, ) = vault.getPortfolioValue(address(this));
        assert(avax == 1 ether);
    }

    function test_withdrawUSDC() public {
        usdc.mint(address(this), 500e6);
        usdc.approve(address(vault), 500e6);
        vault.depositUSDC(500e6);
        vault.withdrawUSDC(200e6);
        (, uint256 usdcBal) = vault.getPortfolioValue(address(this));
        assert(usdcBal == 300e6);
    }

    function test_authorizeAgent() public {
        vault.authorizeAgent(agent);
        assert(vault.authorizedAgent(address(this)) == agent);
    }

    function test_revokeAgent() public {
        vault.authorizeAgent(agent);
        vault.revokeAgent();
        assert(vault.authorizedAgent(address(this)) == address(0));
    }

    function test_emergencyExit() public {
        vault.depositAVAX{value: 3 ether}();
        usdc.mint(address(this), 1000e6);
        usdc.approve(address(vault), 1000e6);
        vault.depositUSDC(1000e6);

        vault.emergencyExit();

        (uint256 avax, uint256 usdcBal) = vault.getPortfolioValue(address(this));
        assert(avax == 0);
        assert(usdcBal == 0);
        assert(vault.isEmergencyExited(address(this)) == true);
    }

    function test_emergencyExit_cantDoTwice() public {
        vault.depositAVAX{value: 1 ether}();
        vault.emergencyExit();

        bool failed = false;
        try vault.emergencyExit() {
            // Should not reach here
        } catch {
            failed = true;
        }
        assert(failed == true);
    }

    receive() external payable {}
}
