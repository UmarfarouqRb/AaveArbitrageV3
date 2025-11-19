
const { Contract, AbiCoder, parseUnits } = require('ethers');
const { getDexConfig, getProvider, getGasPrice } = require('./utils');
const { NETWORKS, BOT_CONFIG, DEX_TYPES } = require('./config');
const ARBITRAGE_BALANCER_ABI = require('./abi.js');
const ERC20_ABI = ["function decimals() external view returns (uint8)"];

async function prepareTrade(tradeParams) {
    const { network, tokenA, tokenB, dex1, dex2, loanAmount, userAddress } = tradeParams;

    if (!userAddress) {
        throw new Error("User address is required to prepare a trade.");
    }

    const provider = getProvider(network, NETWORKS);
    const arbitrageBot = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, ARBITRAGE_BALANCER_ABI, provider);

    const dexConfig1 = getDexConfig(dex1);
    const dexConfig2 = getDexConfig(dex2);

    const tokenAContract = new Contract(tokenA, ERC20_ABI, provider);
    const tokenADecimals = await tokenAContract.decimals();
    const loanAmountBigInt = parseUnits(loanAmount, tokenADecimals);

    const defaultAbiCoder = new AbiCoder();

    const swaps = [
        {
            router: dexConfig1.router,
            from: tokenA,
            to: tokenB,
            dex: DEX_TYPES[dex1],
            dexParams: defaultAbiCoder.encode(['uint24'], [3000]) // Example fee tier
        },
        {
            router: dexConfig2.router,
            from: tokenB,
            to: tokenA,
            dex: DEX_TYPES[dex2],
            dexParams: defaultAbiCoder.encode(['uint24'], [3000]) // Example fee tier
        }
    ];

    const gasPrice = await getGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);

    // Populate the transaction data without signing
    const unsignedTx = await arbitrageBot.executeArbitrage.populateTransaction(
        tokenA,
        loanAmountBigInt,
        swaps,
        {
            gasLimit: BOT_CONFIG.GAS_LIMIT, // Make sure GAS_LIMIT is defined in your config
            gasPrice: gasPrice,
            from: userAddress // The transaction will be sent from the user's address
        }
    );

    return unsignedTx;
}

module.exports = { prepareTrade };
