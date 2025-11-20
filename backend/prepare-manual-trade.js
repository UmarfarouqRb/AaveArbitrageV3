const { Contract, AbiCoder, parseUnits, solidityPacked, getAddress } = require('ethers');
const { getDexConfig, getProvider, getGasPrice } = require('./utils');
const { NETWORKS, BOT_CONFIG, DEX_TYPES, TOKENS } = require('./config');
const { AAVE_ARBITRAGE_V3_ABI } = require('./abi.js');
const ERC20_ABI = ["function decimals() external view returns (uint8)"];

async function prepareTrade(tradeParams) {
    const { network, tokenA, tokenB, dex1, dex2, loanAmount, userAddress, bestFee1, bestFee2 } = tradeParams;

    if (!userAddress) {
        throw new Error("User address is required to prepare a trade.");
    }

    const provider = getProvider(network, NETWORKS);
    const arbitrageBot = new Contract(BOT_CONFIG.ARBITRAGE_CONTRACT_ADDRESS, AAVE_ARBITRAGE_V3_ABI, provider);

    const dexConfig1 = getDexConfig(dex1);
    const dexConfig2 = getDexConfig(dex2);

    const tokenAContract = new Contract(tokenA, ERC20_ABI, provider);
    const tokenADecimals = await tokenAContract.decimals();
    const loanAmountBigInt = parseUnits(loanAmount, tokenADecimals);

    const stablecoins = [TOKENS.base.USDC, TOKENS.base.DAI].map(t => getAddress(t));
    const isStableSwap = stablecoins.includes(getAddress(tokenA)) && stablecoins.includes(getAddress(tokenB));

    const defaultAbiCoder = new AbiCoder();

    const getDexParams = (dexName, fromToken, toToken, fee, dexConfig, isStable) => {
        const dexType = DEX_TYPES[dexName];

        if (dexType === 1 || dexType === 2) { // V3 DEXs
            const path = solidityPacked(['address', 'uint24', 'address'], [fromToken, fee, toToken]);
            return defaultAbiCoder.encode(['bytes', 'uint256'], [path, 0]);

        } else if (dexType === 0) { // V2 DEX
            const factory = dexConfig.factory;
            if (!factory) {
                throw new Error(`Factory address for ${dexName} is not configured.`);
            }
            return defaultAbiCoder.encode(['bool', 'address', 'uint256'], [isStable, factory, 0]);

        } else {
            return defaultAbiCoder.encode(['uint256'], [0]);
        }
    };

    const swaps = [
        {
            router: dexConfig1.router,
            from: tokenA,
            to: tokenB,
            dex: DEX_TYPES[dex1],
            dexParams: getDexParams(dex1, tokenA, tokenB, bestFee1, dexConfig1, isStableSwap)
        },
        {
            router: dexConfig2.router,
            from: tokenB,
            to: tokenA,
            dex: DEX_TYPES[dex2],
            dexParams: getDexParams(dex2, tokenB, tokenA, bestFee2, dexConfig2, isStableSwap)
        }
    ];

    const gasPrice = await getGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);

    // Populate the transaction data without signing
    const unsignedTx = await arbitrageBot.executeArbitrage.populateTransaction(
        tokenA,
        loanAmountBigInt,
        swaps,
        {
            gasPrice: gasPrice,
            from: userAddress
        }
    );

    return unsignedTx;
}

module.exports = { prepareTrade };
