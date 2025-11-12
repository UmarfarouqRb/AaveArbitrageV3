
const { ethers } = require('ethers');
const { NETWORKS, BOT_CONFIG } = require('./config');

// --- Provider ---
const provider = new ethers.JsonRpcProvider(NETWORKS.base.rpcUrl);

// --- Dynamic Profitability Calculation ---
async function calculateDynamicProfit(trade) {
    const gasPrice = await getDynamicGasPrice();
    const gasCost = BigInt(BOT_CONFIG.GAS_LIMIT) * gasPrice;
    const slippageCost = (BigInt(trade.amountIn) * BigInt(BOT_CONFIG.SLIPPAGE_TOLERANCE)) / BigInt(10000);

    const netProfit = BigInt(trade.amountOut) - BigInt(trade.amountIn) - gasCost - slippageCost;

    return netProfit;
}

// --- Dynamic Gas Price Strategy ---
async function getDynamicGasPrice() {
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;

    // Adjust gas price based on network congestion
    if (BOT_CONFIG.GAS_PRICE_STRATEGY === 'fast') {
        return gasPrice * BigInt(12) / BigInt(10); // 20% premium for faster transactions
    } else {
        return gasPrice;
    }
}

module.exports = {
    calculateDynamicProfit,
    getDynamicGasPrice
};
