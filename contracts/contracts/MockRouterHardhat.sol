// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniswapV2Router.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockRouterHardhat is IUniswapV2Router {

    uint256 public constant MOCK_VALUE = 1 ether;
    uint256 private multiplier;
    uint256 private divisor;

    constructor(uint256 _multiplier, uint256 _divisor) {
        multiplier = _multiplier;
        divisor = _divisor;
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint /* amountOutMin */,
        address[] calldata path,
        address to,
        uint /* deadline */
    ) external override returns (uint[] memory amounts) {
        amounts = new uint[](2);
        amounts[0] = amountIn;
        amounts[1] = amountIn * multiplier / divisor;

        address tokenIn = path[0];
        address tokenOut = path[path.length - 1];

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(to, amounts[1]);

        return amounts;
    }

    function getAmountsOut(uint256 amountIn, address[] memory /* path */) public view override returns (uint256[] memory amounts) {
        amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = amountIn * multiplier / divisor;
        return amounts;
    }

    // Dummy implementations for other functions
    function swapExactETHForTokens(uint /* amountOutMin */, address[] calldata /* path */, address /* to */, uint /* deadline */) external payable override returns (uint[] memory amounts) {
        amounts = new uint256[](2);
        amounts[0] = msg.value;
        amounts[1] = MOCK_VALUE;
        return amounts;
    }

    function swapETHForExactTokens(uint amountOut, address[] calldata /* path */, address /* to */, uint /* deadline */) external payable override returns (uint[] memory amounts) {
        amounts = new uint256[](2);
        amounts[0] = msg.value;
        amounts[1] = amountOut;
        return amounts;
    }

    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata /* path */, address /* to */, uint /* deadline */) external override returns (uint[] memory amounts) {
        amounts = new uint256[](2);
        amounts[0] = amountInMax;
        amounts[1] = amountOut;
        return amounts;
    }

     function swapExactTokensForETH(uint amountIn, uint /* amountOutMin */, address[] calldata /* path */, address /* to */, uint /* deadline */) external override returns (uint[] memory amounts) {
        amounts = new uint256[](2);
        amounts[0] = amountIn;
        amounts[1] = MOCK_VALUE;
        return amounts;
    } 

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata /* path */,
        address /* to */,
        uint /* deadline */
    ) external override returns (uint[] memory amounts) {
        amounts = new uint[](2);
        amounts[0] = amountInMax;
        amounts[1] = amountOut;
        return amounts;
    }
}