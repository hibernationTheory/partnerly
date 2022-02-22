const hre = require("hardhat");

async function main() {
  await hre.run("compile");
  const [owner, person1] = await hre.ethers.getSigners();
  const addresses = [owner.address, person1.address];
  const splitRatios = [1, 1];

  const Contract = await hre.ethers.getContractFactory("Partnership03");
  const contract = await Contract.deploy(addresses, splitRatios);

  await contract.deployed();

  await console.log(await contract.addresses(0));
  await console.log(await contract.splitRatios(0));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
