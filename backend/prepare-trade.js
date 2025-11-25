const { Contract, AbiCoder, parseUnits, formatUnits, solidityPacked } = require('ethers');
const { getDexConfig, getProvider } = require('./utils');
const { NETWORKS, BOT_CONFIG, DEX_TYPES } = require('./config');
const { AAVE_ARBITRAGE_V3_ABI } = require('./abi.js');
const { findBestPath } = require('./services');
const ERC20_ABI = ["function decimals() view returns (uint8)"];

async function prepareTrade(tradeParams) {
    const { network, userAddress, tokenA, tokenB, amount, dex1, dex2, isStable, fee1, fee2 } = tradeParams;

    if (!userAddress) {
        throw new Error("User address is required to prepare a trade.");
    }

    const provider = getProvider(network, NETWORKS);
    const arbitrageBot = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, AAVE_ARBITRAGE_V3_ABI, provider);

    const dexConfig1 = getDexConfig(dex1);
    const dexConfig2 = getDexConfig(dex2);

    const tokenAContract = new Contract(tokenA, ERC20_ABI, provider);
    const tokenADecimals = await tokenAContract.decimals();
    const loanAmountBigInt = parseUnits(amount, tokenADecimals);

    // --- Simulate the trade to calculate amountOutMin for slippage protection ---
    // Note: The `isStable` flag here is only for the off-chain simulation to find the best price.
    // The on-chain execution for Aerodrome will use the volatile pool regardless, as per the contract's logic.
    const path1 = await findBestPath(tokenA, tokenB, loanAmountBigInt, provider, [dex1], isStable);
    if (!path1 || path1.amountOut === 0n) {
        throw new Error(`No path found for ${tokenA} -> ${tokenB} on ${dex1} during preparation`);
    }
    const amountB_expected = path1.amountOut;

    const path2 = await findBestPath(tokenB, tokenA, amountB_expected, provider, [dex2], isStable);
    if (!path2 || path2.amountOut === 0n) {
        throw new Error(`No path found for ${tokenB} -> ${tokenA} on ${dex2} during preparation`);
    }
    const finalAmountA_expected = path2.amountOut;

    // Apply 0.5% slippage tolerance
    const slippageTolerance = 50n; // 0.5% represented as bps (50 / 10000)
    const amountOutMin = finalAmountA_expected - (finalAmountA_expected * slippageTolerance / 10000n);
    // --- End Simulation ---

    const defaultAbiCoder = new AbiCoder();

    const getDexParams = (dexName, fromToken, toToken, fee, amountOutSlippage) => {
        const dexType = DEX_TYPES[dexName];
        
        // For PancakeV3, the contract expects {bytes path, uint256 amountOutMinimum}
        if (dexType === 1) { 
            const path = solidityPacked(['address', 'uint24', 'address'], [fromToken, fee, toToken]);
            return defaultAbiCoder.encode(['bytes', 'uint256'], [path, amountOutSlippage]);
        }
        
        // For Aerodrome, the deployed contract ONLY expects {uint256 amountOutMin}
        if (dexType === 0) { 
            return defaultAbiCoder.encode(['uint'], [amountOutSlippage]);
        } 
        
        throw new Error(`Unsupported DEX for trade preparation: ${dexName}`);
    };

    const swaps = [
        {
            router: dexConfig1.router,
            from: tokenA,
            to: tokenB,
            dex: DEX_TYPES[dex1],
            // The `isStable` parameter in the swap struct is not used by the deployed contract's logic for Aerodrome.
            // We set it to false to be explicit, but it has no on-chain effect.
            isStable: false, 
            dexParams: getDexParams(dex1, tokenA, tokenB, fee1, 0) // No slippage on first leg
        },
        {
            router: dexConfig2.router,
            from: tokenB,
            to: tokenA,
            dex: DEX_TYPES[dex2],
            isStable: false, 
            dexParams: getDexParams(dex2, tokenB, tokenA, fee2, amountOutMin)
        }
    ];

    const { data } = await arbitrageBot.executeArbitrage.populateTransaction(
        tokenA,
        loanAmountBigInt,
        swaps
    );

    return {
        tx: {
            to: BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS,
            from: userAddress,
            data,
        }
    };
}

module.exports = { prepareTrade };
