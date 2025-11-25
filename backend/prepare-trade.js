const { Contract, AbiCoder, parseUnits, formatUnits, solidityPacked } = require('ethers');
const { getDexConfig, getProvider } = require('./utils');
const { NETWORKS, BOT_CONFIG, DEX_TYPES, TOKEN_DECIMALS, TOKENS } = require('./config');
const { AAVE_ARBITRAGE_V3_ABI } = require('./abi.js');
const { findBestPath } = require('./services');

async function prepareTrade(tradeParams) {
    const { network, userAddress, tokenA, tokenB, amount, dex1, dex2, isStable, fee1, fee2 } = tradeParams;

    if (!userAddress) {
        throw new Error("User address is required to prepare a trade.");
    }

    const provider = getProvider(network, NETWORKS);
    const arbitrageBot = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, AAVE_ARBITRAGE_V3_ABI, provider);

    const dexConfig1 = getDexConfig(dex1);
    const dexConfig2 = getDexConfig(dex2);
    
    const tokenASymbol = Object.keys(TOKENS[network]).find(key => TOKENS[network][key].toLowerCase() === tokenA.toLowerCase());
    const tokenADecimals = TOKEN_DECIMALS[network][tokenASymbol];

    if (!tokenADecimals) {
        throw new Error(`Could not determine decimals for token ${tokenA}`);
    }

    const loanAmountBigInt = parseUnits(amount, tokenADecimals);
    const slippageTolerance = BigInt(BOT_CONFIG.SLIPPAGE_TOLERANCE * 10000);

    // --- Simulate the trade to calculate amountOutMin for slippage protection ---
    const path1 = await findBestPath(tokenA, tokenB, loanAmountBigInt, provider, [dex1], isStable);
    if (!path1 || path1.amountOut === 0n) {
        throw new Error(`No path found for ${tokenA} -> ${tokenB} on ${dex1} during preparation`);
    }
    const amountB_expected = path1.amountOut;
    const amountOutMin1 = amountB_expected - (amountB_expected * slippageTolerance / 10000n);

    const path2 = await findBestPath(tokenB, tokenA, amountB_expected, provider, [dex2], isStable);
    if (!path2 || path2.amountOut === 0n) {
        throw new Error(`No path found for ${tokenB} -> ${tokenA} on ${dex2} during preparation`);
    }
    const finalAmountA_expected = path2.amountOut;
    const amountOutMin2 = finalAmountA_expected - (finalAmountA_expected * slippageTolerance / 10000n);
    // --- End Simulation ---

    const defaultAbiCoder = new AbiCoder();

    const getDexParams = (dexName, fromToken, toToken, fee, amountOutSlippage) => {
        const dexType = DEX_TYPES[dexName];
        
        if (dexType === 1 || dexType === 2) { // PancakeV3 / SushiV3
            const path = solidityPacked(['address', 'uint24', 'address'], [fromToken, fee, toToken]);
            return defaultAbiCoder.encode(['bytes', 'uint256'], [path, amountOutSlippage]);
        }
        
        if (dexType === 0) { // Aerodrome / Velocidrome
            return defaultAbiCoder.encode(['uint256'], [amountOutSlippage]);
        } 
        
        throw new Error(`Unsupported DEX for trade preparation: ${dexName}`);
    };

    const swaps = [
        {
            router: dexConfig1.router,
            from: tokenA,
            to: tokenB,
            dex: DEX_TYPES[dex1],
            dexParams: getDexParams(dex1, tokenA, tokenB, fee1, amountOutMin1)
        },
        {
            router: dexConfig2.router,
            from: tokenB,
            to: tokenA,
            dex: DEX_TYPES[dex2],
            dexParams: getDexParams(dex2, tokenB, tokenA, fee2, amountOutMin2)
        }
    ];

    const populatedTx = await arbitrageBot.executeArbitrage.populateTransaction(
        tokenA,
        loanAmountBigInt,
        swaps
    );

    return {
        tx: {
            to: BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS,
            from: userAddress,
            data: populatedTx.data,
        }
    };
}

module.exports = { prepareTrade };
