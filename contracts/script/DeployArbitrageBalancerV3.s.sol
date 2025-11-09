// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ArbitrageBalancer} from "../src/ArbitrageBalancer.sol";

contract DeployArbitrageBalancerV3 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Mock Vault address on Base Sepolia
        address vault = 0xBfd13B8931e82D8FbeCB93a014B54b3C1B03AEBb;

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the ArbitrageBalancer
        ArbitrageBalancer arbitrageBalancer = new ArbitrageBalancer(vault, deployerAddress);

        vm.stopBroadcast();

        console2.log("ArbitrageBalancerV3 deployed to:", address(arbitrageBalancer));
    }
}
