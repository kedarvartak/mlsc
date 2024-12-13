require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const LINEA_RPC_URL = "https://rpc.sepolia.linea.build";

module.exports = {
  solidity: "0.8.28",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    linea: {
      url: LINEA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 59141,
    }
  }
};