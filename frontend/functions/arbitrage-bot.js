
const { Wallet, JsonRpcProvider, Contract, AbiCoder, isAddress, parseUnits, formatUnits } = require('ethers');

// --- CONFIGURATION ---

// HARDCODED SETTINGS
const ARBITRAGE_BOT_ADDRESS = '0x7Af71A0700380Ffb51c1fB15c2cf71e6551630B2'; // <-- IMPORTANT: REPLACE WITH YOUR CONTRACT ADDRESS
const PROFIT_THRESHOLD = '0.01'; // Minimum profit in token units (e.g., 0.01 WETH)


// ABI for the ArbitrageBalancer contract
const ARBITRAGE_BALANCER_ABI = ["constructor(address _vault, address _multiSig)","event FlashLoanExecuted(address indexed token, uint256 loanAmount, int256 netProfit)","event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)","event Paused(address account)","event ProfitWithdrawal(address indexed token, uint256 amount)","event RouterAdded(address indexed router)","event RouterRemoved(address indexed router)","event Unpaused(address account)","function addRouter(address router) external","function multiSig() external view returns (address)","function pause() external","function paused() external view returns (bool)","function receiveFlashLoan(address[] calldata tokens, uint256[] calldata amounts, uint256[] calldata feeAmounts, bytes calldata userData) external","function removeRouter(address router) external","function startFlashloan(address token, uint256 amount, bytes calldata userData) external","function transferOwnership(address newMultiSig) external","function unpause() external","function vault() external view returns (address)","function whitelistedRouters(address) external view returns (bool)","function withdraw(address tokenAddress) external"];

// ABIs for DEX interaction
const ERC20_ABI = ["function balanceOf(address account) external view returns (uint256)", "function decimals() external view returns (uint8)"];
const PAIR_ABI = ['function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)', 'function token0() external view returns (address)'];
const ROUTER_ABI = ['function factory() external pure returns (address)', 'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'];
const FACTORY_ABI = ['function getPair(address tokenA, address tokenB) external view returns (address pair)'];

