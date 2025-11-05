const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock ERC20 tokens
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const tokenA = await MockERC20.deploy("TokenA", "TKA", ethers.parseUnits("1000000", 18));
  await tokenA.waitForDeployment();
  const tokenB = await MockERC20.deploy("TokenB", "TKB", ethers.parseUnits("1000000", 18));
  await tokenB.waitForDeployment();

  console.log("TokenA deployed to:", await tokenA.getAddress());
  console.log("TokenB deployed to:", await tokenB.getAddress());

  // Deploy a dummy Vault address (using a random address for now)
  const vaultAddress = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"; // Balancer Vault on Sepolia

  // Deploy ArbitrageBalancer
  const ArbitrageBalancer = await ethers.getContractFactory("ArbitrageBalancer");
  const arbitrageBalancer = await ArbitrageBalancer.deploy(vaultAddress);
  await arbitrageBalancer.waitForDeployment();

  console.log("ArbitrageBalancer deployed to:", await arbitrageBalancer.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
