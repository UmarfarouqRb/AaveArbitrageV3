
const path = require('path');
const { ethers, formatUnits, getAddress, AbiCoder } = require('ethers');
const { NETWORKS, TOKENS, TOKEN_DECIMALS, ARBITRAGE_PAIRS, LOAN_AMOUNTS, DEX_TYPES, BOT_CONFIG, DEX_ROUTERS } = require('./config');
const { findBestPath, getDynamicGasPrice } = require('./services');
const WebSocket = require('ws');

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
    const [loanTokenAddress, targetTokenAddress] = pair;
    const loanTokenSymbol = Object.keys(LOAN_AMOUNTS).find(key => getAddress(TOKENS.base[key]) === getAddress(loanTokenAddress));
    const loanAmount = LOAN_AMOUNTS[loanTokenSymbol];

    // 1. Find best path for Loan Token -> Target Token
    const path1 = await findBestPath(loanTokenAddress, targetTokenAddress, loanAmount, provider);
    if (!path1) return { status: 'NO_OPPORTUNITY' };

    // 2. Find best path for Target Token -> Loan Token
    const path2 = await findBestPath(targetTokenAddress, loanTokenAddress, path1.amountOut, provider);
    if (!path2) return { status: 'NO_OPPORTUNITY' };

    // 3. Calculate Profitability
    const netProfit = path2.amountOut - loanAmount; // Simplified calculation
    const minProfit = ethers.parseUnits(BOT_CONFIG.MIN_PROFIT_THRESHOLD_ETH, TOKEN_DECIMALS.base[loanTokenSymbol]);

    const data = `Net profit: ${formatUnits(netProfit, TOKEN_DECIMALS.base[loanTokenSymbol])} ${loanTokenSymbol}`;
    console.log(data);

    if (netProfit <= minProfit) return { status: 'NO_OPPORTUNITY' };

    // 4. Construct Swaps
    const getDexParams = (path, dexConfig) => {
        const dexType = DEX_TYPES[path.dex];
        const defaultAbiCoder = new AbiCoder();

        if (dexType === 1 || dexType === 2) { // V3 DEXs
            return defaultAbiCoder.encode(['bytes', 'uint256'], [path.path, 0]);
        } else if (dexType === 0) { // V2 DEX
            const factory = dexConfig.factory;
            if (!factory) {
                throw new Error(`Factory address for ${path.dex} is not configured.`);
            }
            return defaultAbiCoder.encode(['bool', 'address', 'uint256'], [path.stable, factory, 0]);
        } else {
            return defaultAbiCoder.encode(['uint256'], [0]);
        }
    };

    const dexConfig1 = DEX_ROUTERS.base[path1.dex];
    const dexConfig2 = DEX_ROUTERS.base[path2.dex];

    const swaps = [
        {
            router: dexConfig1.router,
            from: loanTokenAddress,
            to: targetTokenAddress,
            dex: DEX_TYPES[path1.dex],
            dexParams: getDexParams(path1, dexConfig1)
        },
        {
            router: dexConfig2.router,
            from: targetTokenAddress,
            to: loanTokenAddress,
            dex: DEX_TYPES[path2.dex],
            dexParams: getDexParams(path2, dexConfig2)
        }
    ];

    // 5. Execute Arbitrage
    if (BOT_CONFIG.DRY_RUN) {
        console.log(`\nOPPORTUNITY FOUND (DRY RUN):`);
        console.log(`- Loan: ${formatUnits(loanAmount, TOKEN_DECIMALS.base[loanTokenSymbol])} ${loanTokenSymbol}`);
        console.log(`- Path: ${path1.dex} -> ${path2.dex}`);
        console.log(`- Est. Profit: ${formatUnits(netProfit, TOKEN_DECIMALS.base[loanTokenSymbol])} ${loanTokenSymbol}\n`);
        return { status: 'DRY_RUN', data };
    }

    try {
        const gasPrice = await getDynamicGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);
        
        // Estimate gas
        const estimatedGas = await arbitrageContract.executeArbitrage.estimateGas(
            loanTokenAddress,
            loanAmount,
            swaps
        );
        
        // Add a buffer
        const gasLimit = BigInt(Math.round(Number(estimatedGas) * 1.2));

        const tx = await arbitrageContract.executeArbitrage(loanTokenAddress, loanAmount, swaps, { gasPrice, gasLimit });
        const receipt = await tx.wait();
        console.log(`\nTRADE SUCCESSFUL:`);
        console.log(`- Tx Hash: ${receipt.transactionHash}`);
        console.log(`- Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`- Profit: ${formatUnits(netProfit, TOKEN_DECIMALS.base[loanTokenSymbol])} ${loanTokenSymbol}\n`);
        return { status: 'SUCCESS', data };
    } catch (error) {
        console.error(`\nTRADE FAILED:`, error.reason || error);
        return { status: 'FAILURE', data: error.reason || 'Unknown error' };
    }
}

async function run() {
    console.log('Arbitrage Bot Starting...');
    console.log(`Watching for new blocks on ${activeNetwork}...\n`);

    broadcast({ type: 'status', data: { isOnline: true } });

    provider.on('block', async (blockNumber) => {
        process.stdout.write(`Scanning Block: ${blockNumber} \r`);
        broadcast({ type: 'log', data: `Scanning Block: ${blockNumber}` });

        try {
            await Promise.all(ARBITRAGE_PAIRS.map(pair => findAndExecuteArbitrage(pair)));
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
