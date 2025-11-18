// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPermit2 {
    function approve(address token, address spender, uint256 amount, uint256 expiration) external;
}
