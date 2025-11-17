// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPancakeV3Router} from "./interfaces/IPancakeV3.sol";
import {IAerodromeRouter} from "./interfaces/IAerodrome.sol";
import {console} from "forge-std/console.sol";

interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract AaveArbitrageV3 is IFlashLoanReceiver {
    using SafeERC20 for IERC20;

    enum DexType { Aerodrome, PancakeV3 }

    struct Swap {
        address router;
        address from;
        address to;
        DexType dex;
        bytes dexParams;
    }

    struct AerodromeParams {
        bool stable;
        address factory;
        uint256 amountOutMin;
    }

    struct V3Params {
        bytes path;
        uint256 amountOutMinimum;
    }

    IPool public immutable POOL = IPool(0xA238Dd80C259a72e81d7e4664a9801593F98d1c5);
    address public multiSig;
    bool public paused;

    mapping(address => bool) public whitelistedRouters;

    event SwapFailed(address router, DexType dex, address tokenIn, address tokenOut, string reason);

    modifier onlyMultiSig() {
        _onlyMultiSig();
        _;
    }

    modifier whenNotPaused() {
        _whenNotPaused();
        _;
    }

    constructor(address _multiSig) {
        multiSig = _multiSig;
        whitelistedRouters[0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43] = true; // Aerodrome V3
        whitelistedRouters[0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86] = true; // PancakeSwap V3
    }

    function executeArbitrage(address _flashLoanToken, uint256 _flashLoanAmount, Swap[] calldata _swaps) external whenNotPaused {
        address receiver = address(this);
        address[] memory assets = new address[](1);
        assets[0] = _flashLoanToken;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _flashLoanAmount;
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;
        address onBehalfOf = address(this);
        bytes memory params = abi.encode(_swaps);
        uint16 referralCode = 0;

        POOL.flashLoan(receiver, assets, amounts, modes, onBehalfOf, params, referralCode);
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address /*initiator*/,
        bytes calldata params
    ) external override returns (bool) {
        console.log("Executing operation...");
        require(msg.sender == address(POOL), "Only the Aave pool can call this function");
        require(!paused, "Contract is paused");

        Swap[] memory swaps = abi.decode(params, (Swap[]));

        uint256 currentBalance = amounts[0];
        address currentToken = assets[0];
        console.log("Initial balance: %d %s", currentBalance, currentToken);

        for (uint i = 0; i < swaps.length; i++) {
            Swap memory currentSwap = swaps[i];
            console.log("Executing swap %d", i);
            require(whitelistedRouters[currentSwap.router], "Router not whitelisted");

            if (currentSwap.dex == DexType.Aerodrome) {
                console.log("Swap is on Aerodrome");
                AerodromeParams memory aeroParams = abi.decode(currentSwap.dexParams, (AerodromeParams));

                IERC20(currentToken).approve(currentSwap.router, 0);
                IERC20(currentToken).approve(currentSwap.router, currentBalance);

                IAerodromeRouter.Route[] memory routes = new IAerodromeRouter.Route[](1);
                routes[0] = IAerodromeRouter.Route({
                    from: currentToken,
                    to: currentSwap.to,
                    stable: aeroParams.stable,
                    factory: aeroParams.factory
                });

                uint256[] memory expectedAmounts;

                try IAerodromeRouter(currentSwap.router).swapExactTokensForTokens(currentBalance, aeroParams.amountOutMin, routes, address(this), block.timestamp + 60) returns (uint[] memory receivedAmounts) {
                    expectedAmounts = receivedAmounts;
                } catch (bytes memory reason) {
                    string memory revertMessage = _getRevertMessage(reason);
                    console.log("Aerodrome swap failed: %s", revertMessage);
                    emit SwapFailed(currentSwap.router, DexType.Aerodrome, currentToken, currentSwap.to, revertMessage);
                    revert(string(abi.encodePacked("Aerodrome swap failed: ", revertMessage)));
                }

                currentBalance = expectedAmounts[expectedAmounts.length - 1];

            } else if (currentSwap.dex == DexType.PancakeV3) {
                console.log("Swap is on PancakeV3");
                V3Params memory v3Params = abi.decode(currentSwap.dexParams, (V3Params));

                IERC20(currentToken).approve(currentSwap.router, 0);
                IERC20(currentToken).approve(currentSwap.router, currentBalance);

                IPancakeV3Router.ExactInputParams memory exactInputParams = IPancakeV3Router.ExactInputParams({
                    path: v3Params.path,
                    recipient: address(this),
                    amountIn: currentBalance,
                    amountOutMinimum: v3Params.amountOutMinimum
                });

                uint256 amountOut;

                try IPancakeV3Router(currentSwap.router).exactInput(exactInputParams) returns (uint256 _amountOut) {
                    amountOut = _amountOut;
                } catch (bytes memory reason) {
                    string memory revertMessage = _getRevertMessage(reason);
                    console.log("PancakeSwap V3 swap failed: %s", revertMessage);
                    emit SwapFailed(currentSwap.router, DexType.PancakeV3, currentToken, currentSwap.to, revertMessage);
                    revert(string(abi.encodePacked("PancakeSwap V3 swap failed: ", revertMessage)));
                }

                IERC20(currentToken).approve(currentSwap.router, 0);

                currentBalance = amountOut;
            }
            currentToken = currentSwap.to;
            console.log("Balance after swap %d: %d %s", i, currentBalance, currentToken);
        }

        console.log("All swaps completed");
        uint256 totalDebt = amounts[0] + premiums[0];
        console.log("Total debt: %d", totalDebt);
        require(IERC20(assets[0]).balanceOf(address(this)) >= totalDebt, "Arbitrage failed: not enough funds to repay the loan");
        
        console.log("Repaying loan...");
        IERC20(assets[0]).safeTransfer(address(POOL), totalDebt);

        uint256 profit = IERC20(assets[0]).balanceOf(address(this));
        console.log("Profit: %d", profit);
        if (profit > 0) {
            IERC20(assets[0]).safeTransfer(multiSig, profit);
        }

        return true;
    }
    
    function _getRevertMessage(bytes memory returnData) internal pure returns (string memory) {
        if (returnData.length < 68) return "No revert reason";
        assembly {
            returnData := add(returnData, 0x04)
        }
        return abi.decode(returnData, (string));
    }

    function _onlyMultiSig() internal view {
        require(msg.sender == multiSig, "Not the multisig");
    }

    function _whenNotPaused() internal view {
        require(!paused, "Contract is paused");
    }

    // --- ADMIN FUNCTIONS ---
    function setRouter(address _router, bool _isWhitelisted) external onlyMultiSig {
        whitelistedRouters[_router] = _isWhitelisted;
    }

    function pause() external onlyMultiSig {
        paused = true;
    }

    function unpause() external onlyMultiSig {
        paused = false;
    }

    function withdraw(address _tokenAddress) external onlyMultiSig {
        IERC20 token = IERC20(_tokenAddress);
        token.safeTransfer(multiSig, token.balanceOf(address(this)));
    }

    function withdrawEth() external onlyMultiSig {
        payable(multiSig).transfer(address(this).balance);
    }

    function changeMultiSig(address _newMultiSig) external onlyMultiSig {
        multiSig = _newMultiSig;
    }

    receive() external payable {}
}