
const { JsonRpcProvider, Contract, Wallet, parseUnits, AbiCoder, formatUnits } = require('ethers');
const { uniswapV2RouterABI, arbitrageBalancerABI } = require('../../frontend/src/utils/abi');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    let privateKey;
    try {
        const body = JSON.parse(event.body);
        privateKey = body.privateKey;
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid request body' }) };
    }


    if (!privateKey) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Missing private key in request body' }) };
    }

    // 1. CONFIGURATION
    // =================================================================
    const INFURA_PROJECT_ID = process.env.YOUR_INFURA_PROJECT_ID;
    const ARBITRAGE_CONTRACT_ADDRESS = process.env.ARBITRAGE_BALANCER_CONTRACT_ADDRESS;

    if (!INFURA_PROJECT_ID || !ARBITRAGE_CONTRACT_ADDRESS) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Missing required environment variables (Infura ID or Contract Address)' }),
        };
    }

    const networkConfig = {
        rpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
        arbitrageBalancerAddress: ARBITRAGE_CONTRACT_ADDRESS,
    };

    const arbitrageParams = {
        tokenA: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        tokenB: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
        loanAmount: parseUnits('10', 18), // Example: 10 WETH
        dex1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',   // Uniswap V2
        dex2: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',   // Sushiswap
    };

    try {
        // 2. SETUP
        // =================================================================
        const provider = new JsonRpcProvider(networkConfig.rpcUrl);
        const wallet = new Wallet(privateKey, provider);
        const { tokenA, tokenB, loanAmount, dex1, dex2 } = arbitrageParams;

        const dex1Router = new Contract(dex1, uniswapV2RouterABI, provider);
        const dex2Router = new Contract(dex2, uniswapV2RouterABI, provider);

        const arbitrageBalancer = new Contract(networkConfig.arbitrageBalancerAddress, arbitrageBalancerABI, wallet);
        const abiCoder = new AbiCoder();

        // 3. FIND OPPORTUNITY
        // =================================================================
        const amountsOut1 = await dex1Router.getAmountsOut(loanAmount, [tokenA, tokenB]);
        const amountB_from_dex1 = amountsOut1[1];

        const amountsOut2 = await dex2Router.getAmountsOut(loanAmount, [tokenA, tokenB]);
        const amountB_from_dex2 = amountsOut2[1];

        const buyOnDex = amountB_from_dex1 > amountB_from_dex2 ? dex1 : dex2;
        const sellOnDex = amountB_from_dex1 > amountB_from_dex2 ? dex2 : dex1;
        const amountB_received = amountB_from_dex1 > amountB_from_dex2 ? amountB_from_dex1 : amountB_from_dex2;

        const finalAmountsOut = await (buyOnDex === dex1 ? dex2Router : dex1Router).getAmountsOut(amountB_received, [tokenB, tokenA]);
        const finalAmountA = finalAmountsOut[1];

        // 4. EXECUTE FLASH LOAN if profitable
        // =================================================================
        const PROFIT_THRESHOLD = parseUnits('0.001', 18);

        if (finalAmountA > loanAmount + PROFIT_THRESHOLD) {
            const grossProfit = finalAmountA - loanAmount;
            const userData = abiCoder.encode(
                ['address[]', 'address[][]'],
                [
                    [buyOnDex, sellOnDex],
                    [
                        [tokenA, tokenB],
                        [tokenB, tokenA]
                    ]
                ]
            );

            const tx = await arbitrageBalancer.startFlashloan(tokenA, loanAmount, userData);
            await tx.wait();

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Arbitrage executed! Gross profit: ${formatUnits(grossProfit, 18)} WETH.`
                }),
            };

        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No profitable arbitrage opportunity found.' }),
            };
        }
    } catch (err) {
        console.error('Bot execution error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred during bot execution.', error: err.reason || err.message })
        };
    }
};
