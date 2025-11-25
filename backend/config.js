const { getAddress } = require("ethers");

const NETWORKS = {
    mainnet: {
        name: "mainnet",
        rpc: process.env.MAINNET_RPC_URL,
        explorer: "https://etherscan.io",
    },
    base: {
        name: "base",
        rpc: process.env.BASE_RPC_URL,
        explorer: "https://basescan.org",
    },
};

const TOKENS = {
    base: {
        WETH: "0x4200000000000000000000000000000000000006",
        USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    },
};

const TOKEN_DECIMALS = {
    base: {
        WETH: 18,
        USDC: 6,
        DAI: 18,
    },
};

const DEX_ROUTERS = {
    base: {
        UniswapV3: {
            router: "0x2626664c2603336E57B271c5C0b26F421741e481",
            factory: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
        },
        PancakeSwapV3: {
            router: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
            factory: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
        },
        Aerodrome: {
            router: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
            factory: "0x420DD3802Ce3B747844e3094BEfa374352b71D22",
        },
        BaseSwap: {
            router: "0x327Df1E6de05895d2ab08525869213A502a938E2",
            factory: "0xAaA7A543e542028d84E67F9BBA84A6578052a045",
        }
    },
};


const DEX_TYPES = {
    UniswapV3: 1, 
    PancakeSwapV3: 2, 
    Aerodrome: 0, 
    BaseSwap: 0, // V2-style DEX
};

const LOAN_TOKENS = {
    WETH: getAddress(TOKENS.base.WETH),
    USDC: getAddress(TOKENS.base.USDC),
    DAI: getAddress(TOKENS.base.DAI),
};

const LOAN_AMOUNTS = {
    WETH: [1, 5, 10].map(a => BigInt(a * 10**18)),
    USDC: [1000, 5000, 10000].map(a => BigInt(a * 10**6)),
    DAI: [1000, 5000, 10000].map(a => BigInt(a * 10**18)),
};

const ARBITRAGE_PAIRS = [
    [getAddress(LOAN_TOKENS.WETH), getAddress(TOKENS.base.USDC)],
    [getAddress(LOAN_TOKENS.WETH), getAddress(TOKENS.base.DAI)],
    [getAddress(LOAN_TOKENS.USDC), getAddress(TOKENS.base.WETH)],
    [getAddress(LOAN_TOKENS.USDC), getAddress(TOKENS.base.DAI)],
    [getAddress(LOAN_TOKENS.DAI), getAddress(TOKENS.base.WETH)],
    [getAddress(LOAN_TOKENS.DAI), getAddress(TOKENS.base.USDC)],
];

const BOT_CONFIG = {
    ARBITRAGE_CONTRACT_ADDRESS: "0xYourArbitrageContractAddress", // Replace with your deployed contract address
    MIN_PROFIT_THRESHOLD_ETH: "0.001",
    GAS_PRICE_STRATEGY: "fast", // "fast", "standard", "slow"
    SLIPPAGE_TOLERANCE: 0.005, // 0.5%
    DRY_RUN: true, // If true, the bot will log opportunities but not execute them
};


module.exports = {
    NETWORKS,
    TOKENS,
    TOKEN_DECIMALS,
    DEX_ROUTERS,
    DEX_TYPES,
    LOAN_TOKENS,
    LOAN_AMOUNTS,
    ARBITRAGE_PAIRS,
    BOT_CONFIG,
};