
require('dotenv').config();
const { Wallet, Contract, parseUnits, formatUnits, AbiCoder } = require('ethers');
const { NETWORKS, TOKENS, DEX_ROUTERS, DEX_FACTORIES, BOT_CONFIG, PRIVATE_KEY, DEX_TYPES, V3_FEE_TIERS } = require('./config');
const { getProvider, getTokenDetails } = require('./utils');
const { findBestPathV3, findBestPathV2, encodeV3Path, getDynamicGasPrice } = require('./services');
const fs = require('fs').promises;
const path = require('path');

// CORRECTED ABI PATH
const ARBITRAGE_ABI = require('../out/AaveArbitrageV3.sol/AaveArbitrageV3.json').abi;
const TRADE_HISTORY_FILE = path.join(__dirname, 'trade_history.json');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function logTrade(logData) {
    try {
        let history = [];
        try {
            const data = await fs.readFile(TRADE_HISTORY_FILE, 'utf8');
            history = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
        const existingIndex = history.findIndex(log => log.txHash === logData.txHash);
        if (existingIndex !== -1) {
            history[existingIndex] = { ...history[existingIndex], ...logData };
        } else {
            history.unshift({ ...logData, timestamp: new Date().toISOString() });
        }
        await fs.writeFile(TRADE_HISTORY_FILE, JSON.stringify(history.slice(0, 100), null, 2));
    } catch (error) {
        console.error("Error writing to trade history file:", error);
    }
}

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

    const allTokenSymbols = Object.keys(tokenList);
    const tokenPairs = [];
    const baseTokens = ['WETH', 'USDC'];

    for (const baseToken of baseTokens) {
        for (const token of allTokenSymbols) {
            if (baseToken === token) continue;
            const pairExists = tokenPairs.some(p => (p[0] === token && p[1] === baseToken));
            if (!pairExists) {
                tokenPairs.push([baseToken, token]);
            }
        }
    }

    console.log(`Scanning ${tokenPairs.length} pairs across ${Object.keys(dexRouters).length} DEXs...`);

    const scan = async () => {
        try {
            await scanForArbitrage(tokenPairs, tokenList, dexRouters, networkName, wallet, provider);
        } catch (error) {
            console.error("An error occurred during the main scan loop:", error);
        }
        setTimeout(scan, BOT_CONFIG.SCAN_INTERVAL || 5000);
    };

    scan();
}

