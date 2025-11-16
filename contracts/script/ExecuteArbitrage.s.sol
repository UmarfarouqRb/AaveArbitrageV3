// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AaveArbitrageV3, SwapData, DEX, ArbitrageData} from "../src/AaveArbitrageV3.sol";

contract ExecuteArbitrage is Script {
    // The deployed contract address
    AaveArbitrageV3 public arbitrageContract = AaveArbitrageV3(
        payable(0x3CB4290D4537bf9e7641ddF1cE33803419B62E46)
    );
    
    // Token addresses on Base Sepolia
    address public weth = 0x4200000000000000000000000000000000000006;
    address public usdc = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    // Uniswap V3 Router on Base Sepolia
    address public uniswapV3Router = 0x2626664c2603336E57B271c5C0b26F421741e481;

    function run() external {
        vm.startBroadcast();

        // Set the Uniswap V3 router address in the contract
        arbitrageContract.setRouter(DEX.UniswapV3, uniswapV3Router);

        // --- Define the Arbitrage Path ---
        SwapData[] memory swaps = new SwapData[](2);
        
        // 1. Swap WETH for USDC on Uniswap V3
        swaps[0] = SwapData({
            dex: DEX.UniswapV3,
            tokenIn: weth,
            tokenOut: usdc,
            fee: 3000, // 0.3% fee tier
            poolId: bytes32(0), // Not used for Uniswap
            path: new address[](0), // Not used for Uniswap
            amountOutMinimum: 0
        });
        
        // 2. Swap USDC back to WETH on Uniswap V3
        swaps[1] = SwapData({
            dex: DEX.UniswapV3,
            tokenIn: usdc,
            tokenOut: weth,
            fee: 3000, // 0.3% fee tier
            poolId: bytes32(0), // Not used for Uniswap
            path: new address[](0), // Not used for Uniswap
            amountOutMinimum: 0
        });

        // --- Encode Arbitrage Data ---
        ArbitrageData memory arbitrageData = ArbitrageData({
            swaps: swaps,
            minProfit: 1000000000000000 // 0.001 ETH
        });
        bytes memory params = abi.encode(arbitrageData);

        // --- Start the Arbitrage ---
        arbitrageContract.startArbitrage(weth, 1e18, params); // Borrow 1 WETH

        vm.stopBroadcast();
    }
}
