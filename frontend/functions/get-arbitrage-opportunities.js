const { JsonRpcProvider, Contract } = require('ethers');

// ABIs needed for fetching pair reserves and addresses
const pairABI = [
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)'
];
const factoryABI = [
    'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

// Configuration for DEXs on Base Mainnet (Uniswap V2 Forks)
const DEX_CONFIG = [
    { name: 'BaseSwap', router: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24', factory: '0x89C836e1E496839b20675B3fE398158c069D26db' },
    { name: 'SushiSwap', router: '0x8cde23bfcc333490347344f2A14a60C803275f4D', factory: '0x01b004245785055233513229562711422B4bA2E1' },
    { name: 'Aerodrome', router: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43', factory: '0x420DD3817f364D72123541178a35624794890312' },
];

// Common token pairs on Base to scan
const TOKEN_PAIRS = [
    { name: 'WETH/USDC', a: '0x4200000000000000000000000000000000000006', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    { name: 'WETH/DAI', a: '0x4200000000000000000000000000000000000006', b: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' },
    { name: 'DEGEN/WETH', a: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', b: '0x4200000000000000000000000000000000000006' },
    { name: 'DEGEN/USDC', a: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', b: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    { name: 'CBETH/WETH', a: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DE822', b: '0x4200000000000000000000000000000000000006' },
];

// Uniswap V2 formula for calculating output amount
function getAmountOut(amountIn, reserveIn, reserveOut) {
    const amountInWithFee = amountIn * 997n; // Fee is 0.3%
    const numerator = amountInWithFee * reserveOut;
    const denominator = (reserveIn * 1000n) + amountInWithFee;
    return numerator / denominator;
}

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    const { infuraProjectId } = JSON.parse(event.body);

    if (!infuraProjectId) {
        return { statusCode: 400, body: JSON.stringify({ message: "Request is missing Infura Project ID." }) };
    }
    
    const provider = new JsonRpcProvider(`https://base-mainnet.infura.io/v3/${infuraProjectId}`);
    
    const opportunities = [];
    const amountIn = BigInt(10**18); // Simulate with 1 unit of the base token (e.g., 1 WETH)

    for (const pair of TOKEN_PAIRS) {
        const tokenA = pair.a;
        const tokenB = pair.b;
        const [tokenAName, tokenBName] = pair.name.split('/');

        for (let i = 0; i < DEX_CONFIG.length; i++) {
            for (let j = 0; j < DEX_CONFIG.length; j++) {
                if (i === j) continue;

                const dex1 = DEX_CONFIG[i];
                const dex2 = DEX_CONFIG[j];

                try {
                    // --- Forward path: TokenA -> TokenB on DEX1, then TokenB -> TokenA on DEX2 ---

                    // Get pair reserves for the first swap
                    const factory1 = new Contract(dex1.factory, factoryABI, provider);
                    const pairAddress1 = await factory1.getPair(tokenA, tokenB);
                    if (pairAddress1 === '0x0000000000000000000000000000000000000000') continue;
                    
                    const pairContract1 = new Contract(pairAddress1, pairABI, provider);
                    const [reserves1_A, reserves1_B] = await pairContract1.getReserves();
                    const pairToken0_1 = await pairContract1.token0();

                    const [reserveIn1, reserveOut1] = (pairToken0_1.toLowerCase() === tokenA.toLowerCase()) 
                        ? [reserves1_A, reserves1_B] 
                        : [reserves1_B, reserves1_A];

                    if (reserveIn1 === 0n || reserveOut1 === 0n) continue;
                    const amountOut1 = getAmountOut(amountIn, reserveIn1, reserveOut1);
                    
                    // Get pair reserves for the second swap
                    const factory2 = new Contract(dex2.factory, factoryABI, provider);
                    const pairAddress2 = await factory2.getPair(tokenB, tokenA);
                     if (pairAddress2 === '0x0000000000000000000000000000000000000000') continue;

                    const pairContract2 = new Contract(pairAddress2, pairABI, provider);
                    const [reserves2_A, reserves2_B] = await pairContract2.getReserves();
                    const pairToken0_2 = await pairContract2.token0();

                    const [reserveIn2, reserveOut2] = (pairToken0_2.toLowerCase() === tokenB.toLowerCase())
                        ? [reserves2_A, reserves2_B]
                        : [reserves2_B, reserves2_A];
                    
                    if (reserveIn2 === 0n || reserveOut2 === 0n) continue;
                    const finalAmount = getAmountOut(amountOut1, reserveIn2, reserveOut2);
                    
                    const profit = finalAmount - amountIn;
                    
                    if (profit > 0) {
                        const profitRatio = parseFloat(profit.toString()) / parseFloat(amountIn.toString());
                        opportunities.push({
                            id: `${pair.name}-${dex1.name}-${dex2.name}`,
                            path: [tokenAName, tokenBName, tokenAName],
                            profit: profitRatio,
                            dexs: [dex1.name, dex2.name],
                            tokenAddresses: [tokenA, tokenB],
                            routerAddresses: [dex1.router, dex2.router]
                        });
                    }
                } catch (err) {
                    // This can happen if a pair doesn't exist, etc. We can safely ignore these errors.
                    // console.warn(`Could not calculate path for ${pair.name} on ${dex1.name}->${dex2.name}: ${err.message}`);
                    continue;
                }
            }
        }
    }
    
    // Sort by most profitable
    opportunities.sort((a, b) => b.profit - a.profit);

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunities })
    };
}
