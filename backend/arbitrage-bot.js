
require('dotenv').config();
const { Wallet, Contract, parseUnits, formatUnits, AbiCoder } = require('ethers');
const { NETWORKS, TOKENS, DEX_ROUTERS, DEX_FACTORIES, BOT_CONFIG, PRIVATE_KEY, DEX_TYPES, V3_FEE_TIERS } = require('./config');
const { getProvider, getTokenDetails } = require('./utils');
const { findBestPathV3, findBestPathV2, getOptimalLoanAmount, encodeV3Path, getDynamicGasPrice } = require('./services');
const fs = require('fs').promises;
const path = require('path');

const ARBITRAGE_ABI = require('../out/AaveArbitrageV3.sol/AaveArbitrageV3.json').abi;
const TRADE_HISTORY_FILE = path.join(__dirname, 'trade_history.json');

// --- Main Bot Logic ---

async function runBot(networkName) {
    if (!NETWORKS[networkName]) {
        console.error(`Unsupported network: ${networkName}.`);
        return;
    }

    console.log(`Initializing arbitrage bot for ${networkName}...`);
    const provider = getProvider(networkName, NETWORKS);
    const wallet = new Wallet(PRIVATE_KEY, provider);
    const tokenList = TOKENS[networkName];
    const dexRouters = DEX_ROUTERS[networkName];

    console.log(`Bot started on ${networkName}. Wallet: ${wallet.address}`);
    console.log(`Monitoring for opportunities. Contract: ${BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS}`);

    const tokenPairs = generateTokenPairs(Object.keys(tokenList));
    console.log(`Scanning ${tokenPairs.length} pairs across ${Object.keys(dexRouters).length} DEXs...`);

    const scan = async () => {
        try {
            await scanForArbitrage(tokenPairs, tokenList, dexRouters, networkName, wallet, provider);
        } catch (error) {
            console.error("An error occurred during the main scan loop:", error);
        }
        setTimeout(scan, BOT_CONFIG.SCAN_INTERVAL || 5000); // Reschedule the next scan
    };

    scan();
}

function generateTokenPairs(tokenSymbols) {
    const pairs = [];
    for (let i = 0; i < tokenSymbols.length; i++) {
        for (let j = i + 1; j < tokenSymbols.length; j++) {
            pairs.push([tokenSymbols[i], tokenSymbols[j]]);
        }
    }
    return pairs;
}

async function scanForArbitrage(tokenPairs, tokenList, dexRouters, networkName, wallet, provider) {
    console.log(`
--- New Scan Started at ${new Date().toLocaleTimeString()} ---`);
    for (const [t1, t2] of tokenPairs) {
        for (const dexName1 in dexRouters) {
            for (const dexName2 in dexRouters) {
                if (dexName1 === dexName2) continue;

                try {
                    const tokenA = await getTokenDetails(tokenList[t1], provider);
                    const tokenB = await getTokenDetails(tokenList[t2], provider);

                    await checkAndExecuteArbitrage(tokenA, tokenB, dexName1, dexName2, networkName, wallet, provider);
                
                } catch (error) {
                    console.error(`Error processing pair ${t1}/${t2} on ${dexName1}/${dexName2}: ${error.message}`);
                }
            }
        }
    }
}

async function checkAndExecuteArbitrage(tokenA, tokenB, dexName1, dexName2, networkName, wallet, provider) {
    console.log(`Checking ${tokenA.symbol}->${tokenB.symbol} | Route: ${dexName1} -> ${dexName2}`);

    // 1. Find Optimal Loan Amount
    const loanAmount = await getOptimalLoanAmount(tokenA.address, tokenB.address, dexName1, dexName2, provider);
    if (loanAmount <= 0n) {
        // console.log("No profitable opportunity found for this path.");
        return;
    }

    // 2. Find Path 1
    const path1 = V3_FEE_TIERS[dexName1]
        ? await findBestPathV3(dexName1, tokenA.address, tokenB.address, loanAmount, provider)
        : await findBestPathV2(dexName1, tokenA.address, tokenB.address, loanAmount, provider);
    if (!path1 || path1.amountOut === 0n) return;

    // 3. Find Path 2
    const path2 = V3_FEE_TIERS[dexName2]
        ? await findBestPathV3(dexName2, tokenB.address, tokenA.address, path1.amountOut, provider)
        : await findBestPathV2(dexName2, tokenB.address, tokenA.address, path1.amountOut, provider);
    if (!path2 || path2.amountOut === 0n) return;

    // 4. Calculate Profitability
    const { netProfit, isProfitable, gasCostInToken } = await checkProfitability(loanAmount, path2.amountOut, tokenA, provider, networkName);

    logOpportunity(tokenA, tokenB, dexName1, dexName2, loanAmount, path2.amountOut, netProfit, gasCostInToken);

    // 5. Execute Trade
    if (isProfitable) {
        console.log(`  PROFITABLE! Executing trade...`);
        await executeArbitrage(wallet, { 
            tokenA, loanAmount, path1, path2, 
            netProfit, gasCostInToken, networkName 
        });
    } else {
        console.log(`  NOT PROFITABLE after gas. Skipping.`);
    }
}


async function checkProfitability(loanAmount, finalAmountOut, tokenA, provider, networkName) {
    const netProfit = finalAmountOut - loanAmount;
    if (netProfit <= 0n) {
        return { netProfit, isProfitable: false, gasCostInToken: 0n };
    }

    const gasCostInToken = await convertGasCostToToken(tokenA, provider, networkName);
    const isProfitable = netProfit > gasCostInToken;
    
    return { netProfit, isProfitable, gasCostInToken };
}

// --- Transaction Execution ---

