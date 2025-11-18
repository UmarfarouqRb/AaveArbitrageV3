
const { ethers } = require('ethers');
const { NETWORKS, BOT_CONFIG, DEX_ROUTERS, DEX_QUOTERS, V3_FEE_TIERS, TOKENS } = require('./config');
const { multicall } = require('./multicall');
const IUniswapV3QuoterV2 = require('./abi/IUniswapV3QuoterV2.json');
const IUniswapV2Router02 = require('./abi/IUniswapV2Router02.json');

const provider = new ethers.JsonRpcProvider(NETWORKS.base.rpcUrl);

// --- Hybrid Pathfinding Logic (V2 & V3) ---

function encodeV3Path(pathTokens, pathFees) {
    let encoded = "0x" + pathTokens[0].slice(2);
    for (let i = 0; i < pathFees.length; i++) {
        encoded += pathFees[i].toString(16).padStart(6, '0') + pathTokens[i + 1].slice(2);
    }
    return encoded;
}

async function findBestPath(tokenIn, tokenOut, amountIn, maxHops = 3) {
    let bestPath = { amountOut: 0n };

    // 1. Find best V3 paths
    const v3DEXs = Object.keys(DEX_QUOTERS.base);
    for (const dex of v3DEXs) {
        const path = await findBestPathV3(dex, tokenIn, tokenOut, amountIn, maxHops);
        if (path && path.amountOut > bestPath.amountOut) {
            bestPath = path;
        }
    }

    // 2. Find best V2 paths (Aerodrome)
    const v2DEXs = ['Aerodrome']; // Add other V2 DEXs here if needed
    for (const dex of v2DEXs) {
        const path = await findBestPathV2(dex, tokenIn, tokenOut, amountIn, maxHops);
        if (path && path.amountOut > bestPath.amountOut) {
            bestPath = path;
        }
    }
    
    return bestPath.amountOut > 0n ? bestPath : null;
}

// --- V3 Specific Pathfinding ---
async function findBestPathV3(dex, tokenIn, tokenOut, amountIn, maxHops) {
    const quoter = new ethers.Contract(DEX_QUOTERS.base[dex], IUniswapV3QuoterV2, provider);
    const intermediateTokens = getIntermediateTokens(tokenIn, tokenOut);
    let allPossiblePaths = findV3PathsRecursively([tokenIn], [], tokenOut, dex, 0, maxHops, intermediateTokens);

    const quoteCalls = allPossiblePaths.map(p => quoter.interface.encodeFunctionData('quoteExactInput', [encodeV3Path(p.tokens, p.fees), amountIn]));
    const results = await multicall(provider, quoteCalls.map(c => ({ target: quoter.address, callData: c })));

    let bestPath = { amountOut: 0n };
    for (let i = 0; i < results.length; i++) {
        try {
            const amountOut = ethers.AbiCoder.defaultCoder.decode(['uint256'], results[i])[0];
            if (amountOut > bestPath.amountOut) {
                bestPath = { dex, type: 'V3', tokens: allPossiblePaths[i].tokens, fees: allPossiblePaths[i].fees, amountOut };
            }
        } catch (e) { /* Ignore failed quotes */ }
    }
    return bestPath.amountOut > 0n ? bestPath : null;
}

function findV3PathsRecursively(currentTokens, currentFees, target, dex, hops, maxHops, intermediates) {
    let paths = [];
    const last = currentTokens[currentTokens.length - 1];

    V3_FEE_TIERS[dex].forEach(fee => paths.push({ tokens: [...currentTokens, target], fees: [...currentFees, fee] }));

    if (hops < maxHops) {
        intermediates.forEach(inter => {
            if (!currentTokens.includes(inter)) {
                V3_FEE_TIERS[dex].forEach(fee => {
                    paths.push(...findV3PathsRecursively([...currentTokens, inter], [...currentFees, fee], target, dex, hops + 1, maxHops, intermediates));
                });
            }
        });
    }
    return paths;
}

// --- V2 Specific Pathfinding (for Aerodrome) ---
async function findBestPathV2(dex, tokenIn, tokenOut, amountIn, maxHops) {
    const router = new ethers.Contract(DEX_ROUTERS.base[dex], IUniswapV2Router02, provider);
    const intermediateTokens = getIntermediateTokens(tokenIn, tokenOut);
    let allPaths = findV2PathsRecursively([tokenIn], tokenOut, 0, maxHops, intermediateTokens);
    
    try {
        const amountsOut = await Promise.all(allPaths.map(path => router.getAmountsOut(amountIn, path).catch(() => [0n])));
        let bestPath = { amountOut: 0n };
        for (let i = 0; i < amountsOut.length; i++) {
            const amountOut = amountsOut[i][amountsOut[i].length - 1];
            if (amountOut > bestPath.amountOut) {
                bestPath = { dex, type: 'V2', tokens: allPaths[i], amountOut };
            }
        }
        return bestPath.amountOut > 0n ? bestPath : null;
    } catch (e) {
        return null;
    }
}

function findV2PathsRecursively(currentPath, target, hops, maxHops, intermediates) {
    let paths = [[...currentPath, target]];
    if (hops < maxHops) {
        intermediates.forEach(inter => {
            if (!currentPath.includes(inter)) {
                paths.push(...findV2PathsRecursively([...currentPath, inter], target, hops + 1, maxHops, intermediates));
            }
        });
    }
    return paths;
}

function getIntermediateTokens(tokenIn, tokenOut) {
    return [TOKENS.base.WETH, TOKENS.base.USDC, TOKENS.base.DAI].filter(
        t => t.toLowerCase() !== tokenIn.toLowerCase() && t.toLowerCase() !== tokenOut.toLowerCase()
    );
}

// --- Common Functions ---
async function calculateDynamicProfit(trade) {
    const gasPrice = await getDynamicGasPrice();
    const gasCost = BigInt(BOT_CONFIG.GAS_LIMIT) * gasPrice;
    return trade.amountOut - trade.amountIn - gasCost;
}

async function getDynamicGasPrice() {
    const feeData = await provider.getFeeData();
    return BOT_CONFIG.GAS_PRICE_STRATEGY === 'fast' ? feeData.gasPrice * 12n / 10n : feeData.gasPrice;
}

module.exports = {
    calculateDynamicProfit,
    getDynamicGasPrice,
    findBestPath,
    encodeV3Path
};
