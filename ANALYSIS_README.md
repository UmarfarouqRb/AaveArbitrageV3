
# Project Analysis

This document provides a comprehensive analysis of the arbitrage bot project, focusing on the "Manual Trade" and "Automated Bot" workflows.

## Part 1: Manual Trade Workflow

The manual trade workflow allows a user to simulate and execute an arbitrage trade through a web interface.

### Frontend

- **`frontend/src/pages/ManualTradePage.jsx`**: Renders the `ManualTrade` component.
- **`frontend/src/components/ManualTrade.jsx`**: This is the core component for manual trading.
  - **User Interaction**: The user provides the following inputs:
    - Loan Token
    - Target Token
    - Loan Amount
    - DEX 1 and DEX 2
    - A checkbox to indicate if the trade is between volatile assets.
  - **Simulation**:
    - When the user clicks "Simulate Trade," a `POST` request is sent to the `/api/simulate-trade` endpoint on the backend.
    - The request body contains all the trade parameters.
    - The frontend displays the simulation result, including the estimated profit and whether the trade is profitable.
  - **Execution**:
    - If the simulation is profitable, the "Execute Trade" button is enabled.
    - When the user clicks "Execute Trade," a `POST` request is sent to the `/api/prepare-manual-trade` endpoint on the backend.
    - The frontend receives an unsigned transaction from the backend, which it then signs and sends to the blockchain using the user's connected wallet.

### Backend

- **`backend/server.js`**: The main server file that defines the API endpoints.
  - `POST /api/simulate-trade`: This endpoint calls the `simulateTrade` function from `simulate-manual-trade.js`.
  - `POST /api/prepare-manual-trade`: This endpoint calls the `prepareTrade` function from `prepare-manual-trade.js`.
- **`backend/simulate-manual-trade.js`**:
  - This file is responsible for simulating a manual arbitrage trade.
  - It simulates swaps on both Uniswap V2 and V3-like DEXs, finding the best fee tiers for V3 swaps.
- **`backend/prepare-manual-trade.js`**:
  - This file prepares an unsigned transaction for the `executeArbitrage` function of the `AaveArbitrageV3` smart contract.
  - It correctly encodes the `dexParams` for each swap based on the DEX type.

---

## Part 2: Automated Bot Workflow

The automated bot workflow continuously monitors the blockchain for arbitrage opportunities and executes them when found.

### Backend

- **`backend/server.js`**: Forks the `bot.js` process.
- **`backend/bot.js`**: The core of the automated bot.
  - **Initialization**: The bot initializes a provider and a wallet from environment variables.
  - **Block Listener**: It sets up a listener for new blocks on the blockchain.
  - **`findAndExecuteArbitrage(..)`**: For each new block, this function is called for each predefined arbitrage pair.
    - It calls `findBestPath` from `services.js` to find the most profitable trading route.
    - It calculates the net profit and compares it to a minimum profit threshold.
    - If a profitable opportunity is found, it constructs and executes the `executeArbitrage` function on the smart contract.
- **`backend/services.js`**:
  - **`findBestPath(..)`**: This function finds the best trading path between two tokens across a list of DEXs. It checks for both direct and multi-hop (via WETH) paths.
  - **`getDynamicGasPrice(..)`**: This function calculates a dynamic gas price based on the current network conditions.

---

## Identified Issues

1.  **V2 Pool Type Detection**: The `findV2BestPath` function in `services.js` does not differentiate between stable and volatile pools. This can lead to incorrect `dexParams` being encoded, which will cause transactions to fail.

2.  **Gas Estimation**: The bot currently uses a fixed `GAS_LIMIT` from the configuration, which is not optimal and can lead to out-of-gas errors or wasted gas.

