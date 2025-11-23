const { ethers, getAddress, solidityPacked } = require('ethers');
const { TOKENS, TOKEN_DECIMALS, DEX_QUOTERS, V3_FEE_TIERS, DEX_ROUTERS } = require('./config');
const { getDexConfig, getProvider } = require('./utils');

const IUniswapV3QuoterV2ABI = require('./abis/IUniswapV3QuoterV2.json');
const IUniswapV2RouterABI = require('./abis/IUniswapV2Router.json');
const IUniswapV2FactoryABI = require('./abis/IUniswapV2Factory.json');
const IUniswapV2PairABI = require('./abis/IUniswapV2Pair.json');

// --- Path Finding Logic ---

async function findBestPath(tokenIn, tokenOut, amountIn, provider, dexWhitelist = Object.keys(DEX_ROUTERS.base)) {
    const tokenInSymbol = getTokenSymbol(tokenIn);
    const tokenOutSymbol = getTokenSymbol(tokenOut);

    if (!tokenInSymbol || !tokenOutSymbol) {
        console.error(`Could not find symbols for path ${tokenIn} -> ${tokenOut}`);
        return null;
    }

    let bestPath = {
        amountOut: 0n,
        dex: null,
        path: null,
        tokens: [],
        type: null,
        stable: false,
    };

    const pathPromises = [];

    for (const dex of dexWhitelist) {
        if (DEX_QUOTERS.base[dex]) { // V3-style DEXs
            pathPromises.push(findV3BestPath(dex, tokenIn, tokenOut, amountIn, provider));
        } else { // V2-style DEXs
            pathPromises.push(findV2BestPath(dex, tokenIn, tokenOut, amountIn, provider));
        }
    }

    const results = await Promise.allSettled(pathPromises);

    for (const result of results) {
        if (result.status === 'fulfilled' && result.value && result.value.amountOut > bestPath.amountOut) {
            bestPath = result.value;
        }
    }

    if (bestPath.amountOut > 0n) {
        return bestPath;
    }

    return null;
}

async function findV3BestPath(dex, tokenIn, tokenOut, amountIn, provider) {
    const quoterAddress = DEX_QUOTERS.base[dex];
    const quoterContract = new ethers.Contract(quoterAddress, IUniswapV3QuoterV2ABI, provider);
    const feeTiers = V3_FEE_TIERS[dex];

    let bestPath = { amountOut: 0n, dex, path: null, tokens: [], type: 'V3', stable: false };

    // 1. Check direct path
    for (const fee of feeTiers) {
        try {
            const path = solidityPacked(['address', 'uint24', 'address'], [tokenIn, fee, tokenOut]);
            const amountOut = await quoterContract.quoteExactInputSingle.staticCall(path, amountIn);

            if (amountOut > bestPath.amountOut) {
                bestPath = { ...bestPath, amountOut, path, tokens: [tokenIn, tokenOut], fee };
            }
        } catch (e) { /* Path doesn't exist, ignore */ }
    }

    // 2. Check multi-hop path (via WETH)
    if (tokenIn !== TOKENS.base.WETH && tokenOut !== TOKENS.base.WETH) {
         for (const fee1 of feeTiers) {
            for (const fee2 of feeTiers) {
                 try {
                    const path = solidityPacked(
                        ['address', 'uint24', 'address', 'uint24', 'address'],
                        [tokenIn, fee1, TOKENS.base.WETH, fee2, tokenOut]
                    );
                    const amountOut = await quoterContract.quoteExactInput.staticCall(path, amountIn);
                    if (amountOut > bestPath.amountOut) {
                        bestPath = { ...bestPath, amountOut, path, tokens: [tokenIn, TOKENS.base.WETH, tokenOut], fee: [fee1, fee2] };
                    }
                } catch (e) { /* Path doesn't exist */ }
            }
        }
    }

    return bestPath.amountOut > 0n ? bestPath : null;
}

