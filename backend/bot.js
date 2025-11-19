require('dotenv').config();
const path = require('path');
const { ethers, formatUnits, getAddress } = require('ethers');
const { NETWORKS, TOKENS, TOKEN_DECIMALS, ARBITRAGE_PAIRS, LOAN_AMOUNTS, DEX_TYPES, BOT_CONFIG } = require('./config');
const { findBestPath, getDynamicGasPrice } = require('./services');
const WebSocket = require('ws');

const AaveArbitrageV3Json = require(path.join(__dirname, '../out/AaveArbitrageV3.sol/AaveArbitrageV3.json'));
const IArbitrageABI = AaveArbitrageV3Json.abi;

// --- Globals ---
const activeNetwork = 'base'; 
const provider = new ethers.AlchemyProvider(activeNetwork, process.env.ALCHEMY_API_KEY);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const arbitrageContract = new ethers.Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, IArbitrageABI, wallet);
const wss = new WebSocket.Server({ port: 8080 });

// --- WebSocket Broadcasting ---
wss.on('connection', ws => {
    ws.send(JSON.stringify({ type: 'status', data: { isOnline: true } }));
});

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

// --- Main Logic ---

async function findAndExecuteArbitrage(pair) {
    // ... (rest of the function remains the same)
}

async function calculateNetProfit(loanAmount, finalAmount, loanTokenAddress) {
    // ... (rest of the function remains the same)
}

// --- Block Listener ---
let scanResults = [];

async function run() {
    console.log('Arbitrage Bot Starting...');
    console.log(`Wallet Address: ${wallet.address}`);
    console.log(`Watching for new blocks on ${activeNetwork}...\n`);

    broadcast({ type: 'status', data: { isOnline: true } });

    provider.on('block', async (blockNumber) => {
        process.stdout.write(`Scanning Block: ${blockNumber} \r`);
        broadcast({ type: 'log', data: `Scanning Block: ${blockNumber}` });

        try {
            const results = await Promise.all(ARBITRAGE_PAIRS.map(pair => findAndExecuteArbitrage(pair)));
            scanResults.push({ block: blockNumber, results: results });

            if (blockNumber % 5 === 0 && blockNumber > 0) {
                let opportunities = 0;
                let successfulTrades = 0;
                let failedTrades = 0;
                let dryRuns = 0;

                scanResults.forEach(scan => {
                    scan.results.forEach(result => {
                        if (!result) return;
                        switch(result.status) {
                            case 'DRY_RUN':
                                dryRuns++;
                                opportunities++;
                                broadcast({ type: 'log', data: `OPPORTUNITY FOUND (DRY RUN): ${result.data}` });
                                break;
                            case 'SUCCESS':
                                successfulTrades++;
                                opportunities++;
                                broadcast({ type: 'trade', data: result.data });
                                break;
                            case 'FAILURE':
                                failedTrades++;
                                opportunities++;
                                broadcast({ type: 'log', data: `TRADE FAILED: ${result.data}` });
                                break;
                            case 'NO_OPPORTUNITY':
                            default:
                                break;
                        }
                    });
                });

                process.stdout.write('\r' + ' '.repeat(process.stdout.columns) + '\r');

                const summary = `--- Block Scan Summary (Blocks ${scanResults[0].block} to ${blockNumber}) ---\n- Opportunities Found: ${opportunities}\n- Successful Trades: ${successfulTrades}\n- Failed Trades: ${failedTrades}`;
                console.log(summary);
                broadcast({ type: 'log', data: summary });

                scanResults = [];
            }

        } catch (error) {
            console.error(`\nError during block scan:`, error);
            broadcast({ type: 'log', data: `Error during block scan: ${error.message}` });
        }
    });
}

run().catch(error => {
    console.error(error);
    broadcast({ type: 'status', data: { isOnline: false } });
    process.exit(1);
});
