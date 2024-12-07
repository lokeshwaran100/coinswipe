import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const CoinSwipe = await ethers.getContractFactory("CoinSwipe");
  const coinSwipe = await CoinSwipe.deploy(
    100, // Example fee percentage (1%)
    "0xYourFeeCollectionAddress", // Example fee collection address
    "0xYourUniswapRouterAddress" // Example Uniswap router address
  );
  console.log("CoinSwipe contract deployed to:", coinSwipe.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
