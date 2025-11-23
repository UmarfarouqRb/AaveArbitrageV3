const { JsonRpcProvider, Contract } = require('ethers');
const config = require('./config'); // Import the entire config object

const ERC20_ABI = [
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)",
];

const providerCache = {};

function getProvider(networkName, NETWORKS) {
    if (!providerCache[networkName]) {
        const rpcUrl = NETWORKS[networkName]?.rpcUrl;
        if (!rpcUrl) throw new Error(`RPC URL for network ${networkName} not found.`);
        providerCache[networkName] = new JsonRpcProvider(rpcUrl);
    }
    return providerCache[networkName];
}

function getDexConfig(dexName) {
    const network = 'base'; // Assuming 'base' for now
    const router = config.DEX_ROUTERS[network][dexName];
    const factory = config.DEX_FACTORIES ? config.DEX_FACTORIES[network][dexName] : undefined;

    if (!router) {
        throw new Error(`Router for ${dexName} on network ${network} not found.`);
    }

    return { router, factory };
}

async function getTokenDetails(tokenAddress, provider) {
    const contract = new Contract(tokenAddress, ERC20_ABI, provider);
    const [decimals, symbol] = await Promise.all([
        contract.decimals(),
        contract.symbol()
    ]);
    return { address: tokenAddress, decimals: Number(decimals), symbol };
}

async function getGasPrice(provider, strategy) {
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;

    if (strategy === 'fast') {
        return gasPrice * 12n / 10n; // 20% markup
    } else if (strategy === 'aggressive') {
        return gasPrice * 15n / 10n; // 50% markup
    } else {
        return gasPrice;
    }
}

module.exports = {
    getProvider,
    getDexConfig,
    getTokenDetails,
    getGasPrice,
};
