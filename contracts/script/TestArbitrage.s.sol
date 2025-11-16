// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {AaveArbitrageV3, SwapData, DEX} from "../src/AaveArbitrageV3.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Define IWETH locally to avoid import issues
interface IWETH is IERC20 {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
}

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
    function refundETH() external payable;
}

contract TestArbitrage is Script {
    // The deployed contract address from deployment/baseSepolia/AaveArbitrageV3.address
    AaveArbitrageV3 public arbitrageContract = AaveArbitrageV3(
        payable(0x3CB4290D4537bf9e7641ddF1cE33803419B62E46)
    );

    // Token addresses on Base Sepolia
    address public weth = 0x4200000000000000000000000000000000000006;
    address public usdc = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    IWETH internal wethContract = IWETH(weth);

    // Uniswap V3 router address on Base Sepolia
    address public uniswapV3Router = 0x0227628f3F023bb0B980b67D528571c95c6DaC1c;

    // Our local whale that we will fund
    address private localWhale = address(0x1337);

    function run() external {
        // We will test with 10 USDC
        uint256 amount = 10 * 10**6; // USDC has 6 decimals

        // --- Create our own USDC whale ---
        // 1. Fund our local whale with 1 ETH
        vm.deal(localWhale, 1 ether);

        // 2. Swap ETH for USDC
        vm.startPrank(localWhale);
        
        // Wrap ETH to WETH
        wethContract.deposit{value: 0.1 ether}();
        
        // Approve router to spend WETH
        IERC20(weth).approve(uniswapV3Router, 0.1 ether);

        // Swap WETH for USDC
        IUniswapV3Router.ExactInputSingleParams memory params = IUniswapV3Router.ExactInputSingleParams({
            tokenIn: weth,
            tokenOut: usdc,
            fee: 3000,
            recipient: localWhale,
            deadline: block.timestamp,
            amountIn: 0.1 ether,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
        IUniswapV3Router(uniswapV3Router).exactInputSingle(params);
        vm.stopPrank();

        // --- Finished creating whale ---

        // We don't expect a profit, so minProfit is 0
        uint256 minProfit = 0;

        // Define the swap path
        SwapData[] memory swaps = new SwapData[](2);

        // Swap 1: USDC -> WETH
        swaps[0] = SwapData({
            dex: DEX.UniswapV3,
            tokenIn: usdc,
            tokenOut: weth,
            fee: 3000,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: 0
        });

        // Swap 2: WETH -> USDC
        swaps[1] = SwapData({
            dex: DEX.UniswapV3,
            tokenIn: weth,
            tokenOut: usdc,
            fee: 3000,
            poolId: bytes32(0),
            path: new address[](0),
            amountOutMinimum: 0
        });

        // Encode the user data
        bytes memory userData = abi.encode(swaps, minProfit);

        // Get the multi-sig address to prank it
        address multiSig = arbitrageContract.multiSig();

        // Prank the multi-sig to set the router
        vm.prank(multiSig);
        arbitrageContract.setRouter(DEX.UniswapV3, uniswapV3Router);

        // Fund the arbitrage contract with USDC from our local whale
        vm.prank(localWhale);
        IERC20(usdc).transfer(address(arbitrageContract), amount);

        // Start the test arbitrage
        arbitrageContract.testArbitrage(usdc, amount, userData);
    }
}
