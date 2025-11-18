
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

const { INFURA_PROJECT_ID } = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: `https://base-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      }
    }
  }
};
