// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {AaveArbitrageV3} from "../src/AaveArbitrageV3.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IAerodromeRouter} from "../src/interfaces/IAerodrome.sol";
import {IPancakeV3Router} from "../src/interfaces/IPancakeV3.sol";

contract TestArbitrageMainnetFork is Test {
    AaveArbitrageV3 public arbitrage;
    address public constant MULTISIG = 0x4722533d359c39144a10602f543956105E69755b;

    // Base Token Addresses
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public constant AERO = 0x940181a94A35A4569E4529A3CDfB74e38FD98631;

    // Base DEX Routers
    address public constant AERODROME_ROUTER = 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43;
    address public constant PANCAKESWAP_ROUTER = 0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86;
    address public constant AERODROME_FACTORY = 0x420DD381b31aEf6683db6B902084cB0FFECe40Da;

    uint256 baseFork;

    function setUp() public {
        baseFork = vm.createFork("https://mainnet.base.org");
        vm.selectFork(baseFork);

        arbitrage = new AaveArbitrageV3(MULTISIG);
    }

    function testArbitrageMainnetFork() public {
        uint256 flashLoanAmount = 10000 * 10**6; // 10,000 USDC

        // 1. Swap USDC for AERO on Aerodrome
        AaveArbitrageV3.AerodromeParams memory aeroParams1 = AaveArbitrageV3.AerodromeParams({
            stable: false,
            factory: AERODROME_FACTORY,
            amountOutMin: 0
        });

        AaveArbitrageV3.Swap memory swap1 = AaveArbitrageV3.Swap({
            router: AERODROME_ROUTER,
            from: USDC,
            to: AERO,
            dex: AaveArbitrageV3.DexType.Aerodrome,
            dexParams: abi.encode(aeroParams1)
        });

        // 2. Swap AERO for WETH on PancakeSwap V3
        bytes memory path2 = abi.encodePacked(AERO, uint24(500), WETH);

        AaveArbitrageV3.V3Params memory v3Params2 = AaveArbitrageV3.V3Params({
            path: path2,
            amountOutMinimum: 0
        });

        AaveArbitrageV3.Swap memory swap2 = AaveArbitrageV3.Swap({
            router: PANCAKESWAP_ROUTER,
            from: AERO,
            to: WETH,
            dex: AaveArbitrageV3.DexType.PancakeV3,
            dexParams: abi.encode(v3Params2)
        });

        // 3. Swap WETH for USDC on Aerodrome
        AaveArbitrageV3.AerodromeParams memory aeroParams3 = AaveArbitrageV3.AerodromeParams({
            stable: false,
            factory: AERODROME_FACTORY,
            amountOutMin: 0
        });

        AaveArbitrageV3.Swap memory swap3 = AaveArbitrageV3.Swap({
            router: AERODROME_ROUTER,
            from: WETH,
            to: USDC,
            dex: AaveArbitrageV3.DexType.Aerodrome,
            dexParams: abi.encode(aeroParams3)
        });

        AaveArbitrageV3.Swap[] memory swaps = new AaveArbitrageV3.Swap[](3);
        swaps[0] = swap1;
        swaps[1] = swap2;
        swaps[2] = swap3;

        arbitrage.executeArbitrage(USDC, flashLoanAmount, swaps);

        uint256 profit = IERC20(USDC).balanceOf(address(arbitrage));
        assertTrue(profit > 0, "Arbitrage was not profitable");
    }
}
