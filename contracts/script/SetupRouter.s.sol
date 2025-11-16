// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {AaveArbitrageV3, DEX} from "../src/AaveArbitrageV3.sol";

contract SetupRouter is Script {
    // The deployed contract address
    AaveArbitrageV3 public arbitrageContract = AaveArbitrageV3(
        payable(0x3CB4290D4537bf9e7641ddF1cE33803419B62E46)
    );

    // Uniswap V3 Router on Base Sepolia
    address public uniswapV3Router = 0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4;

    function run() external {
        vm.startBroadcast();

        // Set the Uniswap V3 router address in the contract
        arbitrageContract.setRouter(DEX.UniswapV3, uniswapV3Router);

        vm.stopBroadcast();
    }
}