// DEX and Token Configuration
const DEX_CONFIG = [
    { name: 'BaseSwap', router: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', factory: '0x89C836e1E496839b20675B3fE398158c069D26db' },
    { name: 'SushiSwap', router: '0x8cde23bfcc333490347344f2A14a60C803275f4D', factory: '0x01b004245785055233513229562711422B4bA2E1' },
    { name: 'Aerodrome', router: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43', factory: '0x420DD3817f364D72123541178a35624794890312' },
    { name: 'Wovenswap', router: '0x9948293913214153d1021714457543E5A447617A', factory: '0x3f353B02633041F1A121515574512534563aA18b' },
    { name: 'SwapBased', router: '0x1a713915139d8995111b51a54763B13809633aC8', factory: '0xE4CF472E32724A3e8a4a329aaa3A6A48713d2903' },
    { name: 'RocketSwap', router: '0x7aA010850A264eB919F58a5e542B76d26A4734a7', factory: '0x1A2555543c360155b10313f8A7836881a56f6bB6' }
];

const TOKEN_PAIRS = [
    // Core Pairs
    { name: 'WETH/USDC', a: '0x4200000000000000000000000000000000000006', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    { name: 'WETH/DAI', a: '0x4200000000000000000000000000000000000006', b: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' },
    { name: 'USDC/DAI', a: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', b: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' },

    // ETH Variants
    { name: 'cbETH/WETH', a: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DE822', b: '0x4200000000000000000000000000000000000006' },

    // Popular Base Tokens vs WETH
    { name: 'DEGEN/WETH', a: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', b: '0x4200000000000000000000000000000000000006' },
    { name: 'AERO/WETH', a: '0x940181a94A35A4569E4529A3CDfB74e38FD98631', b: '0x4200000000000000000000000000000000000006' },
    { name: 'SNX/WETH', a: '0x22e6db44414d952611452a818B2132172C558c42', b: '0x4200000000000000000000000000000000000006' },
    { name: 'SEAM/WETH', a: '0x1C7a460413dD4e964f96D8d452DE52eA010901A0', b: '0x4200000000000000000000000000000000000006' },
    { name: 'VELO/WETH', a: '0x9c354503C3734b54aA68179A1B3436121f70d050', b: '0x4200000000000000000000000000000000000006' },
    { name: 'HIGHER/WETH', a: '0x0578d8a44db98b23bf096a382e016e29a5ce0ffe', b: '0x4200000000000000000000000000000000000006' },
    { name: 'BRETT/WETH', a: '0x532f27101965dd16442E59d40670FaF2bBB16798', b: '0x4200000000000000000000000000000000000006' },
    { name: 'TOSHI/WETH', a: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4', b: '0x4200000000000000000000000000000000000006' },
    { name: 'BASED/WETH', a: '0x5244C8a7c552D639b5611754a123969561956557', b: '0x4200000000000000000000000000000000000006' },

    // Popular Base Tokens vs USDC
    { name: 'DEGEN/USDC', a: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    { name: 'AERO/USDC', a: '0x940181a94A35A4569E4529A3CDfB74e38FD98631', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    { name: 'SNX/USDC', a: '0x22e6db44414d952611452a818B2132172C558c42', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    { name: 'SEAM/USDC', a: '0x1C7a460413dD4e964f96D8d452DE52eA010901A0', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    { name: 'TN100x/USDC', a: '0xa40E599aea89659A51806305a41300971b404bA3', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' }
];


// Constants
const ORACLE_ADDRESS = "0x2CE95bcEdf92bb5de4bDb5DCCDa0e92e8daD653B";
const GAS_LIMIT = 800000;
const SLIPPAGE_BPS = 50; // 0.5%
const DYNAMIC_LOAN_PERCENTAGE = 5; // 0.5% of pool liquidity
const BALANCER_FEE = 0; // Balancer V2 flash loans currently have 0 fee

// --- MAIN HANDLER ---

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const {
            privateKey,
            infuraProjectId,
            gasStrategy
        } = JSON.parse(event.body);

        // --- Input Validation ---
        if (!infuraProjectId) throw new Error('Missing Infura Project ID.');
        if (!privateKey || !(privateKey.startsWith('0x') && privateKey.length === 66)) throw new Error('Missing or invalid private key.');
        if (!ARBITRAGE_BOT_ADDRESS || !isAddress(ARBITRAGE_BOT_ADDRESS)) throw new Error(`Invalid or missing contract address in backend configuration.`);

        const provider = new JsonRpcProvider(`https://base-mainnet.infura.io/v3/${infuraProjectId}`);
        const wallet = new Wallet(privateKey, provider);
        
        console.log("Starting arbitrage scan...");
        const result = await findAndExecuteArbitrage(wallet, provider, ARBITRAGE_BOT_ADDRESS, PROFIT_THRESHOLD, gasStrategy);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };

    } catch (err) {
        console.error('Bot execution error:', err);
        const errorMessage = err.reason || err.message || "An internal error occurred.";
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: errorMessage, error: err.toString() }) 
        };
    }
};

// --- ARBITRAGE SCANNER AND EXECUTOR ---

async function findAndExecuteArbitrage(wallet, provider, arbitrageBotAddress, profitThreshold, gasStrategy) {
    let tradeExecuted = false;

    const allPaths = [];
    for (const pair of TOKEN_PAIRS) {
        for (let i = 0; i < DEX_CONFIG.length; i++) {
            for (let j = 0; j < DEX_CONFIG.length; j++) {
                if (i === j) continue;
                allPaths.push({ pair, dex1: DEX_CONFIG[i], dex2: DEX_CONFIG[j] });
            }
        }
    }

    const results = await Promise.all(allPaths.map(async (path) => {
        if (tradeExecuted) return null; // Stop processing if a trade has been made

        try {
            const { pair, dex1, dex2 } = path;
            const tokenA = pair.a;
            const tokenB = pair.b;

            // --- Accurate Simulation ---
            const tokenAContract = new Contract(tokenA, ERC20_ABI, provider);
            const tokenADecimals = await tokenAContract.decimals();
            
            const factory1 = new Contract(dex1.factory, FACTORY_ABI, provider);
            const pairAddress = await factory1.getPair(tokenA, tokenB);
            if (pairAddress === '0x0000000000000000000000000000000000000000') return null;

            const pairContract = new Contract(pairAddress, PAIR_ABI, provider);
            const reserves = await pairContract.getReserves();
            const token0 = await pairContract.token0();
            const reserve = (tokenA.toLowerCase() === token0.toLowerCase()) ? reserves[0] : reserves[1];
            const loanAmount = (reserve * BigInt(DYNAMIC_LOAN_PERCENTAGE)) / 1000n;

            if (loanAmount <= 0) return null;
            
            const router1 = new Contract(dex1.router, ROUTER_ABI, provider);
            const amountsOut1 = await router1.getAmountsOut(loanAmount, [tokenA, tokenB]);
            const amountOutFromFirstSwap = amountsOut1[1];

            const router2 = new Contract(dex2.router, ROUTER_ABI, provider);
            const finalAmountsOut = await router2.getAmountsOut(amountOutFromFirstSwap, [tokenB, tokenA]);
            const simulatedFinalAmount = finalAmountsOut[1];

            // --- Profitability Check with All Costs ---
            const flashLoanFee = (loanAmount * BigInt(BALANCER_FEE)) / 10000n;
            const totalRepayment = loanAmount + flashLoanFee;
            const netProfit = simulatedFinalAmount - totalRepayment;

            const profitThresholdAmount = parseUnits(profitThreshold || '0', tokenADecimals);

            if (netProfit > profitThresholdAmount) {
                if (tradeExecuted) return null; // Double-check before executing
                tradeExecuted = true; // Set flag immediately

                console.log(`Profitable trade FOUND: ${pair.name} on ${dex1.name} -> ${dex2.name}`);
                console.log(`Gross Profit: ${formatUnits(netProfit, tokenADecimals)}`);

                return executeTrade(wallet, provider, arbitrageBotAddress, gasStrategy, tokenA, tokenB, dex1, dex2, loanAmount, profitThresholdAmount, tokenADecimals);
            }
            return null;

        } catch (error) {
            // console.warn(`Skipping path due to error: ${error.message}`);
            return null;
        }
    }));

    const successfulTrade = results.find(r => r !== null);

    if (successfulTrade) {
        return successfulTrade;
    }

    return { tradeExecuted: false, message: "Scan complete. No profitable arbitrage opportunities found meeting your criteria." };
}

async function executeTrade(wallet, provider, arbitrageBotAddress, gasStrategy, tokenA, tokenB, dex1, dex2, loanAmount, profitThresholdAmount, tokenADecimals) {
    const arbitrageBot = new Contract(arbitrageBotAddress, ARBITRAGE_BALANCER_ABI, wallet);

    const router1 = new Contract(dex1.router, ROUTER_ABI, provider);
    const amountsOut1 = await router1.getAmountsOut(loanAmount, [tokenA, tokenB]);
    const minAmountOutFromFirstSwap = (amountsOut1[1] * (10000n - BigInt(SLIPPAGE_BPS))) / 10000n;

    // --- Construct FlashLoanData ---
    const flashLoanData = {
        inputToken: tokenA,
        middleToken: tokenB,
        routers: [dex1.router, dex2.router],
        paths: [[tokenA, tokenB], [tokenB, tokenA]],
        minProfit: profitThresholdAmount,
        minAmountOutFromFirstSwap: minAmountOutFromFirstSwap,
        twapMaxDeviationBps: 0, // Disabled
        oracleAddress: ORACLE_ADDRESS,
        factory: dex1.factory
    };

    const userData = AbiCoder.default.encode([
        '(address,address,address[],address[][],uint256,uint256,uint256,address,address)'
    ], [flashLoanData]);

    // --- Set Gas Price ---
    const feeData = await provider.getFeeData();
    let gasPrice;
    switch(gasStrategy) {
        case 'fast': gasPrice = feeData.maxFeePerGas * 12n / 10n; break;
        case 'urgent': gasPrice = feeData.maxFeePerGas * 15n / 10n; break;
        default: gasPrice = feeData.maxFeePerGas;
    }

    // --- Execute Flash Loan ---
    const tx = await arbitrageBot.startFlashloan(tokenA, loanAmount, userData, {
        gasLimit: GAS_LIMIT,
        gasPrice: gasPrice
    });

    console.log(`Flash loan transaction sent! Hash: ${tx.hash}`);

    const simulatedProfit = (await new Contract(dex2.router, ROUTER_ABI, provider).getAmountsOut(amountsOut1[1], [tokenB, tokenA]))[1] - loanAmount;

    return {
        tradeExecuted: true,
        txHash: tx.hash,
        message: `Arbitrage opportunity executed successfully on ${dex1.name} -> ${dex2.name} for pair ${tokenA}/${tokenB}`,
        simulatedGrossProfit: formatUnits(simulatedProfit, tokenADecimals)
    };
}
