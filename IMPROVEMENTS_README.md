# Project Improvement Plan

This document outlines the recommended improvements to enhance the reliability and efficiency of the arbitrage bot.

## 1. V2 Pool Type Detection

**Issue:** The current implementation does not differentiate between stable and volatile pools for Uniswap V2-like DEXs. This can lead to incorrect transaction parameters and failed trades.

**Recommendation:**

1.  **Update DEX Configuration:** Add a `stable` flag and a `factory` address to the DEX configuration for V2 pools in `backend/config.js`.
2.  **Modify Path-Finding Logic:** Update the `findV2BestPath` function in `backend/services.js` to determine the pool type (stable or volatile) and include this information in the returned path object.
3.  **Correct `dexParams` Encoding:** Modify the `prepareTrade` function in `backend/prepare-manual-trade.js` and the `findAndExecuteArbitrage` function in `backend/bot.js` to use the `stable` flag from the path object to correctly encode the `dexParams` for V2 swaps.

## 2. Dynamic Gas Estimation

**Issue:** The bot currently uses a fixed `GAS_LIMIT` from the configuration, which is inefficient and can lead to out-of-gas errors or wasted gas.

**Recommendation:**

1.  **Remove Hardcoded Gas Limit:** Remove the `gasLimit` from the transaction options in `frontend/src/components/ManualTrade.jsx` and `backend/bot.js`.
2.  **Implement Dynamic Gas Estimation:** Before sending a transaction, use the `estimateGas` method from `ethers.js` to dynamically estimate the required gas limit. This will ensure that transactions are sent with an appropriate amount of gas, improving reliability and reducing costs.
