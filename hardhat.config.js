require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337
    },
    lineaSepolia: {
      url: "https://rpc.sepolia.linea.build",
      accounts: [process.env.PRIVATE_KEY],
    }
  },
};
