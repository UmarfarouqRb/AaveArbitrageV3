
require('dotenv').config();
const { ethers } = require('ethers');
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');
const { NETWORKS, TOKENS, DEX_ROUTERS, DEX_FACTORIES, DEX_TYPES, BOT_CONFIG } = require('./config');
const { calculateDynamicProfit, getDynamicGasPrice, findBestPath, encodeV3Path } = require('./services');
const AaveArbitrageV3ABI = require('../out/AaveArbitrageV3.sol/AaveArbitrageV3.json').abi;

// --- Pre-flight Checks ---
function checkEnvironment() {
    console.log("Performing environment pre-flight checks...");
    if (!process.env.PRIVATE_KEY) throw new Error("FATAL: PRIVATE_KEY not set.");
    if (!process.env.INFURA_PROJECT_ID) console.warn("WARN: INFURA_PROJECT_ID not set.");
    if (BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS === 'YOUR_HYBRID_CONTRACT_ADDRESS_HERE') {
        throw new Error("FATAL: Please set ARBITRAGE_CONTRACT_ADDRESS in backend/config.js");
    }
    console.log("Environment checks passed.");
}

// --- Main Execution --- 
async function run() {
    try {
        checkEnvironment();

        const provider = new ethers.JsonRpcProvider(NETWORKS.base.rpcUrl);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log(`Wallet initialized for ${wallet.address}`);

        const flashbotsProvider = await FlashbotsBundleProvider.create(provider, wallet);
        console.log("Flashbots provider created.");

        console.log('Hybrid Arbitrage Bot Starting...');
        provider.on('block', async (blockNumber) => {
            console.log(`[BLOCK ${blockNumber}] Scanning for opportunities...`);
            try {
                const opportunities = await findArbitrageOpportunities();
                if (opportunities.length > 0) {
                    console.log(`Found ${opportunities.length} potential opportunities.`)
                    for (const opp of opportunities) {
                        const netProfit = await calculateDynamicProfit(opp);
                        if (netProfit > ethers.parseUnits(BOT_CONFIG.MIN_PROFIT_THRESHOLD, 'ether')) {
                            console.log(`PROFITABLE OPPORTUNITY! Profit: ${ethers.formatEther(netProfit)} ETH`);
                            await executeHybridTrade(opp, flashbotsProvider, blockNumber);
                        }
                    }
                } else {
                    console.log("No opportunities found in this block.");
                }
            } catch (err) {
                console.error(`[ERROR] Block scan failed at block ${blockNumber}:`, err.message);
            }
        });

    } catch (err) {
        console.error("A fatal error occurred:", err.message, err.stack);
        process.exit(1);
    }
}

async function findArbitrageOpportunities() {
    const tokenPairs = getTokenPairs();
    const opportunities = [];
    for (const pair of tokenPairs) {
        const opportunity = await analyzePairHybrid(pair);
        if (opportunity) {
            opportunities.push(opportunity);
        }
    }
    return opportunities;
}

async function analyzePairHybrid(pair) {
    const [tokenA, tokenB] = pair;
    const amountIn = ethers.parseUnits("1", 18); // Standard 1 WETH for comparison

    try {
        const path1 = await findBestPath(tokenA, tokenB, amountIn);
        if (!path1) return null;

        const path2 = await findBestPath(tokenB, tokenA, path1.amountOut);
        if (!path2) return null;

        if (path2.amountOut > amountIn) {
            console.log(`Opportunity: ${tokenA} -> ${tokenB} (${path1.dex}) -> ${tokenA} (${path2.dex})`);
            return { tokenA, tokenB, amountIn, amountOut: path2.amountOut, path1, path2 };
        }
    } catch (error) {
        console.error(`Error analyzing pair ${tokenA}/${tokenB}:`, error.message);
    }
    return null;
}

async function executeHybridTrade(opportunity, flashbotsProvider, blockNumber) {
    console.log(`Executing trade: ${opportunity.tokenA} -> ${opportunity.tokenB} -> ${opportunity.tokenA}`);
    const contract = new ethers.Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, AaveArbitrageV3ABI, wallet);

    const loanToken = opportunity.tokenA;
    const loanAmount = opportunity.amountIn;

    const swap1 = await buildSwap(opportunity.path1, loanAmount);
    const swap2 = await buildSwap(opportunity.path2, 0); // Amount is 0, contract uses its balance

    const gasPrice = await getDynamicGasPrice(provider);
    const tx = await contract.executeArbitrage.populateTransaction(loanToken, loanAmount, [swap1, swap2], { gasPrice, gasLimit: BOT_CONFIG.GAS_LIMIT });

    const bundle = [{ transaction: tx, signer: wallet }];
    try {
        console.log("Simulating Flashbots bundle...");
        const sim = await flashbotsProvider.simulate(bundle, blockNumber + 1);
        if (sim.results && sim.results[0].error) {
            console.error(`[EXECUTION FAILED] Simulation error: ${sim.results[0].error}`);
        } else if (sim.error) {
            console.error(`[EXECUTION FAILED] General simulation error: ${sim.error.message}`);
        } else {
            console.log('[SUCCESS] Trade simulated. Sending bundle...');
            const receipt = await flashbotsProvider.sendRawBundle(bundle, blockNumber + 1);
            const wait = await receipt.wait();
            if (wait === 0) console.log("Transaction included in block.");
            else console.warn("Transaction not included or bundle cancelled.");
        }
    } catch (e) {
        console.error('[CRITICAL] Flashbots submission error:', e.message);
    }
}

async function buildSwap(path, amountIn) {
    const router = DEX_ROUTERS.base[path.dex];
    const dexType = DEX_TYPES[path.dex];
    let dexParams;

    if (path.type === 'V3') {
        const params = {
            path: encodeV3Path(path.tokens, path.fees),
            tokenIn: path.tokens[0],
            amountIn: amountIn,
            amountOutMinimum: 0
        };
        dexParams = ethers.AbiCoder.defaultCoder.encode(['(bytes,address,uint256,uint256)'], [params]);
    } else { // V2 (Aerodrome)
        const params = {
            tokenIn: path.tokens[0],
            tokenOut: path.tokens[path.tokens.length - 1],
            stable: false, // You might need a way to determine this dynamically
            factory: DEX_FACTORIES.base[path.dex]
        };
        dexParams = ethers.AbiCoder.defaultCoder.encode(['(address,address,bool,address)'], [params]);
    }

    return { router, dex: dexType, dexParams };
}

function getTokenPairs() {
    const tokens = Object.values(TOKENS.base);
    return tokens.flatMap((v, i) => tokens.slice(i + 1).map(w => [v, w]));
}

run();
