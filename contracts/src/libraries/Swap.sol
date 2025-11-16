// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Swap {
    enum Dex {
        UniswapV3,
        PancakeSwapV3
    }

    struct SwapStep {
        Dex dex;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
    }
}
