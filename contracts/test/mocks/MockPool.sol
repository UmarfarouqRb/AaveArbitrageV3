// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IFlashLoanSimpleReceiver} from "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockPool is IPool {
    address public immutable UNDERLYING_ASSET_ADDRESS;

    constructor(address _asset) {
        UNDERLYING_ASSET_ADDRESS = _asset;
    }

    function flashLoanSimple(
        address receiver,
        address asset,
        uint256 amount,
        bytes calldata params,
        uint16 // referralCode
    ) external override {
        require(asset == UNDERLYING_ASSET_ADDRESS, "Unsupported asset");
        uint256 balanceBefore = IERC20(asset).balanceOf(address(this));
        require(balanceBefore >= amount, "Not enough liquidity");

        IERC20(asset).transfer(receiver, amount);

        bool success = IFlashLoanSimpleReceiver(receiver).executeOperation(
            asset,
            amount,
            0, // premium
            msg.sender,
            params
        );
        require(success, "Flashloan execution failed");

        // Repay loan
        IERC20(asset).transferFrom(receiver, address(this), amount);

        uint256 balanceAfter = IERC20(asset).balanceOf(address(this));
        require(balanceAfter >= balanceBefore, "Loan not repaid");
    }
    
    function deposit(address, uint256, address, uint16) external pure override {}

    // Dummy implementations for the rest of the IPool interface
    function borrow(address, uint256, uint256, uint16, address) external pure override {}
    function supply(address, uint256, address, uint16) external pure override {}
    function withdraw(address, uint256, address) external pure override returns (uint256) { return 0; }
    function repay(address, uint256, uint256, address) external pure override returns (uint256) { return 0; }
    function swapBorrowRateMode(address, uint256) external pure override {}
    function rebalanceStableBorrowRate(address, address) external pure override {}
    function setUserUseReserveAsCollateral(address, bool) external pure override {}
    function liquidationCall(address, address, address, uint256, bool) external pure override {}
    function supplyWithPermit(address, uint256, address, uint16, uint256, uint8, bytes32, bytes32) external pure override {}
    function repayWithPermit(address, uint256, uint256, address, uint256, uint8, bytes32, bytes32) external pure override returns (uint256) { return 0; }
    function repayWithATokens(address, uint256, uint256) external pure override returns (uint256) { return 0; }
    function flashLoan(address, address[] calldata, uint256[] calldata, uint256[] calldata, address, bytes calldata, uint16) external pure override {}
    function getReserveData(address) external pure override returns (DataTypes.ReserveData memory) { 
        return DataTypes.ReserveData(
            DataTypes.ReserveConfigurationMap(0),
            0, // liquidityIndex
            0, // currentLiquidityRate
            0, // variableBorrowIndex
            0, // currentVariableBorrowRate
            0, // currentStableBorrowRate
            0, // lastUpdateTimestamp
            0, // id
            address(0), // aTokenAddress
            address(0), // stableDebtTokenAddress
            address(0), // variableDebtTokenAddress
            address(0), // interestRateStrategyAddress
            0, // accruedToTreasury
            0, // unbacked
            0 // isolationModeTotalDebt
        );
    }
    function getConfiguration(address) external pure override returns (DataTypes.ReserveConfigurationMap memory) { return DataTypes.ReserveConfigurationMap(0); }
    function getUserConfiguration(address) external pure override returns (DataTypes.UserConfigurationMap memory) { return DataTypes.UserConfigurationMap(0); }
    function getReserveNormalizedIncome(address) external pure override returns (uint256) { return 0; }
    function getReserveNormalizedVariableDebt(address) external pure override returns (uint256) { return 0; }
    function getUserAccountData(address) external pure override returns (uint256, uint256, uint256, uint256, uint256, uint256) { return (0,0,0,0,0,0); }
    function setReserveInterestRateStrategyAddress(address, address) external pure override {}
    function getEModeCategoryData(uint8) external pure override returns (DataTypes.EModeCategory memory) { return DataTypes.EModeCategory(0,0,0,address(0),""); }
    function configureEModeCategory(uint8, DataTypes.EModeCategory calldata) external pure override {}
    function backUnbacked(address, uint256, uint256) external pure override returns (uint256) { return 0; }
    function mintToTreasury(address[] calldata) external pure override {}
    function rescueTokens(address, address, uint256) external pure override {}
    function ADDRESSES_PROVIDER() external pure override returns (IPoolAddressesProvider) { return IPoolAddressesProvider(address(0)); }
    function BRIDGE_PROTOCOL_FEE() external pure override returns (uint256) { return 0; }
    function FLASHLOAN_PREMIUM_TOTAL() external pure override returns (uint128) { return 0; }
    function FLASHLOAN_PREMIUM_TO_PROTOCOL() external pure override returns (uint128) { return 0; }
    function MAX_NUMBER_RESERVES() external pure override returns (uint16) { return 0; }
    function MAX_STABLE_RATE_BORROW_SIZE_PERCENT() external pure override returns (uint256) { return 0; }
    function dropReserve(address) external pure override {}
    function finalizeTransfer(address, address, address, uint256, uint256, uint256) external pure override {}
    function getReserveAddressById(uint16) external pure override returns (address) { return address(0); }
    function getReservesList() external pure override returns (address[] memory) {
      address[] memory a = new address[](1);
      a[0] = address(0);
      return a;
    }
    function getUserEMode(address) external pure override returns (uint256) { return 0; }
    function initReserve(address, address, address, address, address) external pure override {}
    function mintUnbacked(address, uint256, address, uint16) external pure override {}
    function resetIsolationModeTotalDebt(address) external pure override {}
    function setConfiguration(address, DataTypes.ReserveConfigurationMap calldata) external pure override {}
    function setUserEMode(uint8) external pure override {}
    function updateBridgeProtocolFee(uint256) external pure override {}
    function updateFlashloanPremiums(uint128, uint128) external pure override {}
}