// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IUniswapV3Router} from "../../src/AaveArbitrageV3.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUniswapV3Router is IUniswapV3Router {
    mapping(bytes32 => uint256) public amountOuts;

    function setAmountOut(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint256 amountOut
    ) external {
        bytes32 key = keccak256(abi.encodePacked(tokenIn, tokenOut, fee, amountIn));
        amountOuts[key] = amountOut;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable override returns (uint256 amountOut) {
        bytes32 key = keccak256(abi.encodePacked(params.tokenIn, params.tokenOut, params.fee, params.amountIn));
        amountOut = amountOuts[key];
        require(amountOut > 0, "No amount out set");
        require(amountOut >= params.amountOutMinimum, "Slippage");

        // Transfer tokens
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        IERC20(params.tokenOut).transfer(params.recipient, amountOut);
    }
}
