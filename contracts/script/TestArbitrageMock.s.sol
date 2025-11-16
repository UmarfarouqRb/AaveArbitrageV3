// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {MockPool} from "../test/mocks/MockPool.sol";
import {MockUniswapV3Router} from "../test/mocks/MockUniswapV3Router.sol";
import {AaveArbitrageV3, SwapData, DEX} from "../src/AaveArbitrageV3.sol";

contract TestArbitrageMock is Script {
    uint256 private multiSigPk = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    address public multiSigWallet;

    AaveArbitrageV3 public arbitrageContract;
    MockERC20 public tokenA;
    MockERC20 public tokenB;
    MockPool public mockPool;
    MockUniswapV3Router public mockRouter;

    function run() external {
        multiSigWallet = vm.addr(multiSigPk);
        vm.deal(multiSigWallet, 1 ether);

        vm.startBroadcast();
        tokenA = new MockERC20("Token A", "TKNA");
        tokenB = new MockERC20("Token B", "TKNB");
        mockPool = new MockPool(address(tokenA));
        mockRouter = new MockUniswapV3Router();
        vm.stopBroadcast();

        vm.startBroadcast(multiSigWallet);
        arbitrageContract = new AaveArbitrageV3(address(mockPool), payable(multiSigWallet));
        vm.stopBroadcast();

        // Fund the Mock Pool with the initial loan asset
        tokenA.mint(address(mockPool), 10_000 * 10**18);

        uint256 loanAmount = 10_000 * 10**18;
        uint256 swap1AmountOut = 9_900 * 10**18;
        uint256 swap2AmountOut = 9_800 * 10**18;

        // FIX: Fund the Mock Router with the tokens it needs for the swaps
        tokenB.mint(address(mockRouter), swap1AmountOut);
        tokenA.mint(address(mockRouter), swap2AmountOut);

        vm.prank(multiSigWallet);
        arbitrageContract.setRouter(DEX.UniswapV3, address(mockRouter));

        SwapData[] memory swaps = new SwapData[](2);
        swaps[0] = SwapData({dex: DEX.UniswapV3, tokenIn: address(tokenA), tokenOut: address(tokenB), fee: 500, poolId: bytes32(0), path: new address[](0), amountOutMinimum: 0});
        swaps[1] = SwapData({dex: DEX.UniswapV3, tokenIn: address(tokenB), tokenOut: address(tokenA), fee: 500, poolId: bytes32(0), path: new address[](0), amountOutMinimum: 0});
        
        mockRouter.setAmountOut(address(tokenA), address(tokenB), 500, loanAmount, swap1AmountOut);
        mockRouter.setAmountOut(address(tokenB), address(tokenA), 500, swap1AmountOut, swap2AmountOut);

        bytes memory userData = abi.encode(swaps, 0);

        vm.expectRevert(bytes("Insufficient funds to repay"));
        
        vm.deal(address(arbitrageContract), 0.1 ether);

        arbitrageContract.startArbitrage(address(tokenA), loanAmount, userData);
    }
}
