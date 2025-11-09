const ArbitrageBot = require('./arbitrageBot');

const arbitrageParams = {
  tokenA: '0x5f4eC3Df9cbd43714FE27404523b088303d495bA', // LINK
  tokenB: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  dex1: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',   // Uniswap V2
  dex2: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',   // Sushiswap
};

const networkConfig = {
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', // Replace with your Infura project ID
  chainName: 'mainnet',
};

const bot = new ArbitrageBot(arbitrageParams, networkConfig);
bot.start();
