const { getProvider, getGasPrice } = require('./utils');
const { NETWORKS, BOT_CONFIG, TOKENS, TOKEN_DECIMALS, WRAPPED_NATIVE_CURRENCY } = require('./config');
const { findBestPath } = require('./services');
const { Contract, parseUnits, formatUnits } = require('ethers');
const { AAVE_ARBITRAGE_V3_ABI } = require('./abi');


async function getNativeTokenPriceInToken(network, provider, loanTokenAddress) {
    const nativeAddress = WRAPPED_NATIVE_CURRENCY[network].address;
    if (loanTokenAddress.toLowerCase() === nativeAddress.toLowerCase()) {
        return 1.0; // Price is 1:1 if loan token is the native currency
    }

    try {
        // Use a stablecoin as a bridge for price calculation, e.g., USDC
        const usdcAddress = TOKENS[network].USDC;
        if (!usdcAddress) throw new Error('USDC address not configured for this network.');

        // Find path from 1 Native Token to USDC
        const nativeToUsdcPath = await findBestPath(nativeAddress, usdcAddress, parseUnits('1', 18), provider, ['PancakeSwap', 'Aerodrome']);
        if (!nativeToUsdcPath || nativeToUsdcPath.amountOut === 0n) return null;
        const usdcAmount = nativeToUsdcPath.amountOut;
        
        // Find path from Loan Token to USDC
        const loanTokenSymbol = Object.keys(TOKENS[network]).find(key => TOKENS[network][key].toLowerCase() === loanTokenAddress.toLowerCase());
        const loanTokenDecimals = TOKEN_DECIMALS[network][loanTokenSymbol];
        const loanTokenToUsdcPath = await findBestPath(loanTokenAddress, usdcAddress, parseUnits('1', loanTokenDecimals), provider, ['PancakeSwap', 'Aerodrome']);
        if (!loanTokenToUsdcPath || loanTokenToUsdcPath.amountOut === 0n) return null;
        const usdcPerLoanToken = loanTokenToUsdcPath.amountOut;

        // The price is the ratio of their values in USDC
        const price = parseFloat(formatUnits(usdcAmount, 6)) / parseFloat(formatUnits(usdcPerLoanToken, 6));
        
        return price;

    } catch (error) {
        console.error("Error fetching native token price:", error);
        return null; 
    }
}


async function simulateTrade(tradeParams) {
    const { network, tokenA, tokenB, amount, dex1, dex2, isStable } = tradeParams;

    const provider = getProvider(network, NETWORKS);
    const tokenASymbol = Object.keys(TOKENS[network]).find(key => TOKENS[network][key].toLowerCase() === tokenA.toLowerCase());
    const tokenADecimals = TOKEN_DECIMALS[network][tokenASymbol];

    if (!tokenADecimals) {
        throw new Error(`Decimals not found for token: ${tokenA} on network ${network}`);
    }
    const loanAmountBigInt = parseUnits(amount, tokenADecimals);

    // 1. Simulate the full arbitrage path
    const path1 = await findBestPath(tokenA, tokenB, loanAmountBigInt, provider, [dex1], isStable);
    if (!path1 || path1.amountOut === 0n) {
        throw new Error(`No profitable path found for ${tokenA} -> ${tokenB} on ${dex1}`);
    }
    const amountB = path1.amountOut;

    const path2 = await findBestPath(tokenB, tokenA, amountB, provider, [dex2], isStable);
    if (!path2 || path2.amountOut === 0n) {
        throw new Error(`No profitable path found for ${tokenB} -> ${tokenA} on ${dex2}`);
    }
    const finalAmountA = path2.amountOut;

    // 2. Calculate Gross Profit in terms of the loan token
    const grossProfit = finalAmountA - loanAmountBigInt;

    // 3. Estimate Gas Cost
    const gasPrice = await getGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);
    const estimatedGasLimit = BigInt(BOT_CONFIG.GAS_LIMIT_MANUAL_TRADE); 
    const estimatedGasCostNative = estimatedGasLimit * gasPrice;

    // 4. Convert Gas Cost to Loan Token
    const nativeTokenPrice = await getNativeTokenPriceInToken(network, provider, tokenA);
    if (nativeTokenPrice === null) {
        throw new Error("Could not determine the price of the native token to calculate net profit.");
    }

    const estimatedGasCostInToken = (Number(formatUnits(estimatedGasCostNative, 18)) / nativeTokenPrice).toFixed(tokenADecimals);
    const estimatedGasCostInTokenBigInt = parseUnits(estimatedGasCostInToken, tokenADecimals);

    // 5. Calculate Net Profit
    const netProfit = grossProfit - estimatedGasCostInTokenBigInt;

    return {
        isProfitable: netProfit > 0n,
        estimatedProfit: formatUnits(netProfit, tokenADecimals),
        grossProfit: formatUnits(grossProfit, tokenADecimals),
        estimatedGasCost: formatUnits(estimatedGasCostNative, 18),
        bestFee1: path1.fee ? path1.fee.toString() : 'N/A',
        bestFee2: path2.fee ? path2.fee.toString() : 'N/A',
    };
}

module.exports = { simulateTrade };
