
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ArbitrageBalancer (compile-only test)', function(){
  it('deploys', async function(){
    const [owner] = await ethers.getSigners();
    const vault = owner.address; // dummy
    const Arb = await ethers.getContractFactory('ArbitrageBalancer');
    const arb = await Arb.deploy(vault);
    await arb.waitForDeployment();
    expect(await arb.owner()).to.equal(owner.address);
  });
});
