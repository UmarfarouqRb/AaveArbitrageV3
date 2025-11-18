// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../../src/AaveArbitrageV3.sol";

contract DeployAaveArbitrageV3 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address multisig = vm.envAddress("MULTISIG_ADDRESS");
        string memory etherscanApiKey = vm.envString("BASESCAN_API_KEY");

        vm.startBroadcast(deployerPrivateKey);

        new AaveArbitrageV3(multisig);

        vm.stopBroadcast();
    }
}
