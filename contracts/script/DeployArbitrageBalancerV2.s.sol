// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ArbitrageBalancer} from "../src/ArbitrageBalancer.sol";

contract DeployArbitrageBalancerV2 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Correct Balancer Vault address on Base Sepolia
        address vault = 0x93D199263632a4eF4BB438F1D6Ec4D8b73f57994;

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the ArbitrageBalancer
        ArbitrageBalancer arbitrageBalancer = new ArbitrageBalancer(vault, deployerAddress);

        vm.stopBroadcast();

        console2.log("ArbitrageBalancerV2 deployed to:", address(arbitrageBalancer));
    }
}
