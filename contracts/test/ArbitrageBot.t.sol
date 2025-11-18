// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {AaveArbitrageV3, Swap, DexType} from "../src/AaveArbitrageV3.sol";
import {IPancakeV3Router} from "../src/interfaces/IPancakeV3.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Redefined structs to match ABI encoding
struct AerodromeParams {
    bool stable;
    address factory;
    uint amountOutMin;
}

struct V3Params {
    bytes path;
    uint amountOutMinimum;
}

contract ManipulatedArbitrageTest is Test {
    // --- Fork & Wallet Configuration ---
    string internal constant BASE_MAINNET_RPC_URL = "https://base-mainnet.g.alchemy.com/v2/_rq09Uz--vhSNI9x6BGOb";
    uint256 internal constant FORK_BLOCK_NUMBER = 14_000_000;
    address internal deployer;
    address internal multiSig;
    address internal keeper;

    // --- Deployed Contracts & Tokens ---
    AaveArbitrageV3 public arbitrageContract;
    address internal constant WETH = 0x4200000000000000000000000000000000000006;
    address internal constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address internal constant AERO_FACTORY = 0x420DD381b31aEf6683db6B902084cB0FFECe40Da;
    address internal constant AERODROME_ROUTER = 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43;
    address internal constant PANCAKE_V3_ROUTER = 0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86;
    uint24 internal constant PANCAKE_POOL_FEE = 500; // 0.05%

    function setUp() public {
        vm.createSelectFork(BASE_MAINNET_RPC_URL, FORK_BLOCK_NUMBER);
        deployer = makeAddr("deployer");
        multiSig = makeAddr("multisig");
        keeper = makeAddr("keeper");

        vm.prank(deployer);
        arbitrageContract = new AaveArbitrageV3(multiSig);

        deal(WETH, deployer, 200 ether);
    }

    function test_ExecuteArbitrage_WithPriceManipulation() public {
        // 1. Manipulate market
        _manipulatePancakeMarket(150 ether);

        // 2. Setup arbitrage swaps
        address flashLoanToken = WETH;
        uint256 flashLoanAmount = 50 ether;
        uint256 aavePremium = flashLoanAmount * 9 / 10000; // Aave's 0.09% fee
        uint256 totalDebt = flashLoanAmount + aavePremium;

        Swap[] memory swaps = new Swap[](2);
        swaps[0] = _getAeroSwap(WETH, USDC, 1);
        swaps[1] = _getPancakeSwap(USDC, WETH, totalDebt);

        // 3. Execute arbitrage
        console.log("Triggering flash loan as keeper...");
        vm.prank(keeper); // Any address can now execute the trade
        arbitrageContract.executeArbitrage(flashLoanToken, flashLoanAmount, swaps);
        vm.stopPrank();

        // 4. Verify profit distribution
        uint256 totalProfit = 118418205050465624126; // From previous successful run
        uint256 expectedKeeperProfit = (totalProfit * 50) / 100;
        uint256 expectedMultisigProfit = totalProfit - expectedKeeperProfit;

        uint256 keeperBalance = IERC20(flashLoanToken).balanceOf(keeper);
        uint256 multiSigBalance = IERC20(flashLoanToken).balanceOf(multiSig);

        console.log("Keeper Profit: %s wei", keeperBalance);
        console.log("MultiSig Profit: %s wei", multiSigBalance);

        assertEq(keeperBalance, expectedKeeperProfit, "Keeper did not receive correct profit share.");
        assertEq(multiSigBalance, expectedMultisigProfit, "MultiSig did not receive correct profit share.");
    }

    // --- Helper Functions ---
    function _manipulatePancakeMarket(uint256 amount) internal {
        console.log("--- Manipulating PancakeSwap market ---");
        vm.startPrank(deployer);
        IERC20(WETH).approve(PANCAKE_V3_ROUTER, amount);
        IPancakeV3Router.ExactInputParams memory params = IPancakeV3Router.ExactInputParams({
            path: abi.encodePacked(WETH, PANCAKE_POOL_FEE, USDC),
            recipient: deployer,
            amountIn: amount,
            amountOutMinimum: 0
        });
        uint usdcReceived = IPancakeV3Router(PANCAKE_V3_ROUTER).exactInput(params);
        vm.stopPrank();
        console.log("Swapped %s WETH for %s USDC to create imbalance.", amount, usdcReceived);
    }

    function _getAeroSwap(address from, address to, uint amountOutMin) internal pure returns (Swap memory) {
        AerodromeParams memory params = AerodromeParams({ stable: false, factory: AERO_FACTORY, amountOutMin: amountOutMin });
        return Swap({ router: AERODROME_ROUTER, from: from, to: to, dex: DexType.Aerodrome, dexParams: abi.encode(params) });
    }

    function _getPancakeSwap(address from, address to, uint amountOutMin) internal pure returns (Swap memory) {
        V3Params memory params = V3Params({ path: abi.encodePacked(from, PANCAKE_POOL_FEE, to), amountOutMinimum: amountOutMin });
        return Swap({ router: PANCAKE_V3_ROUTER, from: from, to: to, dex: DexType.PancakeV3, dexParams: abi.encode(params) });
    }
}
