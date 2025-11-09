// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ArbitrageBalancer, FlashLoanData} from "../src/ArbitrageBalancer.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract ExecuteFlashLoan is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // The address of the deployed ArbitrageBalancer contract
        address arbitrageBalancerAddress = 0x3954e20F9118302001EF0AF72cB3f0b0b9848f7b;
        ArbitrageBalancer arbitrageBalancer = ArbitrageBalancer(arbitrageBalancerAddress);

        // Token addresses on Base Sepolia
        address weth = 0x4200000000000000000000000000000000000006;
        address usdbc = 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8;

        // Router addresses on Base Sepolia
        address router0 = 0x4752ba8db2535835020432491D973347527A412c; // Uniswap V2
        address router1 = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506; // SushiSwap

        // Uniswap V2 Factory address for Base Sepolia
        address factory = 0x8909dc15e40173Ff4699323b28624242a5007456; // Uniswap V2 Factory

        // The address of the deployed UniswapV2TwapOracle contract
        address oracleAddress = 0x29db48C0e13eFbfee9F76275859149e4Fa7Cb0D7;

        // Loan parameters
        uint256 loanAmount = 1 ether; // 1 WETH
        uint256 minProfit = 0.001 ether; // 0.001 WETH

        // Set up paths
        address[] memory path0 = new address[](2);
        path0[0] = weth;
        path0[1] = usdbc;

        address[] memory path1 = new address[](2);
        path1[0] = usdbc;
        path1[1] = weth;

        address[] memory routers = new address[](2);
        routers[0] = router0;
        routers[1] = router1;

        address[][] memory paths = new address[][](2);
        paths[0] = path0;
        paths[1] = path1;

        // Prepare the userData for the flash loan
        FlashLoanData memory flashLoanData = FlashLoanData({
            inputToken: weth,
            middleToken: usdbc,
            routers: routers,
            paths: paths,
            minProfit: minProfit,
            minAmountOutFromFirstSwap: 0,
            twapMaxDeviationBps: 0,
            oracleAddress: oracleAddress,
            factory: factory
        });

        bytes memory userData = abi.encode(flashLoanData);

        vm.startBroadcast(deployerPrivateKey);

        arbitrageBalancer.startFlashloan(weth, loanAmount, userData);

        vm.stopBroadcast();

        console2.log("Flash loan initiated!");
    }
}
