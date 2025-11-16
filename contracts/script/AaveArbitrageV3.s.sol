// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {AaveArbitrageV3} from "../src/AaveArbitrageV3.sol";

contract DeployAaveArbitrageV3 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address aavePoolAddressesProvider = vm.envAddress("AAVE_POOL_ADDRESSES_PROVIDER");
        address payable multiSig = payable(vm.envAddress("MULTISIG_ADDRESS"));

        require(deployerPrivateKey != 0, "PRIVATE_KEY not set");
        require(aavePoolAddressesProvider != address(0), "AAVE_POOL_ADDRESSES_PROVIDER not set");
        require(multiSig != address(0), "MULTISIG_ADDRESS not set");

        vm.startBroadcast(deployerPrivateKey);

        AaveArbitrageV3 aaveArbitrageV3 = new AaveArbitrageV3(aavePoolAddressesProvider, multiSig);

        console2.log("AaveArbitrageV3 deployed to:", address(aaveArbitrageV3));

        vm.stopBroadcast();
    }
}
