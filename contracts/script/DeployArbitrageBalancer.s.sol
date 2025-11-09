// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ArbitrageBalancer} from "../src/ArbitrageBalancer.sol";

contract DeployArbitrageBalancer is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Balancer Vault address on Base Sepolia
        address vault = 0x32296969Ef14EB0c6d29669C550D4a0449130230;

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the ArbitrageBalancer
        ArbitrageBalancer arbitrageBalancer = new ArbitrageBalancer(vault, deployerAddress);

        vm.stopBroadcast();

        console2.log("ArbitrageBalancer deployed to:", address(arbitrageBalancer));
    }
}
