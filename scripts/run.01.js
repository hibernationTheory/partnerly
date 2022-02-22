const hre = require("hardhat");

async function main() {
  await hre.run("compile");

  const Contract = await hre.ethers.getContractFactory("Partnership01");
  const contract = await Contract.deploy();

  await contract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
