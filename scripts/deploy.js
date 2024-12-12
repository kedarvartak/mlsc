const hre = require("hardhat");

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

  // Verify deployment
  const code = await hre.ethers.provider.getCode(address);
  console.log("Contract code length:", code.length);
  
  if (code === '0x') {
    throw new Error('Contract deployment failed - no code at address');
  }

  // Verify contract is working
  const name = await elementalCard.name();
  const symbol = await elementalCard.symbol();
  console.log("Contract name:", name);
  console.log("Contract symbol:", symbol);

  console.log("Contract deployment verified!");

  // Add a delay to ensure the node has processed the deployment
  await new Promise(resolve => setTimeout(resolve, 5000));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 