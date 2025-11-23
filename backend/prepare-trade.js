const { Contract, AbiCoder, parseUnits, formatUnits, solidityPacked } = require('ethers');
const { getDexConfig, getProvider } = require('./utils');
const { NETWORKS, BOT_CONFIG, DEX_TYPES, TOKENS, TOKEN_DECIMALS } = require('./config');
const { AAVE_ARBITRAGE_V3_ABI, AERODROME_FACTORY_ABI } = require('./abi.js');
const { findBestPath } = require('./services');
const ERC20_ABI = ["function decimals() external view returns (uint8)"];
const AERODROME_POOL_ABI = ["function stable() external view returns (bool)"];

async function prepareTrade(tradeParams) {
    const { network, tokenA, tokenB, dex1, dex2, loanAmount, userAddress, bestFee1, bestFee2 } = tradeParams;

    if (!userAddress) {
        throw new Error("User address is required to prepare a trade.");
    }

    const provider = getProvider(network, NETWORKS);
    const arbitrageBot = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, AAVE_ARBITRAGE_V3_ABI, provider);

    const dexConfig1 = getDexConfig(dex1);
    const dexConfig2 = getDexConfig(dex2);

    const tokenAContract = new Contract(tokenA, ERC20_ABI, provider);
    const tokenADecimals = await tokenAContract.decimals();
    const loanAmountBigInt = parseUnits(loanAmount, tokenADecimals);

    // --- Simulate the trade to calculate amountOutMin for slippage protection ---
    const path1 = await findBestPath(tokenA, tokenB, loanAmountBigInt, provider, [dex1]);
    if (!path1 || path1.amountOut === 0n) {
        throw new Error(`No path found for ${tokenA} -> ${tokenB} on ${dex1} during preparation`);
    }
    const amountB_expected = path1.amountOut;

    const path2 = await findBestPath(tokenB, tokenA, amountB_expected, provider, [dex2]);
    if (!path2 || path2.amountOut === 0n) {
        throw new Error(`No path found for ${tokenB} -> ${tokenA} on ${dex2} during preparation`);
    }
    const finalAmountA_expected = path2.amountOut;

    // Apply 0.5% slippage tolerance
    const slippageTolerance = 50n; // 0.5% represented as bps (50 / 10000)
    const amountOutMin = finalAmountA_expected - (finalAmountA_expected * slippageTolerance / 10000n);
    // --- End Simulation ---

    const defaultAbiCoder = new AbiCoder();

    const getAerodromePoolIsStable = async (factoryAddress, fromToken, toToken) => {
        const factoryContract = new Contract(factoryAddress, AERODROME_FACTORY_ABI, provider);
        const poolAddress = await factoryContract.getPool(fromToken, toToken);
        
        if (poolAddress === '0x0000000000000000000000000000000000000000') {
            return { poolAddress: null, isStable: false }; // Or throw an error
        }
        
        const poolContract = new Contract(poolAddress, AERODROME_POOL_ABI, provider);
        const isStable = await poolContract.stable();
        return { poolAddress, isStable };
    };

    const getDexParams = async (dexName, fromToken, toToken, fee, dexConfig, amountOutSlippage) => {
        const dexType = DEX_TYPES[dexName];
        
        if (dexType === 1 || dexType === 2) { // V3 DEXs
            const path = solidityPacked(['address', 'uint24', 'address'], [fromToken, fee, toToken]);
            return defaultAbiCoder.encode(['bytes', 'uint256'], [path, amountOutSlippage]);
        } else if (dexType === 0) { // V2 DEX (Aerodrome)
            const { isStable } = await getAerodromePoolIsStable(dexConfig.factory, fromToken, toToken);
            return defaultAbiCoder.encode(['bool', 'address', 'uint256'], [isStable, dexConfig.factory, amountOutSlippage]);
        } else {
            return defaultAbiCoder.encode(['uint256'], [0]); // Should not happen
        }
    };

    const swaps = [
        {
            router: dexConfig1.router,
            from: tokenA,
            to: tokenB,
            dex: DEX_TYPES[dex1],
            dexParams: await getDexParams(dex1, tokenA, tokenB, bestFee1, dexConfig1, 0) // No slippage on first leg
        },
        {
            router: dexConfig2.router,
            from: tokenB,
            to: tokenA,
            dex: DEX_TYPES[dex2],
            dexParams: await getDexParams(dex2, tokenB, tokenA, bestFee2, dexConfig2, amountOutMin)
        }
    ];

    const estimatedGas = await arbitrageBot.executeArbitrage.estimateGas(tokenA, loanAmountBigInt, swaps);
    const gasLimit = BigInt(Math.round(Number(estimatedGas) * 1.2)); // Add 20% buffer

    const { data } = await arbitrageBot.executeArbitrage.populateTransaction(
        tokenA,
        loanAmountBigInt,
        swaps
    );

    return {
        to: BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS,
        from: userAddress,
        data,
        gasLimit: gasLimit.toString(),
    };
}

module.exports = { prepareTrade };
