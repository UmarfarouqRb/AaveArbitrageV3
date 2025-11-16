// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract MockPoolAddressesProvider is IPoolAddressesProvider {
    address public pool;

    constructor(address _pool) {
        pool = _pool;
    }

    function getPool() external view override returns (address) {
        return pool;
    }

    function setPool(address _pool) external {
        pool = _pool;
    }

    function getMarketId() external pure override returns (string memory) {
        return "mock-market";
    }

    function setMarketId(string calldata) external pure override {}

    function getAddress(bytes32 id) external view override returns (address) {
        if (id == keccak256("POOL")) {
            return pool;
        }
        return address(0);
    }

    function getACLManager() external pure override returns (address) {
        return address(0);
    }

    function setACLManager(address) external pure override {}

    function getPriceOracle() external pure override returns (address) {
        return address(0);
    }

    function setPriceOracle(address) external pure override {}

    function getPriceOracleSentinel() external pure override returns (address) {
        return address(0);
    }

    function setPriceOracleSentinel(address) external pure override {}
    
    function getACLAdmin() external pure override returns (address) {
        return address(0);
    }

    function getPoolConfigurator() external pure override returns (address) {
        return address(0);
    }

    function getPoolDataProvider() external pure override returns (address) {
        return address(0);
    }

    function setACLAdmin(address) external pure override {}

    function setAddress(bytes32, address) external pure override {}

    function setAddressAsProxy(bytes32, address) external pure override {}

    function setPoolConfiguratorImpl(address) external pure override {}

    function setPoolDataProvider(address) external pure override {}

    function setPoolImpl(address) external pure override {}
}
