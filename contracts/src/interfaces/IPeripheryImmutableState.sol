// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;

/// @title Periphery Immutable State
/// @notice Functions that return immutable state of the router
interface IPeripheryImmutableState {
    /// @notice The address of the factory of the V3 pools
    /// @return The factory address
    function factory() external view returns (address);

    /// @notice The address of WETH9
    /// @return The WETH9 address
    function WETH9() external view returns (address);
}
