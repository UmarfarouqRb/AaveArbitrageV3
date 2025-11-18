// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPancakeV3Router} from "./interfaces/IPancakeV3.sol";
import {IAerodromeRouter} from "./interfaces/IAerodrome.sol";
import {console} from "forge-std/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// --- Publicly Accessible Structs & Enums ---
enum DexType { Aerodrome, PancakeV3, UniswapV3 }

struct Swap {
    address router;
    address from;
    address to;
    DexType dex;
    bytes dexParams;
}

interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract AaveArbitrageV3 is IFlashLoanReceiver, Ownable {
    using SafeERC20 for IERC20;

    // --- Structs for DEX parameters ---
    struct AerodromeParams {
        bool stable;
        address factory;
        uint256 amountOutMin;
    }

    struct V3Params {
        bytes path;
        uint256 amountOutMinimum;
    }

    // --- State Variables ---
    IPool public immutable POOL = IPool(0xA238Dd80C259a72e81d7e4664a9801593F98d1c5);
    bool public paused;
    mapping(address => bool) public whitelistedRouters;
    uint256 public keeperFee; // Percentage of profit to pay to the keeper

    // --- Events ---
    event SwapFailed(address router, DexType dex, address tokenIn, address tokenOut, string reason);
    event ProfitTransfer(address token, uint256 amount);
    event KeeperFeePaid(address keeper, address token, uint256 amount);
    event LoanRepaid(address token, uint256 amount);

    // --- Modifiers ---
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // --- Constructor ---
    constructor(address initialOwner) Ownable(initialOwner) {
        keeperFee = 50; // 50% keeper fee
        whitelistedRouters[0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43] = true; // Aerodrome Router
        whitelistedRouters[0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86] = true; // PancakeSwap V3 Router
    }

    // --- External Functions ---
    function executeArbitrage(address _flashLoanToken, uint256 _flashLoanAmount, Swap[] calldata _swaps) external whenNotPaused {
        address receiver = address(this);
        address[] memory assets = new address[](1);
        assets[0] = _flashLoanToken;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _flashLoanAmount;
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0; // No debt
        
        // Pass the swaps and the keeper (msg.sender) to the callback
        bytes memory params = abi.encode(_swaps, msg.sender);
        uint16 referralCode = 0;

        POOL.flashLoan(receiver, assets, amounts, modes, address(this), params, referralCode);
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address /*initiator*/,
        bytes calldata params
    ) external override returns (bool) {
        console.log("Executing flash loan operation...");
        require(msg.sender == address(POOL), "Only Aave V3 Pool can call this");
        
        (Swap[] memory swaps, address keeper) = abi.decode(params, (Swap[], address));
        address currentToken = assets[0];
        uint256 currentBalance = amounts[0];

        console.log("Initial balance: %d %s", currentBalance, currentToken);

        for (uint i = 0; i < swaps.length; i++) {
            Swap memory s = swaps[i];
            console.log("Executing swap %d from %s to %s", i, s.from, s.to);
            require(whitelistedRouters[s.router], "Router not whitelisted");

            if (s.dex == DexType.Aerodrome) {
                currentBalance = _executeAerodromeSwap(s, currentBalance);
            } else if (s.dex == DexType.PancakeV3) {
                currentBalance = _executePancakeV3Swap(s, currentBalance);
            } else if (s.dex == DexType.UniswapV3) {
                revert("UniswapV3 not implemented");
            }
            currentToken = s.to;
            console.log("Balance after swap %d: %d %s", i, currentBalance, currentToken);
        }

        uint256 totalDebt = amounts[0] + premiums[0];
        uint256 finalBalance = IERC20(assets[0]).balanceOf(address(this));
        
        console.log("Total debt: %d", totalDebt);
        console.log("Final balance: %d", finalBalance);

        require(finalBalance >= totalDebt, "Arbitrage failed: Not enough funds to repay loan");

        console.log("Repaying loan...");
        IERC20(assets[0]).approve(address(POOL), totalDebt);
        emit LoanRepaid(assets[0], totalDebt);

        uint256 profit = finalBalance - totalDebt;
        if (profit > 0) {
            console.log("Profit found: %d", profit);
            
            uint256 keeperReward = (profit * keeperFee) / 100;
            if (keeperReward > 0) {
                IERC20(assets[0]).safeTransfer(keeper, keeperReward);
                emit KeeperFeePaid(keeper, assets[0], keeperReward);
            }
            
            uint256 ownerProfit = profit - keeperReward;
            IERC20(assets[0]).safeTransfer(owner(), ownerProfit);
            emit ProfitTransfer(assets[0], ownerProfit);
        }

        return true;
    }

    // --- Internal Swap Execution ---
    function _executeAerodromeSwap(Swap memory _swap, uint256 _amountIn) internal returns (uint256) {
        AerodromeParams memory aeroParams = abi.decode(_swap.dexParams, (AerodromeParams));

        IERC20(_swap.from).approve(_swap.router, _amountIn);
        
        IAerodromeRouter.Route[] memory routes = new IAerodromeRouter.Route[](1);
        routes[0] = IAerodromeRouter.Route({
            from: _swap.from,
            to: _swap.to,
            stable: aeroParams.stable,
            factory: aeroParams.factory
        });
        
        uint256[] memory receivedAmounts;
        try IAerodromeRouter(_swap.router).swapExactTokensForTokens(_amountIn, aeroParams.amountOutMin, routes, address(this), block.timestamp) returns (uint[] memory _receivedAmounts) {
            receivedAmounts = _receivedAmounts;
        } catch (bytes memory reason) {
            string memory revertMsg = _getRevertMessage(reason);
            emit SwapFailed(_swap.router, DexType.Aerodrome, _swap.from, _swap.to, revertMsg);
            revert(string(abi.encodePacked("Aerodrome Call Failed: ", revertMsg)));
        }
        
        return receivedAmounts[receivedAmounts.length - 1];
    }

    function _executePancakeV3Swap(Swap memory _swap, uint256 _amountIn) internal returns (uint256) {
        V3Params memory v3Params = abi.decode(_swap.dexParams, (V3Params));

        IERC20(_swap.from).approve(_swap.router, _amountIn);
        
        IPancakeV3Router.ExactInputParams memory params = IPancakeV3Router.ExactInputParams({
            path: v3Params.path,
            recipient: address(this),
            amountIn: _amountIn,
            amountOutMinimum: v3Params.amountOutMinimum
        });

        uint256 amountOut;
        try IPancakeV3Router(_swap.router).exactInput(params) returns (uint256 _amountOut) {
            amountOut = _amountOut;
        } catch (bytes memory reason) {
            string memory revertMsg = _getRevertMessage(reason);
            emit SwapFailed(_swap.router, DexType.PancakeV3, _swap.from, _swap.to, revertMsg);
            revert(string(abi.encodePacked("PancakeV3 Call Failed: ", revertMsg)));
        }
        
        return amountOut;
    }
    
    // --- Helper Functions ---
    function _getRevertMessage(bytes memory _returnData) internal pure returns (string memory) {
        if (_returnData.length < 68) return "No revert reason";
        assembly { _returnData := add(_returnData, 0x04) }
        return abi.decode(_returnData, (string));
    }

    // --- Admin Functions ---
    function setKeeperFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 50, "Fee cannot exceed 50%"); // Safety check
        keeperFee = _newFee;
    }
    
    function setRouter(address _router, bool _isWhitelisted) external onlyOwner {
        whitelistedRouters[_router] = _isWhitelisted;
    }

    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20(_tokenAddress).safeTransfer(owner(), IERC20(_tokenAddress).balanceOf(address(this)));
    }

    receive() external payable {}
}
