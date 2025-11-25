
# Arbitrage Bot Documentation

## Adding a New DEX Router

This document outlines the two-step process for adding a new Decentralized Exchange (DEX) to the arbitrage bot. The smart contract is designed to be extensible, allowing the contract owner to whitelist new DEX routers without needing to redeploy the entire contract.

### Overview

The system uses a dual approach to managing DEXs:

1.  **Off-Chain Configuration:** The backend bot maintains a configuration file (`backend/config.js`) that defines the addresses and types of all known DEXs.
2.  **On-Chain Whitelist:** The smart contract stores a list of approved DEX router addresses. The bot will only use DEXs that are present in this on-chain whitelist.

This process ensures that the bot can be easily updated to support new DEXs as they become available.

### Step 1: Backend Configuration (Off-Chain)

First, you must "teach" the bot about the new DEX by adding its information to the `backend/config.js` file.

1.  **Open `backend/config.js`**
2.  **Add the new DEX to `DEX_ROUTERS`:** Add the DEX's name and its official router address. You can find the router address in the DEX's official documentation.
3.  **Add the new DEX to `DEX_TYPES`:** Specify the type of the DEX. Use `0` for V2-style DEXs (like Aerodrome or BaseSwap) and `1` or `2` for V3-style DEXs (like Uniswap V3).

**Example: Adding BaseSwap**

```javascript
// backend/config.js

const DEX_ROUTERS = {
    base: {
        // ... other DEXs
        BaseSwap: {
            router: "0x327Df1E6de05895d2ab08525869213A502a938E2",
            factory: "0xAaA7A543e542028d84E67F9BBA84A6578052a045",
        }
    },
};

const DEX_TYPES = {
    // ... other DEX types
    BaseSwap: 0, // V2-style DEX
};
```

### Step 2: Whitelisting the Router (On-Chain)

Next, you must add the new DEX's router to the smart contract's on-chain whitelist. This action can only be performed by the wallet that owns the contract.

**Transaction Details:**

*   **Contract Address:** Your deployed `AaveArbitrageV3` contract address.
*   **Function:** `setRouter`
*   **Parameters:**
    *   `_router` (address): The router address of the new DEX.
    *   `_isWhitelisted` (bool): `true`

#### How to Execute the Transaction

You can use a tool like [Remix](https://remix.ethereum.org/) or the "Write Contract" tab on Etherscan/BaseScan to send this transaction.

**Using Etherscan/BaseScan:**

1.  Navigate to your contract's page on the appropriate block explorer (e.g., BaseScan for the Base network).
2.  Go to the **"Contract"** tab, and then click **"Write as Proxy"** or **"Write Contract".**
3.  Click **"Connect to Web3"** to connect your owner wallet (e.g., MetaMask).
4.  Find the `setRouter` function.
5.  In the `_router` field, paste the new DEX's router address (e.g., `0x327Df1E6de05895d2ab08525869213A502a938E2` for BaseSwap).
6.  In the `_isWhitelisted` field, type `true`.
7.  Click the **"Write"** button and confirm the transaction in your wallet.

### Step 3: Restart the Bot

After the on-chain transaction is confirmed, you must restart the backend server. When the bot restarts, it will query the smart contract for the updated list of whitelisted routers and will begin using the newly added DEX.

### Verification

Check the bot's startup logs. You should see a log message that lists the whitelisted DEXs that the bot will use, and your newly added DEX should be in that list.

```
[INFO] CONFIG_LOADED: Bot will exclusively use these DEXs for opportunities: UniswapV3, Aerodrome, BaseSwap
```
