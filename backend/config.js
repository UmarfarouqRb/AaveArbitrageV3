
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// --- Network Configuration ---
const NETWORKS = {
    base: {
        chainId: 8453,
        rpcUrl: `https://base-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
        explorerUrl: 'https://basescan.org',
    }
};

// --- Token Configuration ---
const TOKENS = {
    base: {
        WETH: '0x4200000000000000000000000000000000000006',
        USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        // Add other commonly used tokens for pathfinding
    }
};

// --- DEX Configuration --- 
const DEX_ROUTERS = {
    base: {
        'Aerodrome': '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
        'PancakeSwapV3': '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86', // <-- UPDATED
        'UniswapV3': '0x2626664c2603336E57B271c5C0b26F421741e481',
    }
};

const DEX_QUOTERS = {
    base: {
        // Note: PancakeSwap's Smart Router doesn't have a standalone quoter. 
        // The quoter functionality is integrated. For off-chain quoting, 
        // we might need to use a different quoter or the mainnet router address.
        // For now, let's assume the old quoter is still valid for price discovery.
        'PancakeSwapV3': '0x02b2A343833b5247937A0541434381504A860b0A',
        'UniswapV3': '0x3d4e44Eb1374240CE5F1B871ab261CD16335154A',
    }
};

// Aerodrome uses a V2-style factory
const DEX_FACTORIES = {
    base: {
        'Aerodrome': '0x420DD3817f369d7A95c2d3534e676B34ce444444',
    }
}

const V3_FEE_TIERS = {
    'PancakeSwapV3': [100, 500, 2500, 10000],
    'UniswapV3': [100, 500, 3000, 10000],
};

// Maps DEX name to the enum value in the smart contract
const DEX_TYPES = {
    'Aerodrome': 0,
    'PancakeSwapV3': 1,
    'UniswapV3': 2,
};


// --- Bot Configuration ---
const BOT_CONFIG = {
    ARBITRAGE_CONTRACT_ADDRESS: 'YOUR_HYBRID_CONTRACT_ADDRESS_HERE', // IMPORTANT: Replace with your deployed AaveArbitrageV3 contract address
    MIN_PROFIT_THRESHOLD: '0', // Minimum profit in native token (e.g., ETH)
    GAS_PRICE_STRATEGY: 'fast',
    GAS_LIMIT: 2000000, // Increased gas limit for complex hybrid trades
    SLIPPAGE_TOLERANCE: 50, // 0.5%
};

module.exports = {
    NETWORKS,
    TOKENS,
    DEX_ROUTERS,
    DEX_QUOTERS,
    DEX_FACTORIES,
    V3_FEE_TIERS,
    DEX_TYPES,
    BOT_CONFIG,
    PRIVATE_KEY,
    INFURA_PROJECT_ID
};
