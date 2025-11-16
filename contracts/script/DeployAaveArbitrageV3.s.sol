// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {AaveArbitrageV3} from "../src/AaveArbitrageV3.sol";

contract DeployAaveArbitrageV3 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Aave Pool Address Provider on Base Sepolia
        address aavePoolProvider = 0xE4C23309117Aa30342BFaae6c95c6478e0A4Ad00;

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the AaveArbitrageV3
        AaveArbitrageV3 aaveArbitrageV3 = new AaveArbitrageV3(aavePoolProvider, payable(deployerAddress));

        vm.stopBroadcast();

        console2.log("AaveArbitrageV3 deployed to:", address(aaveArbitrageV3));
    }
}