async function scanForArbitrage(tokenPairs, tokenList, dexRouters, networkName, wallet, provider) {
    console.log(`
--- New Scan Started at ${new Date().toLocaleTimeString()} ---`);
    for (const [t1, t2] of tokenPairs) {
        try {
            const tokenA = await getTokenDetails(tokenList[t1], provider);
            const tokenB = await getTokenDetails(tokenList[t2], provider);
            const loanAmount = (tokenA.symbol === 'WETH' || tokenA.symbol === 'ETH')
                ? parseUnits('0.5', tokenA.decimals)
                : parseUnits('500', tokenA.decimals);

            for (const dexName1 in dexRouters) {
                for (const dexName2 in dexRouters) {
                    if (dexName1 === dexName2) continue;

                    console.log(`Checking ${tokenA.symbol}->${tokenB.symbol} | Route: ${dexName1} -> ${dexName2}`);

                    const path1 = V3_FEE_TIERS[dexName1]
                        ? await findBestPathV3(dexName1, tokenA.address, tokenB.address, loanAmount)
                        : await findBestPathV2(dexName1, tokenA.address, tokenB.address, loanAmount);

                    if (!path1 || path1.amountOut === 0n) continue;

                    const expectedAmountOut1 = path1.amountOut;
                    
                    const path2 = V3_FEE_TIERS[dexName2]
                        ? await findBestPathV3(dexName2, tokenB.address, tokenA.address, expectedAmountOut1)
                        : await findBestPathV2(dexName2, tokenB.address, tokenA.address, expectedAmountOut1);

                    if (!path2 || path2.amountOut === 0n) continue;

                    const finalAmountOut = path2.amountOut;
                    const netProfit = finalAmountOut - loanAmount;

                    if (netProfit > 0n) {
                        const gasCostInToken = await convertGasCostToToken(tokenA, provider, networkName);
                        
                        console.log(`
--- Potential Opportunity Found! ---`);
                        console.log(`  Pair: ${tokenA.symbol}/${tokenB.symbol}`);
                        console.log(`  Route: ${dexName1} -> ${dexName2}`);
                        console.log(`  Loan: ${formatUnits(loanAmount, tokenA.decimals)} ${tokenA.symbol}`);
                        console.log(`  Return: ${formatUnits(finalAmountOut, tokenA.decimals)} ${tokenA.symbol}`);
                        console.log(`  Gross Profit: ${formatUnits(netProfit, tokenA.decimals)} ${tokenA.symbol}`);
                        console.log(`  Est. Gas Cost: ${formatUnits(gasCostInToken, tokenA.decimals)} ${tokenA.symbol}`);

                        if (netProfit > gasCostInToken) {
                            console.log(`  ✅ PROFITABLE! Executing trade...`);
                            await executeArbitrage(wallet, {
                                tokenA, tokenB, loanAmount, path1, path2,
                                netProfit, gasCostInToken, networkName
                            });
                        } else {
                            console.log(`  ❌ NOT PROFITABLE after gas. Skipping.`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing pair ${t1}/${t2}: ${error.message}`);
        }
    }
}

async function convertGasCostToToken(tokenA, provider, networkName) {
    const gasPrice = await getDynamicGasPrice();
    const estimatedGasCost = BigInt(BOT_CONFIG.GAS_LIMIT) * gasPrice;
    const wethAddress = TOKENS[networkName].WETH;

    if (tokenA.address.toLowerCase() === wethAddress.toLowerCase()) {
        return estimatedGasCost;
    }

    const path = await findBestPathV3('UniswapV3', wethAddress, tokenA.address, parseUnits('1', 18));
    if (!path || path.amountOut === 0n) return parseUnits('1000', 18); // High dummy value

    const priceOfWethInTokenA = path.amountOut;
    return (estimatedGasCost * priceOfWethInTokenA) / parseUnits('1', 18);
}

async function executeArbitrage(wallet, trade) {
    console.log(`
--- EXECUTING ARBITRAGE ---`);
    const { tokenA, loanAmount, path1, path2, netProfit, gasCostInToken, networkName } = trade;
    const explorerUrl = NETWORKS[networkName].explorerUrl;
    const arbitrageContract = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, ARBITRAGE_ABI, wallet);
    const abiCoder = AbiCoder.default;

    let logData = { txHash: '', pair: `${path1.tokens[0]}/${path1.tokens[path1.tokens.length - 1]}`, route: `${path1.dex} -> ${path2.dex}`, profit: 'Calculating...' };

    try {
        // Build Swap 1
        const amountOutMin1 = (path1.amountOut * (10000n - BigInt(BOT_CONFIG.SLIPPAGE_TOLERANCE))) / 10000n;
        const dexParams1 = path1.type === 'V2'
            ? abiCoder.encode(["bool", "address", "uint256"], [false, DEX_FACTORIES.base[path1.dex], amountOutMin1])
            : abiCoder.encode(["bytes", "uint256"], [encodeV3Path(path1.tokens, path1.fees), amountOutMin1]);

        const swap1 = {
            router: DEX_ROUTERS.base[path1.dex],
            from: path1.tokens[0],
            to: path1.tokens[path1.tokens.length - 1],
            dex: DEX_TYPES[path1.dex],
            dexParams: dexParams1
        };

        // Build Swap 2
        const amountOutMin2 = (path2.amountOut * (10000n - BigInt(BOT_CONFIG.SLIPPAGE_TOLERANCE))) / 10000n;
        const dexParams2 = path2.type === 'V2'
            ? abiCoder.encode(["bool", "address", "uint256"], [false, DEX_FACTORIES.base[path2.dex], amountOutMin2])
            : abiCoder.encode(["bytes", "uint256"], [encodeV3Path(path2.tokens, path2.fees), amountOutMin2]);

        const swap2 = {
            router: DEX_ROUTERS.base[path2.dex],
            from: path2.tokens[0],
            to: path2.tokens[path2.tokens.length - 1],
            dex: DEX_TYPES[path2.dex],
            dexParams: dexParams2
        };

        const swaps = [swap1, swap2];
        const gasPrice = await getDynamicGasPrice();
        
        // Final check before sending
        if (netProfit < gasCostInToken) {
            console.log("Final check failed: Profit too low. Aborting.");
            return;
        }

        const tx = await arbitrageContract.executeArbitrage(tokenA.address, loanAmount, swaps, {
            gasLimit: BOT_CONFIG.GAS_LIMIT,
            gasPrice: gasPrice
        });

        console.log(`  > Transaction Sent! Hash: ${tx.hash}`);
        console.log(`  > View on Explorer: ${explorerUrl}/tx/${tx.hash}`);
        logData.txHash = tx.hash;
        logData.status = 'Pending';
        await logTrade(logData);

        const receipt = await tx.wait();
        const finalProfit = formatUnits(netProfit - gasCostInToken, tokenA.decimals);

        if (receipt.status === 1) {
            console.log(`  > ✅ SUCCESS! Transaction confirmed in block ${receipt.blockNumber}`);
            await logTrade({ ...logData, status: 'Success', profit: `${finalProfit} ${tokenA.symbol}` });
        } else {
            console.error(`  > ❌ FAILED! Transaction reverted.`);
            await logTrade({ ...logData, status: 'Failed', profit: '0', error: 'Transaction reverted on-chain' });
        }
    } catch (error) {
        console.error(`  > ❌ EXECUTION FAILED:`, error.reason || error.message);
        await logTrade({ ...logData, status: 'Failed', profit: '0', error: error.reason || error.message });
    }
    console.log(`--- EXECUTION FINISHED ---`);
}

module.exports = { runBot };
