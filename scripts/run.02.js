const hre = require("hardhat");

async function main() {
  await hre.run("compile");
  const [owner, person1] = await hre.ethers.getSigners();
  const addresses = [owner.address, person1.address];

  const Contract = await hre.ethers.getContractFactory("Partnership02");
  const contract = await Contract.deploy(addresses);

  await contract.deployed();

  await console.log(await contract.partnerAmount());
  await console.log(await contract.addresses(0));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
