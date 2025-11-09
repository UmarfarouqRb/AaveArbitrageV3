// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {UniswapV2TwapOracle} from "../src/UniswapV2TwapOracle.sol";

contract DeployOracle is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the UniswapV2TwapOracle
        UniswapV2TwapOracle oracle = new UniswapV2TwapOracle();

        vm.stopBroadcast();

        console2.log("UniswapV2TwapOracle deployed to:", address(oracle));
    }
}
