// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// --- DEX Interfaces ---
interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface IUniswapV3Router {
    struct ExactInputParams {
        bytes path;
        address recipient;
        uint deadline;
        uint amountIn;
        uint amountOutMinimum;
    }
    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut);
}

// --- Library for Decoding Parameters ---
library ParamsDecoder {
    struct AerodromeParams { uint amountOutMin; }
    struct V3Params { bytes path; uint amountOutMinimum; }

    function decodeAerodromeParams(bytes memory encodedParams) internal pure returns (AerodromeParams memory) {
        return abi.decode(encodedParams, (AerodromeParams));
    }

    function decodeV3Params(bytes memory encodedParams) internal pure returns (V3Params memory) {
        return abi.decode(encodedParams, (V3Params));
    }
}

// --- Main Contract ---
contract AaveArbitrageV3 {
    using SafeERC20 for IERC20;
    using ParamsDecoder for bytes;

    enum DexType { Aerodrome, PancakeV3 }

    struct Swap {
        address router;
        address from;
        address to;
        DexType dex;
        bytes dexParams;
    }

    // --- Events for Diagnostics ---
    event PreSwap(address indexed router, address indexed tokenIn, uint256 amountIn, uint256 balance, uint256 allowance);
    event PostSwap(address indexed router, address indexed tokenOut, uint256 amountOut, uint256 balance);
    event RepaymentCheck(address indexed loanToken, uint256 balance, uint256 totalDebt);

    IPool public constant POOL = IPool(0x4891269533a231F3385542718820465551949A47);
    address public immutable multiSig;
    address public immutable owner;

    error ArbitrageFailed(string reason);

    constructor(address _multiSig) {
        owner = msg.sender;
        multiSig = _multiSig;
    }

    function executeArbitrage(address _flashLoanToken, uint256 _flashLoanAmount, Swap[] calldata _swaps) external onlyOwner {
        address[] memory assets = new address[](1); assets[0] = _flashLoanToken;
        uint256[] memory amounts = new uint256[](1); amounts[0] = _flashLoanAmount;
        uint256[] memory modes = new uint256[](1); modes[0] = 0; // No interest
        bytes memory params = abi.encode(_swaps);
        POOL.flashLoan(address(this), assets, amounts, modes, address(this), params, 0);
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address, // initiator
        bytes calldata params
    ) external returns (bool) {
        require(msg.sender == address(POOL), "Not from Aave Pool");

        Swap[] memory swaps = abi.decode(params, (Swap[]));
        address lastToken = address(0);
        
        for (uint i = 0; i < swaps.length; i++) {
            _executeSwap(swaps[i]);
            lastToken = swaps[i].to;
        }

        address loanToken = assets[0];
        
        // --- Diagnostic Check: Final token vs Loan token ---
        require(lastToken == loanToken, "Final token is not the loan token");

        uint256 finalBalance = IERC20(loanToken).balanceOf(address(this));
        uint256 totalDebt = amounts[0] + premiums[0];

        // --- Diagnostic Event ---
        emit RepaymentCheck(loanToken, finalBalance, totalDebt);

        require(finalBalance >= totalDebt, "Arbitrage failed: not enough funds to repay the loan");

        IERC20(loanToken).approve(address(POOL), totalDebt);

        uint256 profit = finalBalance - totalDebt;
        if (profit > 0) {
            IERC20(loanToken).safeTransfer(multiSig, profit);
        }

        return true;
    }

    function _executeSwap(Swap memory _swap) internal {
        uint256 amountIn = IERC20(_swap.from).balanceOf(address(this));
        
        // --- Diagnostic Event ---
        emit PreSwap(_swap.router, _swap.from, amountIn, IERC20(_swap.from).balanceOf(address(this)), IERC20(_swap.from).allowance(address(this), _swap.router));

        IERC20(_swap.from).approve(_swap.router, amountIn);

        if (_swap.dex == DexType.Aerodrome) {
            ParamsDecoder.AerodromeParams memory params = _swap.dexParams.decodeAerodromeParams();
            address[] memory path = new address[](2); path[0] = _swap.from; path[1] = _swap.to;
            IUniswapV2Router(_swap.router).swapExactTokensForTokens(amountIn, params.amountOutMin, path, address(this), block.timestamp);

        } else if (_swap.dex == DexType.PancakeV3) {
            ParamsDecoder.V3Params memory params = _swap.dexParams.decodeV3Params();
            IUniswapV3Router.ExactInputParams memory routerParams = IUniswapV3Router.ExactInputParams({ path: params.path, recipient: address(this), deadline: block.timestamp, amountIn: amountIn, amountOutMinimum: params.amountOutMinimum });
            IUniswapV3Router(_swap.router).exactInput(routerParams);
        }
        
        // --- Diagnostic Event ---
        uint256 amountOut = IERC20(_swap.to).balanceOf(address(this));
        emit PostSwap(_swap.router, _swap.to, amountOut, amountOut);
    }

    function withdraw(address _token) external onlyOwner {
        IERC20(_token).safeTransfer(owner, IERC20(_token).balanceOf(address(this)));
    }

    receive() external payable {}
}
