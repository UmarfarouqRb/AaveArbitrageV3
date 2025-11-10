
const { Wallet, JsonRpcProvider, Contract, formatUnits, parseUnits } = require('ethers');
const { isAddress } = require('ethers');

// ABI for the Arbitrage Balancer contract
const arbitrageBalancerABI = [
    "function executeArbitrage(address tokenA, address tokenB, address dexRouter1, address dexRouter2) external payable"
];

// ABIs for interacting with DEXs and tokens
const ERC20_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)"
];
const pairABI = [
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() external view returns (address)'
];
const factoryABI = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

const ARBITRAGE_BOT_ABI = arbitrageBalancerABI;

// Constants
const GAS_LIMIT_ESTIMATE = 450000;
const DYNAMIC_LOAN_PERCENTAGE = 5; // Using 0.5% of the shallowest pool's liquidity.

// List of DEXs to scan
const DEX_CONFIG = [
    { name: 'BaseSwap', router: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24' },
    { name: 'SushiSwap', router: '0x8cde23bfcc333490347344f2A14a60C803275f4D' },
    { name: 'Aerodrome', router: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43' },
    { name: 'Wovenswap', router: '0x9948293913214153d1021714457543E5A447617A' }
];

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    try {
        const {
            privateKey,
            infuraProjectId,
            tokenA,
            tokenB,
            dex1: dexRouter1,
            dex2: dexRouter2,
            arbitrageBotAddress,
            profitThreshold,
            useDynamicLoan,
            manualLoanAmount,
            gasStrategy
        } = JSON.parse(event.body);

        // --- Input Validation ---
        if (!infuraProjectId) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Request is missing Infura Project ID.' }) };
        }
        if (!privateKey || !(privateKey.startsWith('0x') && privateKey.length === 66)) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Request is missing a valid private key.' }) };
        }
        for (const addr of [tokenA, tokenB, arbitrageBotAddress]) {
            if (!addr || !isAddress(addr)) {
                return { statusCode: 400, body: JSON.stringify({ message: `Invalid or missing Ethereum address: ${addr}` }) };
            }
        }

        const provider = new JsonRpcProvider(`https://base-mainnet.infura.io/v3/${infuraProjectId}`);
        const wallet = new Wallet(privateKey, provider);
        const arbitrageBot = new Contract(arbitrageBotAddress, ARBITRAGE_BOT_ABI, wallet);

        const tokenAContract = new Contract(tokenA, ERC20_ABI, provider);

        // --- Dynamic Loan Calculation ---
        let loanAmount;
        if (useDynamicLoan) {
            const path = await getPathForTokens(tokenA, tokenB, DEX_CONFIG[0].router, provider);
            const pairAddress = await getPairAddress(path[0], path[1], DEX_CONFIG[0].router, provider);
            const pairContract = new Contract(pairAddress, pairABI, provider);
            const reserves = await pairContract.getReserves();
            const token0 = await pairContract.token0();

            const reserve = (tokenA.toLowerCase() === token0.toLowerCase()) ? reserves[0] : reserves[1];
            loanAmount = (reserve * BigInt(DYNAMIC_LOAN_PERCENTAGE)) / BigInt(1000);
        } else {
            const decimals = await tokenAContract.decimals();
            loanAmount = parseUnits(manualLoanAmount, decimals);
        }

        if (loanAmount <= 0) {
            return { statusCode: 200, body: JSON.stringify({ isProfitable: false, message: 'Calculated loan amount is zero or less.' }) };
        }

        // --- Simulate Trade ---
        const amountOut1 = await getAmountOut(loanAmount, tokenA, tokenB, dexRouter1, provider);
        const bestFinalAmountA = await getAmountOut(amountOut1, tokenB, tokenA, dexRouter2, provider);

        // --- Profitability Check ---
        const feeData = await provider.getFeeData();
        let gasPrice;
        switch(gasStrategy) {
            case 'fast':
                gasPrice = feeData.maxFeePerGas * BigInt(12) / BigInt(10); // 1.2x
                break;
            case 'urgent':
                gasPrice = feeData.maxFeePerGas * BigInt(15) / BigInt(10); // 1.5x
                break;
            default: // medium
                gasPrice = feeData.maxFeePerGas;
        }

        const estimatedGasCost = gasPrice * BigInt(GAS_LIMIT_ESTIMATE);
        const netProfit = bestFinalAmountA - loanAmount - estimatedGasCost;

        console.log(`Potential Profit (in Token A): ${formatUnits(netProfit, 18)}`);

        const thresholdAmount = parseUnits(profitThreshold || '0', 18);

        if (netProfit > thresholdAmount) {
            console.log('Profitable trade found! Executing...');
            const tx = await arbitrageBot.executeArbitrage(tokenA, tokenB, dexRouter1, dexRouter2, {
                value: loanAmount,
                gasLimit: GAS_LIMIT_ESTIMATE,
                gasPrice: gasPrice
            });
            await tx.wait();

            return {
                statusCode: 200,
                body: JSON.stringify({
                    tradeExecuted: true,
                    txHash: tx.hash,
                    grossProfit: formatUnits(bestFinalAmountA - loanAmount, 18)
                })
            };
        } else {
            console.log('No profitable opportunity found after accounting for gas.');
            return { statusCode: 200, body: JSON.stringify({ isProfitable: false, message: 'No profitable opportunity found after accounting for gas.' }) };
        }
    } catch (err) {
        console.error('Bot execution error:', err);
        return { statusCode: 500, body: JSON.stringify({ message: 'An internal error occurred.', error: err.reason || err.message }) };
    }
};

async function getPathForTokens(tokenA, tokenB, routerAddress, provider) {
    const router = new Contract(routerAddress, ['function factory() external pure returns (address)'], provider);
    const factoryAddress = await router.factory();
    const factory = new Contract(factoryAddress, factoryABI, provider);
    const pairAddress = await factory.getPair(tokenA, tokenB);

    if (pairAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error("No direct pair found for the tokens on this DEX.");
    }
    return [tokenA, tokenB];
}

async function getPairAddress(tokenA, tokenB, routerAddress, provider) {
    const router = new Contract(routerAddress, ['function factory() external pure returns (address)'], provider);
    const factoryAddress = await router.factory();
    const factory = new Contract(factoryAddress, factoryABI, provider);
    return await factory.getPair(tokenA, tokenB);
}

async function getAmountOut(amountIn, tokenIn, tokenOut, routerAddress, provider) {
    const router = new Contract(routerAddress, ['function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'], provider);
    const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    return amounts[1];
}
