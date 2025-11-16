solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {AaveArbitrageV3, SwapData, DEX} from "../src/AaveArbitrageV3.sol";
import {MockMultiSig} from "../test/mocks/MockMultiSig.sol";

// --- Mainnet Fork Simulation Script ---

contract TestArbitrageMainnetFork is Script {
    // --- Base Mainnet Contract Addresses (Correct Checksums) ---
    address public constant AAVE_V3_POOL = 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5; // Corrected Aave Pool
    address public constant UNISWAP_V3_ROUTER = 0x2626664c2603336E57B271c5C0b26F421741e481;
    address public constant AERODROME_ROUTER = 0xCf77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Native USDC on Base
    address public constant WETH = 0x4200000000000000000000000000000000000006; // WETH on Base
    address public constant AAVE = 0xe32659740f83465451D45117215255476AED4862; // AAVE on Base

    AaveArbitrageV3 public arbitrageContract;
    MockMultiSig public mockMultiSig;

    // Use the same private key as the mock test for consistency
    uint256 private multiSigPk = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    address payable public deployer;


    function run() external {
        deployer = payable(vm.addr(multiSigPk));
        vm.deal(deployer, 1 ether); // Provide gas for deployment

        // 1. Deploy the mock multisig and the arbitrage contract
        vm.startBroadcast(deployer);
        mockMultiSig = new MockMultiSig(deployer);
        arbitrageContract = new AaveArbitrageV3(AAVE_V3_POOL, deployer, payable(address(mockMultiSig)));
        vm.stopBroadcast();

        // 2. Set the REAL Uniswap and Aerodrome routers on our contract
        vm.prank(deployer);
        arbitrageContract.setRouter(DEX.UniswapV3, UNISWAP_V3_ROUTER);
        vm.prank(deployer);
        arbitrageContract.setRouter(DEX.AerodromeV3, AERODROME_ROUTER);

        // 3. Define the 2-hop swap path: USDC -> WETH on AerodromeV3, WETH -> USDC on UniswapV3
        SwapData[] memory swaps = new SwapData[](2);
        uint24 uniswapV3Fee = 3000; // 0.3% fee tier for Uniswap V3
        uint24 aerodromeFee = 0;    // Assuming 0 fee for Aerodrome V2-style router functions based on swapExactTokensForTokens

        // Swap 1: USDC -> WETH on AerodromeV3
        swaps[0] = SwapData({
            dex: DEX.AerodromeV3,
            tokenIn: USDC,
            tokenOut: WETH,
            fee: aerodromeFee, // Fee might not be used directly by Aerodrome's swapExactTokensForTokens
            poolId: bytes32(0),
            path: new address[](2),
            curve_i: 0,
            curve_j: 0,
            curvePoolAddress: address(0),
            amountOutMinimum: 0
        });
        swaps[0].path[0] = USDC;
        swaps[0].path[1] = WETH;

        // Swap 2: WETH -> USDC on UniswapV3
        swaps[1] = SwapData({
            dex: DEX.UniswapV3,
            tokenIn: WETH,
            tokenOut: USDC,
            fee: uniswapV3Fee,
            poolId: bytes32(0),
            path: new address[](0), // Not used for UniswapV3 exactInputSingle
            curve_i: 0,
            curve_j: 0,
            curvePoolAddress: address(0),
            amountOutMinimum: 0
        });

        uint256 loanAmount = 1_000_000 * 10**6; // 1,000,000 USDC (USDC has 6 decimals)
        bytes memory userData = abi.encode(swaps, 0); // minProfit = 0 for initial testing

        // 4. Provide the contract with gas money to pay for swaps.
        //    This is crucial as the contract has no funds initially.
        vm.deal(address(arbitrageContract), 0.5 ether);

        // 5. Execute the arbitrage. This will either succeed or, more likely,
        //    revert with "Insufficient funds to repay" if not profitable.
        console.log("Simulating 2-hop arbitrage (AerodromeV3 USDC->WETH, UniswapV3 WETH->USDC) with 1,000,000 USDC loan...");
        try arbitrageContract.startArbitrage(USDC, loanAmount, userData) {}
        catch (bytes memory reason) {
            console.log("Arbitrage failed:");
            console.logBytes(reason);
        }
    }
}