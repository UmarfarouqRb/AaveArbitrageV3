
const { JsonRpcProvider, Contract, parseUnits, formatUnits } = require('ethers');
const { uniswapV2RouterABI } = require('../frontend/src/utils/abi');

class ArbitrageBot {
  constructor(arbitrageParams, networkConfig) {
    this.arbitrageParams = arbitrageParams;
    this.networkConfig = networkConfig;
    this.provider = new JsonRpcProvider(networkConfig.rpcUrl);
  }

  async findOpportunities() {
    const { tokenA, tokenB, dex1, dex2 } = this.arbitrageParams;

    const dex1Router = new Contract(dex1, uniswapV2RouterABI, this.provider);
    const dex2Router = new Contract(dex2, uniswapV2RouterABI, this.provider);

    const amountIn = parseUnits('1', 18); // 1 TokenA

    // Get prices from DEX1
    const amountsOut1 = await dex1Router.getAmountsOut(amountIn, [tokenA, tokenB]);
    const price1 = formatUnits(amountsOut1[1], 18);

    // Get prices from DEX2
    const amountsOut2 = await dex2Router.getAmountsOut(amountIn, [tokenA, tokenB]);
    const price2 = formatUnits(amountsOut2[1], 18);

    if (price1 !== price2) {
      const buyOnName = price1 < price2 ? 'DEX 1' : 'DEX 2';
      const sellOnName = price1 < price2 ? 'DEX 2' : 'DEX 1';
      const buyPrice = Math.min(price1, price2);
      const sellPrice = Math.max(price1, price2);
      const profit = sellPrice - buyPrice;

      return {
        buyOn: buyOnName,
        sellOn: sellOnName,
        buyPrice,
        sellPrice,
        profit,
        potentialGain: `${((profit / buyPrice) * 100).toFixed(2)}%`,
      };
    }

    return null;
  }

  async start() {
    console.log('Arbitrage bot started...');
    setInterval(async () => {
      const opportunity = await this.findOpportunities();
      if (opportunity) {
        console.log('Arbitrage opportunity found:', opportunity);
        // Execute trade logic will be added here
      }
    }, 30000); // Check for opportunities every 30 seconds
  }
}

module.exports = ArbitrageBot;
