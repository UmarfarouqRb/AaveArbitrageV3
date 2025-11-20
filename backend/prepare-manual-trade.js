
const { Contract, AbiCoder, parseUnits, solidityPacked } = require('ethers');
const { getDexConfig, getProvider, getGasPrice } = require('./utils');
const { NETWORKS, BOT_CONFIG, DEX_TYPES } = require('./config');
const { AAVE_ARBITRAGE_V3_ABI } = require('./abi.js');
const ERC20_ABI = ["function decimals() external view returns (uint8)"];

async function prepareTrade(tradeParams) {
    const { network, tokenA, tokenB, dex1, dex2, loanAmount, userAddress, bestFee1, bestFee2, stable } = tradeParams;

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

    const defaultAbiCoder = new AbiCoder();

    // Correctly encodes dexParams based on the DEX type to match the smart contract's expectations.
    const getDexParams = (dexName, fromToken, toToken, fee, dexConfig, isStable) => {
        const dexType = DEX_TYPES[dexName];

        if (dexType === 1) { // V3 DEX (e.g., PancakeSwap)
            // For V3, the contract expects abi.encode(bytes path, uint256 amountOutMinimum)
            const path = solidityPacked(['address', 'uint24', 'address'], [fromToken, fee, toToken]);
            return defaultAbiCoder.encode(['bytes', 'uint256'], [path, 0]);

        } else if (dexType === 0) { // V2 DEX (e.g., Aerodrome)
            // For Aerodrome, the contract expects abi.encode(bool stable, address factory, uint256 amountOutMin)
            // Note: `isStable` must be passed from the frontend. We default to false.
            const factory = dexConfig.factory; // Assumes factory address is in the config
            if (!factory) {
                throw new Error(`Factory address for ${dexName} is not configured.`);
            }
            return defaultAbiCoder.encode(['bool', 'address', 'uint256'], [isStable || false, factory, 0]);

        } else {
            // Fallback for other DEX types, though currently only V2/V3 are handled.
            return defaultAbiCoder.encode(['uint256'], [0]);
        }
    };

    const swaps = [
        {
            router: dexConfig1.router,
            from: tokenA,
            to: tokenB,
            dex: DEX_TYPES[dex1],
            dexParams: getDexParams(dex1, tokenA, tokenB, bestFee1, dexConfig1, stable)
        },
        {
            router: dexConfig2.router,
            from: tokenB,
            to: tokenA,
            dex: DEX_TYPES[dex2],
            dexParams: getDexParams(dex2, tokenB, tokenA, bestFee2, dexConfig2, stable)
        }
    ];

    const gasPrice = await getGasPrice(provider, BOT_CONFIG.GAS_PRICE_STRATEGY);

    // Populate the transaction data without signing
    const unsignedTx = await arbitrageBot.executeArbitrage.populateTransaction(
        tokenA,
        loanAmountBigInt,
        swaps,
        {
            gasLimit: BOT_CONFIG.GAS_LIMIT,
            gasPrice: gasPrice,
            from: userAddress
        }
    );

    return unsignedTx;
}

module.exports = { prepareTrade };
