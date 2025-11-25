const path = require('path');
const { ethers, formatUnits, getAddress, AbiCoder } = require('ethers');
const { NETWORKS, TOKENS, TOKEN_DECIMALS, ARBITRAGE_PAIRS, LOAN_TOKENS, LOAN_AMOUNTS, DEX_TYPES, BOT_CONFIG, DEX_ROUTERS } = require('./config');
const { findBestPath, getDynamicGasPrice } = require('./services');

const AaveArbitrageV3Json = require(path.join(__dirname, '../out/AaveArbitrageV3.sol/AaveArbitrageV3.json'));
const IArbitrageABI = AaveArbitrageV3Json.abi;

// --- Globals ---
const activeNetwork = 'base';
const provider = new ethers.AlchemyProvider(activeNetwork, process.env.ALCHEMY_API_KEY);

// --- Wallet Initialization ---
if (!process.env.PRIVATE_KEY) {
    console.error('!!! FATAL: A private key was not provided in the environment variables. The bot cannot operate without a wallet. !!!');
    process.exit(1);
}

let wallet;
try {
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
} catch (error) {
    console.error('!!! CRITICAL ERROR: Failed to initialize the wallet. The provided private key is likely invalid. !!!');
    console.error('Error details:', error.message);
    process.exit(1); // Exit immediately if the wallet cannot be created.
}

console.log(`Successfully initialized wallet. Address: ${wallet.address}`);

const arbitrageContract = new ethers.Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, IArbitrageABI, wallet);

// --- IPC Broadcasting: Send structured messages to the parent process (server.js) ---
function broadcast(type, data) {
    if (process.send) {
        process.send({ type, data });
    }
}

// --- Structured Logging via IPC ---
function log(logLevel, event, message, payload = {}) {
    console.log(`[${logLevel}] ${event}: ${message}`, payload);
    broadcast('bot-update', { logLevel, event, message, payload, timestamp: new Date().toISOString() });
}

