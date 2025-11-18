// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;

/// @title Periphery Payments
/// @notice Functions to ease deposits and withdrawals of ETH
interface IPeripheryPayments {
    /// @notice Unwraps the contract's WETH9 balance and sends it to recipient as ETH.
    /// @param amountMinimum The minimum amount of WETH9 to unwrap
    /// @param recipient The recipient of the ETH
    function unwrapWETH9(uint256 amountMinimum, address recipient) external payable;

    /// @notice Refunds any ETH balance held by this contract to the `msg.sender`
    /// @dev Useful for bundling with transactions that may accidentally send ETH to this contract.
    function refundETH() external payable;

    /// @notice Sweep tokens from this contract
    /// @param token The address of the token to sweep
    /// @param amountMinimum The minimum amount of tokens to sweep
    /// @param recipient The recipient of the tokens
    function sweepToken(address token, uint256 amountMinimum, address recipient) external payable;
}
