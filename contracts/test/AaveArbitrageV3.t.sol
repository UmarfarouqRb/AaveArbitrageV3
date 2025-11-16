// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {AaveArbitrageV3, DEX, SwapData} from "../src/AaveArbitrageV3.sol";
import {MockPoolAddressesProvider} from "./mocks/MockPoolAddressesProvider.sol";
import {MockPool} from "./mocks/MockPool.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {MockUniswapV3Router} from "./mocks/MockUniswapV3Router.sol";
import {MockMultiSig} from "./mocks/MockMultiSig.sol"; // Import MockMultiSig

contract AaveArbitrageV3Test is Test {
    AaveArbitrageV3 public aaveArbitrage;
    MockPoolAddressesProvider public mockAddressesProvider;
    MockPool public mockPool;
    MockERC20 public tokenA;
    MockERC20 public tokenB;
    MockUniswapV3Router public routerA;
    MockUniswapV3Router public routerB;

    MockMultiSig public multiSig; // Changed to MockMultiSig type

    event NoProfit(address indexed token, uint256 loanAmount, uint256 finalBalance, uint256 totalRepayment);

    function setUp() public {
        multiSig = new MockMultiSig(); // Deploy MockMultiSig

        tokenA = new MockERC20("Token A", "TKA");
        tokenB = new MockERC20("Token B", "TKB");

        mockPool = new MockPool(address(tokenA));
        mockAddressesProvider = new MockPoolAddressesProvider(address(mockPool));

        // Pass the address of the deployed MockMultiSig contract
        aaveArbitrage = new AaveArbitrageV3(address(mockAddressesProvider), payable(address(multiSig)));

        routerA = new MockUniswapV3Router();
        routerB = new MockUniswapV3Router();

        vm.startPrank(address(multiSig));
        aaveArbitrage.setRouter(DEX.UniswapV3, address(routerA));
        aaveArbitrage.setRouter(DEX.PancakeSwapV3, address(routerB)); // Use a different DEX enum for the second router
        vm.stopPrank();

        tokenA.mint(address(routerA), 1_000_000e18);
        tokenB.mint(address(routerA), 1_000_000e18 * 1000);
        tokenA.mint(address(routerB), 1_000_000e18);
        tokenB.mint(address(routerB), 1_000_000e18 * 1010);
    }

    function testArbitrage() public {
        uint256 loanAmount = 10e18;
        uint24 fee = 3000;

        uint256 amountBFromSale = (loanAmount * 1010e18) / 1e18;
        routerB.setAmountOut(address(tokenA), address(tokenB), fee, loanAmount, amountBFromSale);

        uint256 finalAmountA = (amountBFromSale * 1e18) / 1000e18;
        routerA.setAmountOut(address(tokenB), address(tokenA), fee, amountBFromSale, finalAmountA);

        SwapData[] memory swaps = new SwapData[](2);
        swaps[0] = SwapData({
            dex: DEX.PancakeSwapV3, // Sell high
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: amountBFromSale
        });
        swaps[1] = SwapData({
            dex: DEX.UniswapV3, // Buy low
            tokenIn: address(tokenB),
            tokenOut: address(tokenA),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: finalAmountA
        });

        uint256 minProfit = 1;
        bytes memory userData = abi.encode(swaps, minProfit);

        tokenA.mint(address(mockPool), loanAmount);

        vm.startPrank(address(multiSig));
        aaveArbitrage.startArbitrage(address(tokenA), loanAmount, userData);
        vm.stopPrank();

        assertGt(tokenA.balanceOf(address(multiSig)), 0, "Profit should be > 0");
    }

    function test_NotEnoughProfit() public {
        uint256 loanAmount = 10e18;
        uint24 fee = 3000;

        uint256 amountBFromSale = (loanAmount * 1010e18) / 1e18;
        routerB.setAmountOut(address(tokenA), address(tokenB), fee, loanAmount, amountBFromSale);

        uint256 finalAmountA = (amountBFromSale * 1e18) / 1000e18;
        routerA.setAmountOut(address(tokenB), address(tokenA), fee, amountBFromSale, finalAmountA);

        SwapData[] memory swaps = new SwapData[](2);
        swaps[0] = SwapData({
            dex: DEX.PancakeSwapV3, // Sell high
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: amountBFromSale
        });
        swaps[1] = SwapData({
            dex: DEX.UniswapV3, // Buy low
            tokenIn: address(tokenB),
            tokenOut: address(tokenA),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: finalAmountA
        });

        uint256 minProfit = 1000e18; // Set a very high minProfit
        bytes memory userData = abi.encode(swaps, minProfit);

        tokenA.mint(address(mockPool), loanAmount);

        vm.startPrank(address(multiSig));
        vm.expectEmit(true, false, false, true);
        emit NoProfit(address(tokenA), loanAmount, finalAmountA, loanAmount);
        aaveArbitrage.startArbitrage(address(tokenA), loanAmount, userData);
        vm.stopPrank();

        assertEq(tokenA.balanceOf(address(multiSig)), 0, "Profit should be 0");
    }

    function test_RevertIf_InvalidFirstSwap() public {
        uint256 loanAmount = 10e18;
        uint24 fee = 3000;

        SwapData[] memory swaps = new SwapData[](2);
        swaps[0] = SwapData({
            dex: DEX.PancakeSwapV3,
            tokenIn: address(tokenB), // Invalid, should be tokenA
            tokenOut: address(tokenA),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: 0
        });
        swaps[1] = SwapData({
            dex: DEX.UniswapV3,
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: 0
        });

        uint256 minProfit = 1;
        bytes memory userData = abi.encode(swaps, minProfit);

        tokenA.mint(address(mockPool), loanAmount);

        vm.startPrank(address(multiSig));
        vm.expectRevert("First swap tokenIn must be borrowed asset");
        aaveArbitrage.startArbitrage(address(tokenA), loanAmount, userData);
        vm.stopPrank();
    }

    function test_RevertIf_InvalidLastSwap() public {
        uint256 loanAmount = 10e18;
        uint24 fee = 3000;

        SwapData[] memory swaps = new SwapData[](2);
        swaps[0] = SwapData({
            dex: DEX.PancakeSwapV3,
            tokenIn: address(tokenA),
            tokenOut: address(tokenB),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: 0
        });
        swaps[1] = SwapData({
            dex: DEX.UniswapV3,
            tokenIn: address(tokenB),
            tokenOut: address(tokenB), // Invalid, should be tokenA
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: 0
        });

        uint256 minProfit = 1;
        bytes memory userData = abi.encode(swaps, minProfit);

        tokenA.mint(address(mockPool), loanAmount);

        vm.startPrank(address(multiSig));
        vm.expectRevert("Last swap tokenOut must be borrowed asset");
        aaveArbitrage.startArbitrage(address(tokenA), loanAmount, userData);
        vm.stopPrank();
    }

    function test_RevertIf_RouterNotSet() public {
        uint256 loanAmount = 10e18;
        uint24 fee = 3000;

        SwapData[] memory swaps = new SwapData[](1);
        swaps[0] = SwapData({
            dex: DEX.Aerodrome, // Router not set for this DEX
            tokenIn: address(tokenA),
            tokenOut: address(tokenA),
            fee: fee,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: 0
        });

        uint256 minProfit = 1;
        bytes memory userData = abi.encode(swaps, minProfit);

        tokenA.mint(address(mockPool), loanAmount);

        vm.startPrank(address(multiSig));
        vm.expectRevert("Router not set");
        aaveArbitrage.startArbitrage(address(tokenA), loanAmount, userData);
        vm.stopPrank();
    }

    function test_RevertIf_EmptySwaps() public {
        uint256 loanAmount = 10e18;

        SwapData[] memory swaps = new SwapData[](0);

        uint256 minProfit = 1;
        bytes memory userData = abi.encode(swaps, minProfit);

        tokenA.mint(address(mockPool), loanAmount);

        vm.startPrank(address(multiSig));
        vm.expectRevert("No swaps");
        aaveArbitrage.startArbitrage(address(tokenA), loanAmount, userData);
        vm.stopPrank();
    }
}
