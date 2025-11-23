
const { getAddress, parseUnits } = require('ethers');

// --- Network Configuration ---
const NETWORKS = {
    base: {
        chainId: 8453,
        rpcUrl: 'https://base-mainnet.infura.io/v3/', // Project ID will be appended in bot.js
        explorerUrl: 'https://basescan.org',
    }
};

// --- Token Configuration ---
const TOKENS = {
    base: {
        WETH: getAddress('0x4200000000000000000000000000000000000006'),
        USDC: getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'), 
        cbBTC: getAddress('0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf'),
        DAI: getAddress('0x50c5725949a6f0c72e6c4a641f24049a917db0cb'),
        DEGEN: getAddress('0x4ed4e862860bed51a9570b96d89af5e1b0efefed'),
        BRETT: getAddress('0x532f27101965dd16442e59d40670faf2ebb144e4'),
        AERO: getAddress('0x940181a94a35a4569e4529a3cdfb74e38fd98631'),
        cbETH: getAddress('0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22'),
        HIGHER: getAddress('0x0578d8a44db98b23bf096a382e016e29a5ce0ffe'),
        FRIEND: getAddress('0x0bd488718c4651a08528b931081a24607220556f'),
        MFER: getAddress('0xe3086852a4b125803c815a1582f17cc4a1226956'),
        TOSHI: getAddress('0xac1bd2486aaf3bf5c03df39e8499452d84e04049'),
        DOGINME: getAddress('0x6921b130d297cc43754afba22e5eac0f3f3da462'),
        TYBG: getAddress('0x0d9c429813e335506451e257017d50b8e2b21a81'),
        BALD: getAddress('0x27d2decb4a5353dc9f39075e55104935f7956b62'),
        SEAM: getAddress('0x1c7a460413dd4e964f96d8dfc56e7223ce82cf0a'),
        TN100X: getAddress('0x554c9251a3501f65523f22144d13374b43aa9d6b'),
        NORMIE: getAddress('0x7f12d13b34f5f4f0a9449c16bcd42f0da47af200'),
        JESSE: getAddress('0x0765425b334d7db1f3ca6c07887552a9252a8183'),
    }
};

const TOKEN_DECIMALS = {
    base: {
        WETH: 18, USDC: 6, cbBTC: 8, DAI: 18, DEGEN: 18, BRETT: 18, AERO: 18, cbETH: 18,
        HIGHER: 18, FRIEND: 18, MFER: 18, TOSHI: 18, DOGINME: 18, TYBG: 18, BALD: 18,
        SEAM: 18, TN100X: 18, NORMIE: 18, JESSE: 18,
    }
};

// --- DEX Configuration ---
const DEX_ROUTERS = {
    base: {
        'Aerodrome': {
            router: getAddress('0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43'),
            factory: getAddress('0x420dd381b31aef6683db6b902084cb0ffcec40da'),
            stable: false, // Default to volatile
        },
        'PancakeV3': {
            router: getAddress('0x678aa4bf4e210cf2166753e054d5b7c31cc7fa86'),
        },
        'UniswapV3': {
            router: getAddress('0x2626664c2603336e57b271c5c0b26f421741e481'),
        },
    }
};

const DEX_QUOTERS = {
    base: {
        'PancakeV3': getAddress('0xb048bbc1ee6b733fffcfb9e9cef7375518e25997'),
        'UniswapV3': getAddress('0x3d4e44318e88753c0b805842dacfb33a1fc65dc6'),
    }
};

const V3_FEE_TIERS = {
    'PancakeV3': [100, 500, 2500, 10000],
    'UniswapV3': [100, 500, 3000, 10000],
};

const DEX_TYPES = {
    'Aerodrome': 0, // Matches contract enum
    'PancakeV3': 1, // Matches contract enum
    'UniswapV3': 2, // Matches contract enum
};

// --- Arbitrage Configuration ---

const LOAN_TOKENS = {
    USDC: TOKENS.base.USDC,
    WETH: TOKENS.base.WETH,
};

const LOAN_AMOUNTS = {
    USDC: [
        parseUnits('10', TOKEN_DECIMALS.base.USDC),
        parseUnits('25', TOKEN_DECIMALS.base.USDC),
        parseUnits('50', TOKEN_DECIMALS.base.USDC),
        parseUnits('100', TOKEN_DECIMALS.base.USDC),
        parseUnits('250', TOKEN_DECIMALS.base.USDC),
        parseUnits('500', TOKEN_DECIMALS.base.USDC)
    ],
    WETH: [
        parseUnits('0.05', TOKEN_DECIMALS.base.WETH),
        parseUnits('0.1', TOKEN_DECIMALS.base.WETH),
        parseUnits('0.25', TOKEN_DECIMALS.base.WETH),
        parseUnits('0.5', TOKEN_DECIMALS.base.WETH)
    ]
};


// Automatically generate pairs for all tokens against all loan tokens
const ARBITRAGE_PAIRS = Object.values(LOAN_TOKENS).flatMap(loanToken =>
    Object.values(TOKENS.base)
        .filter(targetToken => targetToken !== loanToken) // Ensure loan token is not the same as target token
        .map(targetToken => [loanToken, targetToken])
);


// --- Bot Configuration ---
const BOT_CONFIG = {
    DRY_RUN: false, 
    ARBITRAGE_CONTRACT_ADDRESS: getAddress('0x7b2Af90c95A38016aB9e09926500A9A1ca915779'),
    MIN_PROFIT_THRESHOLD_ETH: '0.0001', // Minimum profit in ETH to trigger a trade
    GAS_PRICE_STRATEGY: 'fast',
    GAS_LIMIT: '1000000',
    AAVE_FLASH_LOAN_FEE: 0.0009, // 0.09%
    ESTIMATED_GAS_COST_ETH: '0', // Estimated gas cost in ETH
    SLIPPAGE_TOLERANCE: 0.005, // 0.5% slippage tolerance
};

module.exports = {
    NETWORKS,
    TOKENS,
    TOKEN_DECIMALS,
    DEX_ROUTERS,
    DEX_QUOTERS,
    V3_FEE_TIERS,
    DEX_TYPES,
    LOAN_TOKENS,
    LOAN_AMOUNTS,
    ARBITRAGE_PAIRS,
    BOT_CONFIG,
};