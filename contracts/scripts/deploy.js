const hre = require("hardhat");

/**
 * Deploy CipherNumbers contract to Zama FHEVM
 * 
 * Usage:
 * npx hardhat run scripts/deploy.js --network zama-devnet
 */
async function main() {
  console.log("Deploying CipherNumbers contract...");

  const CipherNumbers = await hre.ethers.getContractFactory("CipherNumbers");
  const cipherNumbers = await CipherNumbers.deploy();

  await cipherNumbers.deployed();

  console.log("✅ CipherNumbers deployed to:", cipherNumbers.address);
  console.log("\nAdd this to your .env file:");
  console.log(`CONTRACT_ADDRESS=${cipherNumbers.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
