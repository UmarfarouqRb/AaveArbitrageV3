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
    console.error('!!! FATAL: PRIVATE_KEY environment variable was not received by the bot process!');
    process.exit(1);
}

let wallet;
try {
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
} catch (error) {
    console.error('!!! CRITICAL ERROR: Failed to initialize wallet. The private key is invalid. !!!');
    console.error('Error details:', error.message);
    process.exit(1);
}
console.log(`Wallet Address: ${wallet.address}`);

const arbitrageContract = new ethers.Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, IArbitrageABI, wallet);

// --- IPC Broadcasting ---
function broadcast(message) {
    if (process.send) {
        process.send(message);
    }
}

// --- Main Logic ---
async function findAndExecuteArbitrage(pair, loanAmount) {
    const [loanTokenAddress, targetTokenAddress] = pair;
    const loanTokenSymbol = Object.keys(LOAN_TOKENS).find(key => getAddress(TOKENS.base[key]) === getAddress(loanTokenAddress));

    const path1 = await findBestPath(loanTokenAddress, targetTokenAddress, loanAmount, provider);
    if (!path1) return { status: 'NO_OPPORTUNITY' };

    const path2 = await findBestPath(targetTokenAddress, loanTokenAddress, path1.amountOut, provider);
    if (!path2) return { status: 'NO_OPPORTUNITY' };

    const amountOutMin1 = path1.amountOut * BigInt(Math.round((1 - BOT_CONFIG.SLIPPAGE_TOLERANCE) * 10000)) / 10000n;
    const amountOutMin2 = path2.amountOut * BigInt(Math.round((1 - BOT_CONFIG.SLIPPAGE_TOLERANCE) * 10000)) / 10000n;
    const netProfit = amountOutMin2 - loanAmount;
    const minProfit = ethers.parseUnits(BOT_CONFIG.MIN_PROFIT_THRESHOLD_ETH, TOKEN_DECIMALS.base[loanTokenSymbol]);

    const opportunityPayload = {
        loanToken: loanTokenSymbol,
        loanAmount: formatUnits(loanAmount, TOKEN_DECIMALS.base[loanTokenSymbol]),
        path: `${path1.dex} -> ${path2.dex}`,
        estimatedProfit: formatUnits(netProfit, TOKEN_DECIMALS.base[loanTokenSymbol]),
        minProfitThreshold: formatUnits(minProfit, TOKEN_DECIMALS.base[loanTokenSymbol])
    };

    broadcast({
        type: 'bot-update',
        data: {
            logLevel: 'OPPORTUNITY',
            event: 'OPPORTUNITY_FOUND',
            message: `Opportunity found: ${opportunityPayload.estimatedProfit} ${opportunityPayload.loanToken}`,
            payload: opportunityPayload,
            timestamp: new Date().toISOString()
        }
    });

    if (netProfit <= minProfit) {
        return { status: 'NO_OPPORTUNITY', data: 'Profit too low' };
    }

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
        const dryRunMessage = `DRY RUN: Found profitable opportunity - Est. Profit: ${opportunityPayload.estimatedProfit} ${loanTokenSymbol}`;
        console.log(dryRunMessage);
        broadcast({ type: 'bot-update', data: { logLevel: 'INFO', event: 'DRY_RUN_EXECUTION', message: dryRunMessage, payload: opportunityPayload, timestamp: new Date().toISOString() } });
        return { status: 'DRY_RUN' };
    }

    try {
        const gasPrice = await getDynamicGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);
        const estimatedGas = await arbitrageContract.estimateGas.executeArbitrage(loanTokenAddress, loanAmount, swaps);
        const gasLimit = BigInt(Math.round(Number(estimatedGas) * 1.2));
        const tx = await arbitrageContract.executeArbitrage(loanTokenAddress, loanAmount, swaps, { gasPrice, gasLimit });
        const receipt = await tx.wait();
        
        const successPayload = { ...opportunityPayload, txHash: receipt.transactionHash, gasUsed: receipt.gasUsed.toString() };
        const successMsg = `TRADE SUCCESSFUL! Profit: ${successPayload.estimatedProfit} ${successPayload.loanToken}`;
        console.log(successMsg);

        broadcast({ type: 'bot-update', data: { logLevel: 'SUCCESS', event: 'TRADE_SUCCESS', message: successMsg, payload: successPayload, timestamp: new Date().toISOString() } });
        
        return { status: 'SUCCESS', data: successPayload };
    } catch (error) {
        const errorReason = error.reason || error.message || 'Unknown error';
        const failurePayload = { ...opportunityPayload, errorReason };
        const errorMsg = `TRADE FAILED: ${errorReason}`;
        console.error(errorMsg);
        
        broadcast({ type: 'bot-update', data: { logLevel: 'ERROR', event: 'TRADE_FAILED', message: errorMsg, payload: failurePayload, timestamp: new Date().toISOString() } });

        return { status: 'FAILURE', data: errorReason };
    }
}

async function run() {
    console.log('Arbitrage Bot Starting...');
    broadcast({ type: 'status', data: { isOnline: true } });
    broadcast({ type: 'bot-update', data: { logLevel: 'INFO', event: 'BOT_STARTED', message: 'Bot process started and is waiting for blocks.', payload: { walletAddress: wallet.address, network: activeNetwork }, timestamp: new Date().toISOString() } });

    provider.on('block', async (blockNumber) => {
        const scanMessage = `Scanning Block: ${blockNumber}`;
        console.log(scanMessage);
        // Backward-compatible log
        broadcast({ type: 'log', data: scanMessage }); 
        // New structured log
        broadcast({ 
            type: 'bot-update', 
            data: { 
                logLevel: 'INFO', 
                event: 'BLOCK_SCAN', 
                message: scanMessage, 
                payload: { blockNumber }, 
                timestamp: new Date().toISOString() 
            }
        });

        try {
            const allPromises = ARBITRAGE_PAIRS.flatMap(pair => {
                const [loanTokenAddress] = pair;
                const loanTokenSymbol = Object.keys(LOAN_TOKENS).find(key => getAddress(LOAN_TOKENS[key]) === getAddress(loanTokenAddress));
                const loanAmountsForToken = LOAN_AMOUNTS[loanTokenSymbol] || [];
                return loanAmountsForToken.map(loanAmount => findAndExecuteArbitrage(pair, loanAmount));
            });
            await Promise.all(allPromises);
        } catch (error) {
            const errorMsg = `Error during block scan: ${error.message}`;
            console.error(errorMsg);
            broadcast({ type: 'log', data: errorMsg });
            broadcast({ 
                type: 'bot-update', 
                data: { 
                    logLevel: 'ERROR', 
                    event: 'SCAN_ERROR', 
                    message: errorMsg, 
                    payload: { blockNumber, error: error.message },
                    timestamp: new Date().toISOString() 
                }
            });
        }
    });
}

run().catch(error => {
    const fatalMsg = `A fatal error occurred: ${error.message}`;
    console.error(fatalMsg);
    broadcast({ type: 'status', data: { isOnline: false } });
    broadcast({
        type: 'bot-update',
        data: {
            logLevel: 'ERROR',
            event: 'FATAL_ERROR',
            message: fatalMsg,
            payload: { error: error.message },
            timestamp: new Date().toISOString()
        }
    });
    process.exit(1);
});
