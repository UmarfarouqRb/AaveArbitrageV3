// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;
pragma abicoder v2;

import { IV3SwapRouter } from './IV3SwapRouter.sol';
import { IPeripheryPayments } from './IPeripheryPayments.sol';
import { IPeripheryImmutableState } from './IPeripheryImmutableState.sol';

/// @title Universal Router
/// @notice The universal router supporting swaps and NFT trades across Uniswap V2, V3 and NFTX.
interface IUniversalRouter is IV3SwapRouter, IPeripheryPayments, IPeripheryImmutableState {
    /// @notice The identifying URI for this router.
    /// @return The URI of the router
    function ROUTER_URI() external view returns (string memory);

    /// @notice The identifying name for this router
    /// @return The name of the router
    function ROUTER_NAME() external view returns (string memory);

    /// @notice Executes a series of commands.
    /// @param commands A set of commands to execute in order.
    /// @param inputs The inputs for each command that requires one.
    /// @param deadline The time at which the transaction must be executed, otherwise it will revert.
    function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable;

    /// @notice Executes a series of commands.
    /// @param commands A set of commands to execute in order.
    /// @param inputs The inputs for each command that requires one.
    function execute(bytes calldata commands, bytes[] calldata inputs) external payable;
}
