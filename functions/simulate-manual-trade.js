
const { ethers } = require('ethers');

// --- Network & DEX Configuration ---
const RPC_ENDPOINTS = {
  'base-mainnet': 'https://mainnet.base.org',
  'base-sepolia': 'https://sepolia.base.org',
};

const DEX_ROUTERS = {
  'sushiswap': '0x9D0C1328C3d495A31934f33414531283aF58525B', // SushiSwap Router on Base
  'baseswap': '0x327Df1E6de05895d2ab08525869213A502674242',  // BaseSwap Router on Base
  'uniswap': '0x2626664c2603336E57B271c5C0b26F421741e481',   // Uniswap Universal Router on Base
};

// --- Helper Functions ---

// Minimal ERC20 ABI for decimals
const ERC20_ABI_DECIMALS = [
  "function decimals() view returns (uint8)"
];

// Minimal DEX Router ABI for getting quotes
const ROUTER_ABI_GETAMOUNTSOUT = [
  "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)"
];

async function getTokenDecimals(provider, tokenAddress) {
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI_DECIMALS, provider);
  try {
    return await tokenContract.decimals();
  } catch (error) {
    console.warn(`Could not fetch decimals for ${tokenAddress}. Defaulting to 18.`, error);
    return 18; // Default to 18 if decimals() fails
  }
}

async function getAmountOutMin(provider, routerAddress, amountIn, tokenInAddress, tokenOutAddress) {
  const router = new ethers.Contract(routerAddress, ROUTER_ABI_GETAMOUNTSOUT, provider);
  const path = [tokenInAddress, tokenOutAddress];
  
  try {
    const amounts = await router.getAmountsOut(amountIn, path);
    return amounts[1]; // The second element is the output amount
  } catch (error) {
    console.error(`Failed to get amount out from ${routerAddress} for path ${path}`, error);
    throw new Error(`Failed to get quote from DEX: ${error.message}`);
  }
}

// --- Main Handler ---

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { network, tokenA, tokenB, dex1, dex2, loanAmount } = JSON.parse(event.body);

    if (!network || !tokenA || !tokenB || !dex1 || !dex2 || !loanAmount) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required parameters' }) };
    }

    const rpcUrl = RPC_ENDPOINTS[network];
    if (!rpcUrl) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid network specified' }) };
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const dex1Router = DEX_ROUTERS[dex1];
    const dex2Router = DEX_ROUTERS[dex2];
    if (!dex1Router || !dex2Router) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid DEX specified' }) };
    }

    // --- Simulation Logic ---
    const tokenADecimals = await getTokenDecimals(provider, tokenA);
    const loanAmountWei = ethers.parseUnits(loanAmount, tokenADecimals);

    // 1. Simulate swapping Token A for Token B on the first DEX
    const amountBOut = await getAmountOutMin(provider, dex1Router, loanAmountWei, tokenA, tokenB);

    // 2. Simulate swapping the received Token B back to Token A on the second DEX
    const finalAmountAOut = await getAmountOutMin(provider, dex2Router, amountBOut, tokenB, tokenA);

    // 3. Calculate Profit
    const profitWei = finalAmountAOut - loanAmountWei;
    const estimatedProfit = ethers.formatUnits(profitWei, tokenADecimals);
    const isProfitable = profitWei > 0;

    return {
      statusCode: 200,
      body: JSON.stringify({
        isProfitable,
        estimatedProfit: estimatedProfit.toString(),
        profitToken: tokenA,
      }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    console.error("Simulation Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal error occurred during simulation.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