async function executeArbitrage(wallet, trade) {
    console.log(`
--- EXECUTING ARBITRAGE ---`);
    const { tokenA, loanAmount, path1, path2, netProfit, gasCostInToken, networkName } = trade;
    const arbitrageContract = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, ARBITRAGE_ABI, wallet);
    const abiCoder = AbiCoder.default;

    let logData = { txHash: '', pair: `${tokenA.symbol}/${path1.tokens[path1.tokens.length - 1]}`, route: `${path1.dex} -> ${path2.dex}`, profit: 'Calculating...' };

    try {
        const swap1 = buildSwap(path1, BOT_CONFIG.SLIPPAGE_TOLERANCE, abiCoder);
        const swap2 = buildSwap(path2, BOT_CONFIG.SLIPPAGE_TOLERANCE, abiCoder);

        const tx = await arbitrageContract.executeArbitrage(tokenA.address, loanAmount, [swap1, swap2], {
            gasLimit: BOT_CONFIG.GAS_LIMIT,
            gasPrice: await getDynamicGasPrice(BOT_CONFIG.GAS_PRICE_STRATEGY)
        });

        logData.txHash = tx.hash;
        console.log(`  > Transaction Sent! Hash: ${tx.hash}`);
        console.log(`  > View on Explorer: ${NETWORKS[networkName].explorerUrl}/tx/${tx.hash}`);
        await logTrade({ ...logData, status: 'Pending' });

        const receipt = await tx.wait();
        const finalProfit = formatUnits(netProfit - gasCostInToken, tokenA.decimals);

        if (receipt.status === 1) {
            console.log(`  > ✅ SUCCESS! Confirmed in block ${receipt.blockNumber}`);
            await logTrade({ ...logData, status: 'Success', profit: `${finalProfit} ${tokenA.symbol}` });
        } else {
            console.error(`  > ❌ FAILED! Transaction reverted.`);
            await logTrade({ ...logData, status: 'Failed', profit: '0', error: 'Transaction reverted' });
        }
    } catch (error) {
        console.error(`  > ❌ EXECUTION FAILED:`, error.reason || error.message);
        await logTrade({ ...logData, status: 'Failed', profit: '0', error: error.reason || error.message });
    }
    console.log(`--- EXECUTION FINISHED ---`);
}

function buildSwap(path, slippageTolerance, abiCoder) {
    const amountOutMin = (path.amountOut * (10000n - BigInt(slippageTolerance))) / 10000n;
    const dexParams = path.type === 'V2'
        ? abiCoder.encode(["bool", "address", "uint256"], [false, DEX_FACTORIES.base[path.dex], amountOutMin])
        : abiCoder.encode(["bytes", "uint256"], [encodeV3Path(path.tokens, path.fees), amountOutMin]);

    return {
        router: DEX_ROUTERS.base[path.dex],
        from: path.tokens[0],
        to: path.tokens[path.tokens.length - 1],
        dex: DEX_TYPES[path.dex],
        dexParams: dexParams
    };
}

// --- Logging & Helpers ---

function logOpportunity(tokenA, tokenB, dexName1, dexName2, loanAmount, finalAmountOut, netProfit, gasCostInToken) {
    if (netProfit <= 0n) return; // Don't log non-opportunities

    console.log(`
--- Potential Opportunity Found! ---`);
    console.log(`  Pair: ${tokenA.symbol}/${tokenB.symbol}`);
    console.log(`  Route: ${dexName1} -> ${dexName2}`);
    console.log(`  Loan: ${formatUnits(loanAmount, tokenA.decimals)} ${tokenA.symbol}`);
    console.log(`  Return: ${formatUnits(finalAmountOut, tokenA.decimals)} ${tokenA.symbol}`);
    console.log(`  Gross Profit: ${formatUnits(netProfit, tokenA.decimals)} ${tokenA.symbol}`);
    console.log(`  Est. Gas Cost: ${formatUnits(gasCostInToken, tokenA.decimals)} ${tokenA.symbol}`);
}

async function convertGasCostToToken(tokenA, provider, networkName) {
    const gasPrice = await getDynamicGasPrice();
    const estimatedGasCost = BigInt(BOT_CONFIG.GAS_LIMIT) * gasPrice;
    const wethAddress = TOKENS[networkName].WETH;

    if (tokenA.address.toLowerCase() === wethAddress.toLowerCase()) {
        return estimatedGasCost;
    }

    // Find price of WETH in terms of tokenA to estimate gas cost
    const path = await findBestPathV3('UniswapV3', wethAddress, tokenA.address, parseUnits('1', 18), provider);
    if (!path || path.amountOut === 0n) {
        console.warn(`Could not find price of gas in ${tokenA.symbol}. Using high fallback.`);
        return parseUnits('1000000', tokenA.decimals); // High dummy value
    }

    const priceOfWethInTokenA = path.amountOut;
    return (estimatedGasCost * priceOfWethInTokenA) / parseUnits('1', 18);
}

async function logTrade(logData) {
    try {
        let history = [];
        try {
            const data = await fs.readFile(TRADE_HISTORY_FILE, 'utf8');
            history = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error; // If file doesn't exist, we'll create it
        }

        const existingIndex = logData.txHash ? history.findIndex(log => log.txHash === logData.txHash) : -1;

        if (existingIndex !== -1) {
            // Update existing log entry
            history[existingIndex] = { ...history[existingIndex], ...logData };
        } else {
            // Add new log entry to the top
            history.unshift({ ...logData, timestamp: new Date().toISOString() });
        }

        // Keep trade history to a manageable size
        await fs.writeFile(TRADE_HISTORY_FILE, JSON.stringify(history.slice(0, 100), null, 2));
    } catch (error) {
        console.error("Error writing to trade history file:", error);
    }
}

module.exports = { runBot };
