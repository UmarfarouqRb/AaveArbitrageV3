solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

enum DEX {
    AerodromeV3,
    BalancerV3,
    Curve,
    UniswapV3
}

struct SwapData {
    DEX dex;
    address tokenIn;
    address tokenOut;
    uint24 fee; // Uniswap V3, Aerodrome (if applicable) fee
    bytes32 poolId; // Balancer V3 pool ID
    address[] path; // Aerodrome path, can be single token or multi-hop
    int128 curve_i; // Curve in token index
    int128 curve_j; // Curve out token index
    address curvePoolAddress; // Specific Curve pool address if not using a router
    uint256 amountOutMinimum; // Minimum output amount for slippage control
}

interface IFlashLoanSimpleReceiver {
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

interface IPool {
    function flashLoanSimple(
        address receiverAddress,
        address asset,
        uint256 amount,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

interface IAerodromeRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

interface IBalancerVault {
    enum SwapKind { GIVEN_IN, GIVEN_OUT }
    struct BatchSwapStep {
        bytes32 poolId;
        uint256 assetInIndex;
        uint256 assetOutIndex;
        uint256 amount;
        bytes userData;
    }
    struct FundManagement {
        address sender;
        bool fromInternalBalance;
        address recipient;
        bool toInternalBalance;
    }
    function batchSwap(
        SwapKind kind,
        BatchSwapStep[] calldata swaps,
        address[] calldata assets,
        FundManagement calldata funds,
        int256[] calldata limits,
        uint256 deadline
    ) external returns (int256[] memory);
}

interface ICurvePool {
    function exchange(int128 i, int128 j, uint256 dx, uint256 minDy) external;
}

contract AaveArbitrageV3 is Ownable, ReentrancyGuard, IFlashLoanSimpleReceiver {
    using SafeERC20 for IERC20;

    // --- State Variables ---
    IPool public immutable AAVE_POOL;
    mapping(DEX => address) public dexRouters;

    // multisig that receives profits & can withdraw
    address payable public multiSig;

    // --- Events ---
    event ArbitrageAttempt(address indexed asset, uint256 loanAmount);
    event FlashLoanExecuted(address indexed token, uint256 loanAmount, uint256 profit);
    event SwapExecuted(DEX indexed dex, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event SwapFailed(DEX indexed dex, address indexed tokenIn, address indexed tokenOut, bytes reason);
    event RouterUpdated(DEX indexed dex, address indexed router);
    event ProfitWithdrawn(address indexed to, uint256 amount);

    // --- Modifiers ---
    // only the multisig can withdraw or update multisig-sensitive settings
    modifier onlyMultiSig() {
        require(msg.sender == multiSig, "Only multisig");
        _;
    }

    // --- Constructor ---
    constructor(address _pool, address _owner, address payable _multiSig) Ownable(_owner) {
        require(_pool != address(0), "Zero pool");
        AAVE_POOL = IPool(_pool);
        if (_multiSig != address(0)) {
            require(_multiSig.code.length > 0, "must be contract multisig");
            multiSig = _multiSig;
        }
    }

    // --- External Functions ---

    // Anyone can call; tx must succeed atomically
    function startArbitrage(address _asset, uint256 _amount, bytes calldata _userData) external nonReentrant {
        require(_asset != address(0), "zero asset");
        require(_amount > 0, "zero amount");
        emit ArbitrageAttempt(_asset, _amount);
        AAVE_POOL.flashLoanSimple(address(this), _asset, _amount, _userData, 0);
    }

    function executeOperation(
        address _asset,
        uint256 _amount,
        uint256 _premium,
        address _initiator,
        bytes calldata _params
    ) external returns (bool) {
        // 1. Aave Security Checks
        require(msg.sender == address(AAVE_POOL), "Not Aave Pool");
        require(_initiator == tx.origin || _initiator == msg.sender, "Invalid initiator");

        (SwapData[] memory swaps, uint256 minProfit) = abi.decode(_params, (SwapData[], uint256));
        
        uint256 currentAmount = _amount;

        for (uint i = 0; i < swaps.length; i++) {
            _approveTokenIfNeeded(IERC20(swaps[i].tokenIn), dexRouters[swaps[i].dex], currentAmount);
            currentAmount = _swap(swaps[i], currentAmount);
        }
        
        uint256 loanToRepay = _amount + _premium;

        require(currentAmount >= loanToRepay, "Insufficient funds to repay");
        
        uint256 profit = currentAmount - loanToRepay;
        require(profit >= minProfit, "Profit below minimum");

        // Repay the loan + premium
        _approveTokenIfNeeded(IERC20(_asset), address(AAVE_POOL), loanToRepay);

        emit FlashLoanExecuted(_asset, _amount, profit);
        if (profit > 0) {
            // send profit to multisig (not owner)
            require(multiSig != address(0), "multisig not set");
            IERC20(_asset).safeTransfer(multiSig, profit);
        }

        return true;
    }

    /// @notice Owner can set multisig (do this after deploy)
    function setMultiSig(address payable _multiSig) external onlyOwner {
        require(_multiSig != address(0), "zero multisig");
        require(_multiSig.code.length > 0, "must be contract multisig");
        multiSig = _multiSig;
    }

    function setRouter(DEX _dex, address _router) external onlyOwner {
        require(_router.code.length > 0, "Router not a contract");
        dexRouters[_dex] = _router;
        emit RouterUpdated(_dex, _router);
    }

    /// @notice multisig only withdrawal
    function withdraw(address _token, address _to, uint256 _amount) external onlyMultiSig {
        require(_to != address(0), "zero recipient");
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(_amount <= balance, "Insufficient balance");
        IERC20(_token).safeTransfer(_to, _amount);
        emit ProfitWithdrawn(_to, _amount);
    }

    // --- Internal Functions ---

    function _swap(SwapData memory _swapData, uint256 _amountIn) internal returns (uint256) {
        address routerOrPool = dexRouters[_swapData.dex]; // Use dexRouters for router addresses
        if (_swapData.dex == DEX.Curve && _swapData.curvePoolAddress != address(0)) {
            routerOrPool = _swapData.curvePoolAddress; // For Curve, use specific pool address if provided
        }
        require(routerOrPool != address(0), "Invalid router/pool address for DEX");
        require(routerOrPool.code.length > 0, "Router/Pool is not a contract");

        uint256 amountOut;
        if (_swapData.dex == DEX.UniswapV3) {
            amountOut = _uniswapV3Swap(
                routerOrPool,
                _swapData.tokenIn,
                _swapData.tokenOut,
                _swapData.fee,
                _amountIn,
                _swapData.amountOutMinimum
            );
        } else if (_swapData.dex == DEX.AerodromeV3) {
            amountOut = _aerodromeSwap(
                routerOrPool,
                _swapData.tokenIn,
                _swapData.tokenOut,
                _swapData.path, // Assuming path is suitable for Aerodrome
                _amountIn,
                _swapData.amountOutMinimum
            );
        } else if (_swapData.dex == DEX.BalancerV3) {
            amountOut = _balancerV3Swap(
                routerOrPool, // This will be the Balancer Vault address
                _swapData.poolId,
                _swapData.tokenIn,
                _swapData.tokenOut,
                _amountIn,
                _swapData.amountOutMinimum
            );
        } else if (_swapData.dex == DEX.Curve) {
            amountOut = _curvePoolSwap(
                routerOrPool, // This will be the Curve pool address
                _swapData.curve_i,
                _swapData.curve_j,
                _swapData.tokenIn,
                _swapData.tokenOut,
                _amountIn,
                _swapData.amountOutMinimum
            );
        } else {
            revert("Unsupported DEX");
        }
        
        require(amountOut >= _swapData.amountOutMinimum, "Slippage exceeded");
        emit SwapExecuted(_swapData.dex, _swapData.tokenIn, _swapData.tokenOut, _amountIn, amountOut);
        return amountOut;
    }

    function _uniswapV3Swap(
        address routerAddr,
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) internal returns (uint256 amountOut) {
        IUniswapV3Router router = IUniswapV3Router(routerAddr);
        IERC20(tokenIn).safeApprove(routerAddr, type(uint256).max); // Using max allowance for efficiency and common pattern

        try router.exactInputSingle(
            IUniswapV3Router.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp + 300, // Updated deadline
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            })
        ) returns (uint256 out) {
            return out;
        } catch (bytes memory reason) {
            emit SwapFailed(DEX.UniswapV3, tokenIn, tokenOut, reason);
            revert("UniswapV3 swap failed");
        }
    }

    function _aerodromeSwap(
        address routerAddr,
        address tokenIn,
        address tokenOut,
        address[] memory path,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) internal returns (uint256 amountOut) {
        IAerodromeRouter router = IAerodromeRouter(routerAddr);
        IERC20(tokenIn).safeApprove(routerAddr, type(uint256).max); // Using max allowance for efficiency and common pattern

        try router.swapExactTokensForTokens(
            amountIn,
            amountOutMinimum,
            path,
            address(this),
            block.timestamp + 300
        ) returns (uint256[] memory amounts) {
            return amounts[amounts.length - 1];
        } catch (bytes memory reason) {
            emit SwapFailed(DEX.AerodromeV3, tokenIn, tokenOut, reason); // Log as AerodromeV3
            revert(string(reason));
        }
    }

    function _balancerV3Swap(
        address vaultAddr,
        bytes32 poolId,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) internal returns (uint256 amountOut) {
        IBalancerVault vault = IBalancerVault(vaultAddr);
        IERC20(tokenIn).safeApprove(vaultAddr, type(uint256).max); // Balancer Vault needs approval

        IBalancerVault.BatchSwapStep[] memory swaps = new IBalancerVault.BatchSwapStep[](1);
        address[] memory assets = new address[](2);
        int256[] memory limits = new int256[](2);

        assets[0] = tokenIn;
        assets[1] = tokenOut;

        swaps[0] = IBalancerVault.BatchSwapStep({
            poolId: poolId,
            assetInIndex: 0,
            assetOutIndex: 1,
            amount: amountIn,
            userData: ""
        });

        IBalancerVault.FundManagement memory funds = IBalancerVault.FundManagement({
            sender: address(this),
            fromInternalBalance: false,
            recipient: address(this),
            toInternalBalance: false
        });

        limits[0] = int256(amountIn);
        limits[1] = -int256(amountOutMinimum); // Ensure at least amountOutMinimum is received

        try vault.batchSwap(
            IBalancerVault.SwapKind.GIVEN_IN,
            swaps,
            assets,
            funds,
            limits,
            block.timestamp + 300
        ) returns (int256[] memory deltas) {
            // deltas: net asset deltas (positive => token was sent to Vault; negative => token was received)
            // tokenOut delta will be negative (received). Convert to uint256:
            uint256 received = uint256(-deltas[1]);
            require(received >= amountOutMinimum, "BalancerV3: slippage");
            return received;
        } catch (bytes memory reason) {
            emit SwapFailed(DEX.BalancerV3, tokenIn, tokenOut, reason);
            revert(string(reason));
        }
    }

    function _curvePoolSwap(
        address poolAddr,
        int128 i,
        int128 j,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) internal returns (uint256 amountOut) {
        ICurvePool pool = ICurvePool(poolAddr);
        IERC20(tokenIn).safeApprove(poolAddr, type(uint256).max); // Curve pool needs approval

        uint256 balanceBefore = IERC20(tokenOut).balanceOf(address(this));

        try pool.exchange(i, j, amountIn, amountOutMinimum) {
            uint256 balanceAfter = IERC20(tokenOut).balanceOf(address(this));
            uint256 received = balanceAfter - balanceBefore; // Compute delta
            require(received >= amountOutMinimum, "Curve: slippage");
            return received;
        } catch (bytes memory reason) {
            emit SwapFailed(DEX.Curve, tokenIn, tokenOut, reason);
            revert(string(reason));
        }
    }

    function _approveTokenIfNeeded(IERC20 _token, address _spender, uint256 _amount) internal {
        // No need to zero out first, safeApprove handles it.
        // We approve max to reduce gas costs for subsequent approvals in a single flashloan tx.
        _token.safeApprove(_spender, type(uint256).max);
    }

    // --- Fallback ---
    receive() external payable {}