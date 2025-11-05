
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with', deployer.address);

  // Deploy MockERC20
  const MockERC20 = await ethers.getContractFactory('MockERC20');
  const mockERC20 = await MockERC20.deploy('Mock Token', 'MT');
  await mockERC20.deployed();
  console.log('MockERC20 deployed to', mockERC20.address);

  // Deploy MockRouter
  const MockRouter = await ethers.getContractFactory('MockRouter');
  const mockRouter = await MockRouter.deploy();
  await mockRouter.deployed();
  console.log('MockRouter deployed to', mockRouter.address);

  // Deploy UniswapV2TwapOracle
  const UniswapV2TwapOracle = await ethers.getContractFactory('UniswapV2TwapOracle');
  const uniswapV2TwapOracle = await UniswapV2TwapOracle.deploy(mockRouter.address);
  await uniswapV2TwapOracle.deployed();
  console.log('UniswapV2TwapOracle deployed to', uniswapV2TwapOracle.address);

  // Deploy ArbitrageBalancer
  const vaultAddress = process.env.VAULT_ADDRESS || '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
  const ArbitrageBalancer = await ethers.getContractFactory('ArbitrageBalancer');
  const arbitrageBalancer = await ArbitrageBalancer.deploy(vaultAddress);
  await arbitrageBalancer.deployed();
  console.log('ArbitrageBalancer deployed to', arbitrageBalancer.address);

  // Link to frontend
  const fs = require('fs');
  const contractsDir = __dirname + '/../../frontend/src/contracts';

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + '/contract-addresses.json',
    JSON.stringify({
      ArbitrageBalancer: arbitrageBalancer.address,
      MockERC20: mockERC20.address,
      MockRouter: mockRouter.address,
      UniswapV2TwapOracle: uniswapV2TwapOracle.address
    })
  );
}

main().catch((err)=>{
  console.error(err);
  process.exit(1);
});
