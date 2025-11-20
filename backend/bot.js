require('dotenv').config();
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
    const netProfit = await calculateNetProfit(loanAmount, path2.amountOut, loanTokenAddress);
    const minProfit = ethers.parseEther(BOT_CONFIG.MIN_PROFIT_THRESHOLD_ETH);

    const data = `Net profit: ${formatUnits(netProfit, TOKEN_DECIMALS.base[loanTokenSymbol])} ${loanTokenSymbol}`;
    console.log(data);

    if (netProfit <= minProfit) return { status: 'NO_OPPORTUNITY' };
    
    // 4. Construct Swaps
    const defaultAbiCoder = new AbiCoder();
    const swaps = [
        {
            router: DEX_ROUTERS.base[path1.dex],
            from: loanTokenAddress,
            to: targetTokenAddress,
            dex: DEX_TYPES[path1.dex],
            dexParams: path1.type === 'V3' ? defaultAbiCoder.encode(['bytes', 'uint256'], [path1.path, 0]) : defaultAbiCoder.encode(['uint256'], [0])
        },
        {
            router: DEX_ROUTERS.base[path2.dex],
            from: targetTokenAddress,
            to: loanTokenAddress,
            dex: DEX_TYPES[path2.dex],
            dexParams: path2.type === 'V3' ? defaultAbiCoder.encode(['bytes', 'uint256'], [path2.path, 0]) : defaultAbiCoder.encode(['uint256'], [0])
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
        const tx = await arbitrageContract.executeArbitrage(loanTokenAddress, loanAmount, swaps, { gasPrice });
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
    console.log(`Wallet Address: ${wallet.address}`);
    console.log(`Watching for new blocks on ${activeNetwork}...\n`);

    broadcast({ type: 'status', data: { isOnline: true } });

    provider.on('block', async (blockNumber) => {
        process.stdout.write(`Scanning Block: ${blockNumber} \r`);
        broadcast({ type: 'log', data: `Scanning Block: ${blockNumber}` });

        try {
            const results = await Promise.all(ARBITRAGE_PAIRS.map(pair => findAndExecuteArbitrage(pair)));
            // ... (rest of the run function)
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
