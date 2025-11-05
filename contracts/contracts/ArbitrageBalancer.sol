// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswapV2Router.sol";

interface IVault {
    function flashLoan(
        address recipient,
        address[] calldata tokens,
        uint256[] calldata amounts,
        bytes calldata userData
    ) external;
}

contract ArbitrageBalancer is ReentrancyGuard {
    address public immutable owner;
    IVault public immutable vault;

    event FlashLoanExecuted(address indexed token, uint256 loanAmount, int256 netProfit);

    modifier onlyOwner() { require(msg.sender == owner, "only owner"); _; }

    constructor(address _vault) {
        owner = msg.sender;
        vault = IVault(_vault);
    }

    function startFlashloan(address token, uint256 amount, bytes calldata userData) external onlyOwner {
        address[] memory tokens = new address[](1);
        tokens[0] = token;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;
        vault.flashLoan(address(this), tokens, amounts, userData);
    }

    function receiveFlashLoan(
        address[] calldata tokens,
        uint256[] calldata amounts,
        uint256[] calldata feeAmounts,
        bytes calldata userData
    ) external nonReentrant {
        require(msg.sender == address(vault), "only vault");
        require(tokens.length == 1, "only single token flash loans");

        (
            address inputToken,
            address middleToken,
            address outputToken,
            address[] memory routers,
            address[][] memory paths,
            uint256 minOutsSecondSwap,
            uint256 minTwap
        ) = abi.decode(userData, (address, address, address, address[], address[][], uint256, uint256));

        address loanToken = tokens[0];
        uint256 loanAmount = amounts[0];
        uint256 fee = feeAmounts[0];
        uint256 totalRepayment = loanAmount + fee;

        // 1. First Swap
        IERC20(loanToken).approve(routers[0], loanAmount);
        uint[] memory amountsOut1 = IUniswapV2Router(routers[0]).swapExactTokensForTokens(
            loanAmount,
            1, // Minimal amount out for the first swap
            paths[0],
            address(this),
            block.timestamp 
        );

        // 2. Second Swap
        uint amountFromFirstSwap = amountsOut1[amountsOut1.length - 1];
        IERC20(middleToken).approve(routers[1], amountFromFirstSwap);
        
        uint[] memory amountsOut2 = IUniswapV2Router(routers[1]).swapExactTokensForTokens(
            amountFromFirstSwap,
            totalRepayment,
            paths[1],
            address(this),
            block.timestamp
        );
        uint amountFromSecondSwap = amountsOut2[amountsOut2.length - 1];

        // 3. Repay Flash Loan
        require(amountFromSecondSwap >= totalRepayment, "Not profitable");

        IERC20(loanToken).transfer(address(vault), totalRepayment);

        // 4. Calculate and withdraw profit
        uint256 profit = amountFromSecondSwap - totalRepayment;
        if (profit > 0) {
            IERC20(loanToken).transfer(owner, profit);
        }

        emit FlashLoanExecuted(loanToken, loanAmount, int256(profit));
    }
    
    function withdraw(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        if (balance > 0) {
            token.transfer(owner, balance);
        }
    }
}
