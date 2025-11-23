const { getProvider, getGasPrice } = require('./utils');
const { NETWORKS, BOT_CONFIG, TOKENS, TOKEN_DECIMALS } = require('./config');
const { findBestPath } = require('./services');
const { Contract, parseUnits, formatUnits } = require('ethers');
const { AAVE_ARBITRAGE_V3_ABI } = require('./abi');

async function simulateTrade(tradeParams) {
    const { network, tokenA, tokenB, dex1, dex2, loanAmount } = tradeParams;

    const provider = getProvider(network, NETWORKS);
    const tokenADecimals = TOKEN_DECIMALS.base[Object.keys(TOKENS.base).find(key => TOKENS.base[key] === tokenA)];
    const loanAmountBigInt = parseUnits(loanAmount, tokenADecimals);

    // 1. Simulate the first leg of the arbitrage (A -> B)
    const path1 = await findBestPath(tokenA, tokenB, loanAmountBigInt, provider, [dex1]);
    if (!path1 || path1.amountOut === 0n) {
        throw new Error(`No path found for ${tokenA} -> ${tokenB} on ${dex1}`);
    }
    const amountB = path1.amountOut;

    // 2. Simulate the second leg of the arbitrage (B -> A)
    const path2 = await findBestPath(tokenB, tokenA, amountB, provider, [dex2]);
    if (!path2 || path2.amountOut === 0n) {
        throw new Error(`No path found for ${tokenB} -> ${tokenA} on ${dex2}`);
    }
    const finalAmountA = path2.amountOut;

    // 3. Calculate gross profit
    const grossProfit = finalAmountA - loanAmountBigInt;
    const grossProfitFormatted = formatUnits(grossProfit, tokenADecimals);

    // 4. Estimate gas cost
    const arbitrageBot = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, AAVE_ARBITRAGE_V3_ABI, provider);
    const gasPrice = await getGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);
    
    // We can't get a perfect gas estimate without building the full transaction,
    // but we can use a historical or configured average for simulation purposes.
    const estimatedGasLimit = BigInt(BOT_CONFIG.GAS_LIMIT); 
    const estimatedGasCost = estimatedGasLimit * gasPrice;
    const estimatedGasCostFormatted = formatUnits(estimatedGasCost, 18); // Gas is in ETH

    // 5. Calculate net profit
    // Note: This is a simplified calculation. A more precise one would convert profit to ETH.
    // For now, we show profit in the loan token and gas in ETH.
    
    return {
        loanAmount: loanAmount,
        finalAmount: formatUnits(finalAmountA, tokenADecimals),
        grossProfit: grossProfitFormatted,
        estimatedGas: estimatedGasCostFormatted,
        // The frontend can calculate the final net profit based on current token prices.
    };
}

module.exports = { simulateTrade };
