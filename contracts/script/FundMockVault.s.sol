// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {IWETH} from "../src/interfaces/IWETH.sol";

contract FundMockVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // WETH address on Base Sepolia
        address wethAddress = 0x4200000000000000000000000000000000000006;

        // MockVault address on Base Sepolia
        address mockVaultAddress = 0xBfd13B8931e82D8FbeCB93a014B54b3C1B03AEBb;

        uint256 amount = 5 ether;

        vm.startBroadcast(deployerPrivateKey);

        IWETH weth = IWETH(wethAddress);

        // Deposit ETH to get WETH
        weth.deposit{value: amount}();

        // Transfer WETH to the MockVault
        weth.transfer(mockVaultAddress, amount);

        vm.stopBroadcast();

        console2.log("Funded MockVault with 5 WETH.");
    }
}
