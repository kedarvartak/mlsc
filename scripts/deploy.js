const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const PokemonCards = await hre.ethers.getContractFactory("PokemonCards");
  console.log("Deploying PokemonCards...");
  
  const pokemonCards = await PokemonCards.deploy();
  await pokemonCards.waitForDeployment();
  
  const address = await pokemonCards.getAddress();
  console.log("PokemonCards deployed to:", address);

  const config = {
    address,
    network: hre.network.name
  };
  
  fs.writeFileSync(
    './src/contracts/address.json',
    JSON.stringify(config, null, 2)
  );

  console.log("Contract address saved to src/contracts/address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 