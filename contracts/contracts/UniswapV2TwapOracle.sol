// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
Simple UniswapV2 TWAP Oracle (educational)
- Owner can call update() to record cumulative price and timestamp from a UniswapV2 pair.
- consult(amountIn) returns amountOut based on average price since last update.
Notes:
- This is a simplified oracle for demo/testing (owner-triggered). In production use robust decentralized oracle patterns.
*/

interface IUniswapV2Pair {
    function price0CumulativeLast() external view returns (uint256);
    function price1CumulativeLast() external view returns (uint256);
    function getReserves() external view returns (uint112, uint112, uint32);
}

contract UniswapV2TwapOracle {
    address public owner;
    address public pair;
    uint256 public priceCumulativeLast;
    uint32 public blockTimestampLast;

    constructor(address _pair) {
        owner = msg.sender;
        pair = _pair;
    }

    modifier onlyOwner() { require(msg.sender == owner, "only owner"); _; }

    function update() external onlyOwner {
        // Read cumulative price and timestamp from pair
        // For simplicity, we read price0CumulativeLast
        uint256 priceCumulative = IUniswapV2Pair(pair).price0CumulativeLast();
        (, , uint32 blockTimestampLastLocal) = IUniswapV2Pair(pair).getReserves();
        priceCumulativeLast = priceCumulative;
        blockTimestampLast = blockTimestampLastLocal;
    }

    // Compute average price based on cumulative difference
    function consult(uint256 amountIn) external view returns (uint256 amountOut) {
        uint256 priceCumulative = IUniswapV2Pair(pair).price0CumulativeLast();
        ( , , uint32 blockTimestamp) = IUniswapV2Pair(pair).getReserves();
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        if(timeElapsed == 0){ return 0; }
        uint256 priceCumulativeDelta = priceCumulative - priceCumulativeLast;
        // average price = priceCumulativeDelta / timeElapsed
        // priceCumulative units: price * time. For simplicity assume it's scaled to 2**112
        uint256 avgPrice = priceCumulativeDelta / uint256(timeElapsed);
        // amountOut = avgPrice * amountIn / (2**112) -- to avoid complex fixed point, user must interpret result
        amountOut = (avgPrice * amountIn) / (2**112);
    }
}
