// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MockUniswapV3Router} from "../test/mocks/MockUniswapV3Router.sol";
import "forge-std/console.sol";

contract DeployMockRouter is Script {
    function run() external returns (address) {
        vm.startBroadcast();
        MockUniswapV3Router mockRouter = new MockUniswapV3Router();
        vm.stopBroadcast();
        console.log("MockUniswapV3Router deployed at:", address(mockRouter));
        return address(mockRouter);
    }
}
