// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import "forge-std/console.sol";

contract VerifyCode is Script {
    address public uniswapV3Router = 0x2626664c2603336E57B271c5C0b26F421741e481;

    function run() external view {
        uint256 codeSize;
        address addr = uniswapV3Router;
        
        // This is an inline assembly block to get the size of the code at the specified address.
        assembly {
            codeSize := extcodesize(addr)
        }

        console.log("Code size for Uniswap V3 Router (0x2626664c2603336E57B271c5C0b26F421741e481):");
        console.log(codeSize);

        require(codeSize > 0, "No code found at router address!");
    }
}