async function findV2BestPath(dex, tokenIn, tokenOut, amountIn, provider) {
    const dexConfig = DEX_ROUTERS.base[dex];

    let bestPath = { amountOut: 0n, dex, path: [], tokens: [], type: 'V2', stable: false };

    const factories = Object.entries(dexConfig.factories || {}).map(([type, address]) => ({ type, address, isStable: type === 'stable' }));

    // Add a synthetic factory for DEXs without explicit factory types
    if (factories.length === 0 && dexConfig.factory) {
        factories.push({ type: 'volatile', address: dexConfig.factory, isStable: false });
    }

    for (const factoryConfig of factories) {
        const factoryContract = new ethers.Contract(factoryConfig.address, IUniswapV2FactoryABI, provider);

        // 1. Check direct path
        let currentBestAmount = bestPath.amountOut;
        try {
            const pairAddress = await factoryContract.getPair(tokenIn, tokenOut);
            if (pairAddress !== ethers.ZeroAddress) {
                const pairContract = new ethers.Contract(pairAddress, IUniswapV2PairABI, provider);
                const reserves = await pairContract.getReserves();
                const [reserveIn, reserveOut] = tokenIn.toLowerCase() < tokenOut.toLowerCase() ? [reserves[0], reserves[1]] : [reserves[1], reserves[0]];
                const amountOut = getAmountOut(amountIn, reserveIn, reserveOut);

                if (amountOut > currentBestAmount) {
                    bestPath = { amountOut, dex, path: [tokenIn, tokenOut], tokens: [tokenIn, tokenOut], type: 'V2', stable: factoryConfig.isStable };
                    currentBestAmount = amountOut;
                }
            }
        } catch (e) { /* Path doesn't exist */ }

        // 2. Check multi-hop path (via WETH)
        if (tokenIn !== TOKENS.base.WETH && tokenOut !== TOKENS.base.WETH) {
            try {
                // In -> WETH
                const pair1Address = await factoryContract.getPair(tokenIn, TOKENS.base.WETH);
                if (pair1Address !== ethers.ZeroAddress) {
                    const pair1Contract = new ethers.Contract(pair1Address, IUniswapV2PairABI, provider);
                    const reserves1 = await pair1Contract.getReserves();
                    const [reserveIn1, reserveOut1] = tokenIn.toLowerCase() < TOKENS.base.WETH.toLowerCase() ? [reserves1[0], reserves1[1]] : [reserves1[1], reserves1[0]];
                    const amountOut1 = getAmountOut(amountIn, reserveIn1, reserveOut1);

                    // WETH -> Out
                    const pair2Address = await factoryContract.getPair(TOKENS.base.WETH, tokenOut);
                    if (pair2Address !== ethers.ZeroAddress) {
                        const pair2Contract = new ethers.Contract(pair2Address, IUniswapV2PairABI, provider);
                        const reserves2 = await pair2Contract.getReserves();
                        const [reserveIn2, reserveOut2] = TOKENS.base.WETH.toLowerCase() < tokenOut.toLowerCase() ? [reserves2[0], reserves2[1]] : [reserves2[1], reserves2[0]];
                        const amountOut2 = getAmountOut(amountOut1, reserveIn2, reserveOut2);

                        if (amountOut2 > currentBestAmount) {
                            bestPath = { amountOut: amountOut2, dex, path: [tokenIn, TOKENS.base.WETH, tokenOut], tokens: [tokenIn, TOKENS.base.WETH, tokenOut], type: 'V2', stable: factoryConfig.isStable };
                        }
                    }
                }
            } catch (e) { /* Path doesn't exist */ }
        }
    }

    return bestPath.amountOut > 0n ? bestPath : null;
}

function getAmountOut(amountIn, reserveIn, reserveOut) {
    const amountInWithFee = amountIn * 997n; // Uniswap V2 fee is 0.3%
    const numerator = amountInWithFee * reserveOut;
    const denominator = (reserveIn * 1000n) + amountInWithFee;
    return numerator / denominator;
}

// --- Gas Price Logic ---

async function getDynamicGasPrice(provider, strategy) {
    const feeData = await provider.getFeeData();
    const baseFee = feeData.gasPrice;

    let multiplier;
    switch (strategy) {
        case 'slow':
            multiplier = 1.1;
            break;
        case 'fast':
            multiplier = 1.3;
            break;
        case 'urgent':
            multiplier = 1.5;
            break;
        default:
            multiplier = 1.2;
    }

    // Perform floating point multiplication and then convert to BigInt
    const gasPriceInWei = parseFloat(baseFee.toString()) * multiplier;
    return BigInt(Math.round(gasPriceInWei));
}


// --- Utility ---

function getTokenSymbol(address, network = 'base') {
    for (const [symbol, tokenAddress] of Object.entries(TOKENS[network])) {
        if (getAddress(address) === getAddress(tokenAddress)) {
            return symbol;
        }
    }
    return null;
}


module.exports = {
    findBestPath,
    getDynamicGasPrice,
};
