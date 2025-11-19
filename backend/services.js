const { ethers, getAddress } = require('ethers');
const { TOKENS, TOKEN_DECIMALS, DEX_QUOTERS, V3_FEE_TIERS, DEX_ROUTERS } = require('./config');

const IUniswapV3QuoterV2ABI = require('./abis/IUniswapV3QuoterV2.json');
const IUniswapV2RouterABI = require('./abis/IUniswapV2Router.json');

// --- Path Finding Logic ---

async function findBestPath(tokenIn, tokenOut, amountIn, provider, dexWhitelist = Object.keys(DEX_ROUTERS.base)) {
    const tokenInSymbol = getTokenSymbol(tokenIn);
    const tokenOutSymbol = getTokenSymbol(tokenOut);

    if (!tokenInSymbol || !tokenOutSymbol) {
        console.error(`Could not find symbols for path ${tokenIn} -> ${tokenOut}`);
        return null;
    }

    const tokenInDecimals = TOKEN_DECIMALS.base[tokenInSymbol];
    const tokenOutDecimals = TOKEN_DECIMALS.base[tokenOutSymbol];

    let bestPath = {
        amountOut: 0n,
        dex: null,
        path: null,
        tokens: [],
        type: null
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

    let bestPath = { amountOut: 0n, dex, path: null, tokens: [], type: 'V3' };

    // 1. Check direct path
    for (const fee of feeTiers) {
        try {
            const path = ethers.solidityPacked(['address', 'uint24', 'address'], [tokenIn, fee, tokenOut]);
            const { amountOut } = await quoterContract.quoteExactInput.staticCall(path, amountIn);
            if (amountOut > bestPath.amountOut) {
                bestPath = { ...bestPath, amountOut, path, tokens: [tokenIn, tokenOut] };
            }
        } catch (e) { /* Path doesn't exist, ignore */ }
    }

    // 2. Check multi-hop path (via WETH)
    if (tokenIn !== TOKENS.base.WETH && tokenOut !== TOKENS.base.WETH) {
         for (const fee1 of feeTiers) {
            for (const fee2 of feeTiers) {
                 try {
                    const path = ethers.solidityPacked(
                        ['address', 'uint24', 'address', 'uint24', 'address'],
                        [tokenIn, fee1, TOKENS.base.WETH, fee2, tokenOut]
                    );
                    const { amountOut } = await quoterContract.quoteExactInput.staticCall(path, amountIn);
                    if (amountOut > bestPath.amountOut) {
                        bestPath = { ...bestPath, amountOut, path, tokens: [tokenIn, TOKENS.base.WETH, tokenOut] };
                    }
                } catch (e) { /* Path doesn't exist */ }
            }
        }
    }
    
    return bestPath.amountOut > 0n ? bestPath : null;
}

async function findV2BestPath(dex, tokenIn, tokenOut, amountIn, provider) {
    const routerAddress = DEX_ROUTERS.base[dex];
    const routerContract = new ethers.Contract(routerAddress, IUniswapV2RouterABI, provider);
    let bestPath = { amountOut: 0n, dex, path: null, tokens: [], type: 'V2' };

    // 1. Check direct path
    try {
        const amounts = await routerContract.getAmountsOut.staticCall(amountIn, [tokenIn, tokenOut]);
        const amountOut = amounts[amounts.length - 1];
        if (amountOut > bestPath.amountOut) {
            bestPath = { ...bestPath, amountOut, tokens: [tokenIn, tokenOut] };
        }
    } catch (e) { /* Path doesn't exist, ignore */ }

    // 2. Check multi-hop path (via WETH)
    if (tokenIn !== TOKENS.base.WETH && tokenOut !== TOKENS.base.WETH) {
        try {
            const amounts = await routerContract.getAmountsOut.staticCall(amountIn, [tokenIn, TOKENS.base.WETH, tokenOut]);
            const amountOut = amounts[amounts.length - 1];
            if (amountOut > bestPath.amountOut) {
                 bestPath = { ...bestPath, amountOut, tokens: [tokenIn, TOKENS.base.WETH, tokenOut] };
            }
        } catch (e) { /* Path doesn't exist, ignore */ }
    }

    return bestPath.amountOut > 0n ? bestPath : null;
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
        if (getAddress(address) === tokenAddress) {
            return symbol;
        }
    }
    return null;
}


module.exports = {
    findBestPath,
    getDynamicGasPrice,
};