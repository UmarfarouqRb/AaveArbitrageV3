// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AaveArbitrageV3.sol";

contract DeployAaveArbitrageV3 is Script {
    function run() external {
        address multisig = vm.envAddress("MULTISIG_ADDRESS");

        vm.startBroadcast();

        new AaveArbitrageV3(multisig);

        vm.stopBroadcast();
    }
}
