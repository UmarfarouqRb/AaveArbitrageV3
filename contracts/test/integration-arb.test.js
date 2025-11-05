const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Arbitrage integration test with mocks', function(){
  it('executes receiveFlashLoan using mock routers and yields profit', async function(){
    const [deployer] = await ethers.getSigners();

    // Deploy Mock ERC20 tokens
    const MockERC = await ethers.getContractFactory('MockERC20');
    const tokenA = await MockERC.deploy('TokenA','TKA', ethers.parseUnits('1000000',18));
    await tokenA.waitForDeployment();
    const tokenB = await MockERC.deploy('TokenB','TKB', ethers.parseUnits('1000000',18));
    await tokenB.waitForDeployment();

    // Deploy mock routers:
    // Router A will convert 1 TKA -> 2 TKB (multiplier 2)
    // Router B will convert 1 TKB -> 1.6 TKA (multiplier 8/5)
    const MockRouter = await ethers.getContractFactory('MockRouterHardhat');
    const routerA = await MockRouter.deploy(2,1); // x2
    await routerA.waitForDeployment();
    const routerB = await MockRouter.deploy(8,5); // x1.6
    await routerB.waitForDeployment();

    // Deploy a dummy Vault address (use deployer as vault)
    const vaultAddr = deployer.address;

    // Deploy ArbitrageBalancer
    const Arb = await ethers.getContractFactory('ArbitrageBalancer');
    const arb = await Arb.deploy(vaultAddr);
    await arb.waitForDeployment();

    const tokenAAddress = await tokenA.getAddress();
    const tokenBAddress = await tokenB.getAddress();
    const routerAAddress = await routerA.getAddress();
    const routerBAddress = await routerB.getAddress();
    const arbAddress = await arb.getAddress();

    // Fund the mock routers
    await tokenA.mint(routerAAddress, ethers.parseUnits('100',18));
    await tokenB.mint(routerAAddress, ethers.parseUnits('100',18));
    await tokenA.mint(routerBAddress, ethers.parseUnits('100',18));
    await tokenB.mint(routerBAddress, ethers.parseUnits('100',18));

    // Prepare tokens/amounts as if vault sent them
    const tokens = [tokenAAddress];
    const amounts = [ethers.parseUnits('10',18)];
    const feeAmounts = [ethers.parseUnits('0',18)];

    // Prepare userData: inputToken, middleToken, outputToken, routers, paths, minOutsSecondSwap, minTwap
    const routers = [routerAAddress, routerBAddress];
    const paths = [[tokenAAddress, tokenBAddress], [tokenBAddress, tokenAAddress]];
    const minOutsSecondSwap = 1;
    const minTwap = 0;

    const abiCoder = new ethers.AbiCoder();
    const userData = abiCoder.encode(
      ['address','address','address','address[]','address[][]','uint256','uint256'],
      [tokenAAddress, tokenBAddress, tokenAAddress, routers, paths, minOutsSecondSwap, minTwap]
    );

    // Call receiveFlashLoan directly as if vault (vault == deployer address)
    // But first, mint tokens to the contract so it has the loaned funds
    await tokenA.mint(arbAddress, ethers.parseUnits('10',18));

    // Now call
    const tx = await arb.receiveFlashLoan(tokens, amounts, feeAmounts, userData);
    const receipt = await tx.wait();

    const flashLoanExecutedEvent = receipt.logs
        .map((log) => {
            try {
                return arb.interface.parseLog(log);
            } catch (e) {
                return null;
            }
        })
        .find((event) => event && event.name === "FlashLoanExecuted");

    expect(flashLoanExecutedEvent).to.not.be.undefined;
    const net = flashLoanExecutedEvent.args.netProfit;
    // net should be > 0 (since 10 *2 *1.6 = 32 -> repay 10 -> profit 22)
    expect(net).to.be.gt(0);
  });
});