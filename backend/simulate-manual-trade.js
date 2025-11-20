
const { Contract, parseUnits, formatUnits } = require('ethers');
const { getDexConfig, getProvider } = require('./utils');
const { NETWORKS, DEX_QUOTERS, V3_FEE_TIERS, DEX_TYPES } = require('./config');
const IUniswapV2RouterABI = [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'
];
const IQuoterV2ABI = require('./IQuoterV2.abi');
const ERC20_ABI = ["function decimals() external view returns (uint8)"];

async function getV3Quote(quoterAddress, tokenIn, tokenOut, amountIn, fee, provider) {
    const quoter = new Contract(quoterAddress, IQuoterV2ABI, provider);
    const params = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountIn: amountIn,
        fee: fee,
        sqrtPriceLimitX96: 0
    };
    try {
        const quote = await quoter.quoteExactInputSingle.staticCall(params);
        return quote;
    } catch (error) {
        // console.log(`Could not get quote for ${fee} fee tier.`);
        return 0n;
    }
}

async function simulateV3Swap(dexName, dexConfig, tokenIn, tokenOut, amountIn, provider) {
    const quoterAddress = DEX_QUOTERS.base[dexName];
    if (!quoterAddress) return { quote: 0n, fee: 0 };

    const feeTiers = V3_FEE_TIERS[dexName] || [3000];
    let bestQuote = 0n;
    let bestFee = 0;

    for (const fee of feeTiers) {
        const quote = await getV3Quote(quoterAddress, tokenIn, tokenOut, amountIn, fee, provider);
        if (quote > bestQuote) {
            bestQuote = quote;
            bestFee = fee;
        }
    }

    return { quote: bestQuote, fee: bestFee };
}

async function simulateV2Swap(dexConfig, tokenIn, tokenOut, amountIn, provider) {
    const router = new Contract(dexConfig.router, IUniswapV2RouterABI, provider);
    try {
        const amountsOut = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
        return amountsOut[1];
    } catch (error) {
        // console.log('V2 simulation error:', error.message);
        return 0n;
    }
}

async function simulateTrade(tradeParams) {
    const { network, tokenA, tokenB, loanAmount, dex1, dex2 } = tradeParams;

    const provider = getProvider(network, NETWORKS);
    const tokenAContract = new Contract(tokenA, ERC20_ABI, provider);
    const tokenADecimals = await tokenAContract.decimals();
    const loanAmountBigInt = parseUnits(loanAmount, tokenADecimals);

    const dexConfig1 = getDexConfig(dex1);
    const dexConfig2 = getDexConfig(dex2);

    let amountOutFromDex1;
    let bestFee1 = 0;
    if (DEX_TYPES[dex1] === 0) { // V2
        amountOutFromDex1 = await simulateV2Swap(dexConfig1, tokenA, tokenB, loanAmountBigInt, provider);
    } else { // V3
        const result = await simulateV3Swap(dex1, dexConfig1, tokenA, tokenB, loanAmountBigInt, provider);
        amountOutFromDex1 = result.quote;
        bestFee1 = result.fee;
    }

    if (amountOutFromDex1 === 0n) {
        return { isProfitable: false, estimatedProfit: '0' };
    }

    let finalAmount;
    let bestFee2 = 0;
    if (DEX_TYPES[dex2] === 0) { // V2
        finalAmount = await simulateV2Swap(dexConfig2, tokenB, tokenA, amountOutFromDex1, provider);
    } else { // V3
        const result = await simulateV3Swap(dex2, dexConfig2, tokenB, tokenA, amountOutFromDex1, provider);
        finalAmount = result.quote;
        bestFee2 = result.fee;
    }

    const profit = finalAmount - loanAmountBigInt;

    return {
        isProfitable: profit > 0n,
        estimatedProfit: formatUnits(profit, tokenADecimals),
        bestFee1,
        bestFee2
    };
}

module.exports = { simulateTrade };
