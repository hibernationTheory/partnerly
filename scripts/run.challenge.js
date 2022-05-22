const hre = require("hardhat");

async function main() {
  await hre.run("compile");
  const [owner] = await hre.ethers.getSigners();

  const Contract = await hre.ethers.getContractFactory(
    "Challenge"
  );
  const contract = await Contract.deploy();

  await contract.deployed();

  await owner.sendTransaction({
    to: contract.address,
    value: ethers.utils.parseEther("5000.0"),
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
