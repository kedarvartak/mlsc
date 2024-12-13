const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const ElementalCard = await hre.ethers.getContractFactory("ElementalCard");
  console.log("Deploying ElementalCard...");
  
  const elementalCard = await ElementalCard.deploy();
  await elementalCard.waitForDeployment();
  
  const address = await elementalCard.getAddress();
  console.log("ElementalCard deployed to:", address);

  // Save the contract address to a file
  const config = {
    address,
    network: hre.network.name
  };
  
  fs.writeFileSync(
    './src/contracts/address.json',
    JSON.stringify(config, null, 2)
  );

  console.log("Contract address saved to src/contracts/address.json");

  // Verify deployment
  const code = await hre.ethers.provider.getCode(address);
  console.log("Contract code length:", code.length);
  
  if (code === '0x') {
    throw new Error('Contract deployment failed - no code at address');
  }

  // Now get the contract name and symbol
  const name = await elementalCard.name();
  const symbol = await elementalCard.symbol();
  
  console.log("Contract name:", name);
  console.log("Contract symbol:", symbol);
  console.log("Contract deployment verified!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 