// --- Main Arbitrage Logic ---
async function findAndExecuteArbitrage(pair, loanAmount) {
    const [loanTokenAddress, targetTokenAddress] = pair;
    const loanTokenSymbol = Object.keys(LOAN_TOKENS).find(key => getAddress(TOKENS.base[key]) === getAddress(loanTokenAddress));

    const path1 = await findBestPath(loanTokenAddress, targetTokenAddress, loanAmount, provider);
    if (!path1) return { status: 'NO_PATH' };

    const path2 = await findBestPath(targetTokenAddress, loanTokenAddress, path1.amountOut, provider);
    if (!path2) return { status: 'NO_PATH' };

    const amountOutMin1 = path1.amountOut * BigInt(Math.round((1 - BOT_CONFIG.SLIPPAGE_TOLERANCE) * 10000)) / 10000n;
    const amountOutMin2 = path2.amountOut * BigInt(Math.round((1 - BOT_CONFIG.SLIPPAGE_TOLERANCE) * 10000)) / 10000n;
    const netProfit = amountOutMin2 - loanAmount;
    const minProfitThreshold = ethers.parseUnits(BOT_CONFIG.MIN_PROFIT_THRESHOLD_ETH, TOKEN_DECIMALS.base[loanTokenSymbol]);

    if (netProfit <= minProfitThreshold) {
        return { status: 'PROFIT_TOO_LOW' };
    }
    
    const opportunityPayload = {
        loanToken: loanTokenSymbol,
        loanAmount: formatUnits(loanAmount, TOKEN_DECIMALS.base[loanTokenSymbol]),
        path: `${path1.dex} -> ${path2.dex}`,
        estimatedProfit: formatUnits(netProfit, TOKEN_DECIMALS.base[loanTokenSymbol]),
    };

    log('OPPORTUNITY', 'OPPORTUNITY_FOUND', `Profitable opportunity detected. Est. Profit: ${opportunityPayload.estimatedProfit} ${opportunityPayload.loanToken}`, opportunityPayload);

    const getDexParams = (path, amountOutMin) => {
        const dexType = DEX_TYPES[path.dex];
        const defaultAbiCoder = new AbiCoder();
        return (dexType === 1 || dexType === 2)
            ? defaultAbiCoder.encode(['bytes', 'uint256'], [path.path, amountOutMin])
            : defaultAbiCoder.encode(['uint256'], [amountOutMin]);
    };

    const swaps = [
        { router: DEX_ROUTERS.base[path1.dex].router, from: loanTokenAddress, to: targetTokenAddress, dex: DEX_TYPES[path1.dex], dexParams: getDexParams(path1, amountOutMin1) },
        { router: DEX_ROUTERS.base[path2.dex].router, from: targetTokenAddress, to: loanTokenAddress, dex: DEX_TYPES[path2.dex], dexParams: getDexParams(path2, amountOutMin2) }
    ];

    if (BOT_CONFIG.DRY_RUN) {
        log('INFO', 'DRY_RUN_EXECUTION', 'Dry run enabled. No transaction will be sent.', opportunityPayload);
        return { status: 'DRY_RUN' };
    }

    try {
        log('INFO', 'TRADE_ATTEMPT', 'Attempting to execute profitable trade.', opportunityPayload);
        const gasPrice = await getDynamicGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);
        const estimatedGas = await arbitrageContract.estimateGas.executeArbitrage(loanTokenAddress, loanAmount, swaps);
        const gasLimit = BigInt(Math.round(Number(estimatedGas) * 1.2)); // 20% buffer
        
        const tx = await arbitrageContract.executeArbitrage(loanTokenAddress, loanAmount, swaps, { gasPrice, gasLimit });
        log('INFO', 'TX_SENT', `Transaction submitted with hash: ${tx.hash}`, { txHash: tx.hash });

        const receipt = await tx.wait();
        const successPayload = { ...opportunityPayload, txHash: receipt.transactionHash, gasUsed: receipt.gasUsed.toString() };
        log('SUCCESS', 'TRADE_SUCCESS', `Trade successfully executed! Profit: ${opportunityPayload.estimatedProfit} ${opportunityPayload.loanToken}`, successPayload);

        return { status: 'SUCCESS', data: successPayload };

    } catch (error) {
        const errorReason = error.reason || error.message || 'An unknown error occurred during trade execution.';
        const failurePayload = { ...opportunityPayload, error: errorReason };
        log('ERROR', 'TRADE_FAILED', `Trade execution failed: ${errorReason}`, failurePayload);

        return { status: 'FAILURE', data: errorReason };
    }
}

// --- Main Bot Loop ---
async function run() {
    log('INFO', 'BOT_STARTED', 'Arbitrage bot is running and waiting for new blocks.', { walletAddress: wallet.address, network: activeNetwork });

    provider.on('block', async (blockNumber) => {
        log('INFO', 'BLOCK_SCAN', `Scanning block ${blockNumber} for opportunities.`);

        try {
            const searchPromises = ARBITRAGE_PAIRS.flatMap(pair => {
                const [loanTokenAddress] = pair;
                const loanTokenSymbol = Object.keys(LOAN_TOKENS).find(key => getAddress(LOAN_TOKENS[key]) === getAddress(loanTokenAddress));
                const loanAmountsForToken = LOAN_AMOUNTS[loanTokenSymbol] || [];
                return loanAmountsForToken.map(loanAmount => findAndExecuteArbitrage(pair, loanAmount));
            });
            await Promise.all(searchPromises);
        } catch (error) {
            log('ERROR', 'SCAN_ERROR', `An unexpected error occurred during block scan: ${error.message}`, { blockNumber });
        }
    });
}

// --- Graceful Shutdown --- 
function cleanup() {
    log('INFO', 'BOT_STOPPING', 'Bot is shutting down gracefully.');
    if (provider) {
        provider.removeAllListeners('block');
    }
    broadcast('status', { isOnline: false, message: 'Bot has been stopped.' });
}

process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
});
process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
});

// --- Bot Execution ---
run().catch(error => {
    log('ERROR', 'FATAL_ERROR', `A fatal error occurred, and the bot must exit: ${error.message}`, { error: error.stack });
    cleanup();
    process.exit(1);
});
