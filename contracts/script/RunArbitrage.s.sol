// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {AaveArbitrageV3, SwapData, DEX} from "../src/AaveArbitrageV3.sol";

contract RunArbitrage is Script {
    // The deployed contract address from deployment/baseSepolia/AaveArbitrageV3.address
    AaveArbitrageV3 public arbitrageContract = AaveArbitrageV3(
        payable(0x3CB4290D4537bf9e7641ddF1cE33803419B62E46)
    );

    // Token addresses on Base Sepolia
    address public weth = 0x4200000000000000000000000000000000000006;
    address public usdc = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external {
        // We will borrow 1000 USDC
        uint256 loanAmount = 1000 * 10**6; // USDC has 6 decimals

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

        vm.startBroadcast();

        // Start the arbitrage
        arbitrageContract.startArbitrage(usdc, loanAmount, userData);

        vm.stopBroadcast();
    }
}
