
# Arbitrage Bot

This is a sophisticated arbitrage bot designed to automatically find and execute profitable trades across different decentralized exchanges (DEXs) on the Base network. It operates by monitoring price differences between DEXs for the same token pairs and executing flash swaps to capitalize on those differences.

## How It Works

The bot scans for arbitrage opportunities in every new block on the blockchain. Here's a simplified breakdown of its process:

1.  **Scans DEXs**: In each block, the bot fetches the prices of configured token pairs on multiple DEXs.
2.  **Identifies Opportunities**: It compares the prices of the same token pair across different DEXs. If it finds a price discrepancy, it flags a potential arbitrage opportunity.
3.  **Calculates Profitability**: The bot calculates the potential profit of the arbitrage, taking into account the dynamic gas fees required to execute the transaction.
4.  **Executes Trades**: If the calculated net profit is above a defined threshold, the bot will attempt to execute the trade.

## Security Warning

**This bot operates using your private key. The security of your funds is your responsibility.**

*   **NEVER share your private key with anyone.**
*   **Do not commit your `.env` file or private key to any public repository.**
*   **It is highly recommended to use a new, dedicated "hot wallet" for this bot with a limited amount of funds.** Do not use a wallet that holds a significant portion of your assets.

## Getting Started

### Prerequisites

*   **Node.js**: [Download and install Node.js](https://nodejs.org/)
*   **Git**: [Download and install Git](https://git-scm.com/)
*   **A "Hot Wallet"**: A new Ethereum-compatible wallet with a small amount of ETH for gas fees. You can create one with MetaMask or a similar wallet provider.
*   **Your Private Key**: You will need to export the private key from your new hot wallet.

### Local Setup

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Create an Environment File**:
    *   Create a file named `.env` in the `backend` directory.
    *   Add your private key to this file:
        ```
        PRIVATE_KEY=your_private_key_here
        ```

4.  **Run the Bot**:
    ```bash
    node backend/bot.js
    ```

## Deployment to Render

To run the bot 24/7, you can deploy it as a **Background Worker** on a service like Render.

1.  **Create a Render Account**: [Sign up for a free Render account](https://render.com/).
2.  **Fork this Repository**: Fork this project to your own GitHub account.
3.  **Create a New Background Worker**:
    *   From the Render dashboard, click "New" -> "Background Worker".
    *   Connect your forked repository.
    *   Use the following settings:
        *   **Build Command**: `npm install`
        *   **Start Command**: `node backend/bot.js`
4.  **Add Your Environment Variable**:
    *   Go to the "Environment" tab for your new service.
    *   Add a new environment variable with the key `PRIVATE_KEY` and your private key as the value.

Your bot will then be live and running continuously.
