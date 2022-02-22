const hre = require("hardhat");

async function main() {
  await hre.run("compile");
  const [owner, person1, person2] = await hre.ethers.getSigners();
  const addresses = [person1.address, person2.address];
  const splitRatios = [4, 1];

  const Contract = await hre.ethers.getContractFactory("Partnership");
  const provider = hre.ethers.provider;
  const contract = await Contract.deploy(addresses, splitRatios);

  await contract.deployed();

  let balance1 = await provider.getBalance(person1.address);
  console.log(`The balance for the person1 is: ${balance1}`);

  let balance2 = await provider.getBalance(person2.address);
  console.log(`The balance for the person2 is: ${balance2}`);

  let contractBalance = await contract.getBalance();
  console.log(`The balance in the contract is: ${contractBalance}`);

  await owner.sendTransaction({
    to: contract.address,
    value: ethers.utils.parseEther("5000.0"),
  });

  console.log(
    `The balance in the contract after receiving funds is: ${await contract.getBalance()}`
  );

  await contract.withdraw();

  console.log(
    `The balance in the contract after withdrawal is: ${await contract.getBalance()}`
  );

  balance1 = await provider.getBalance(person1.address);
  console.log(`The new balance for the person1 is:${balance1}`);

  balance2 = await provider.getBalance(person2.address);
  console.log(`The balance for the person2 is: ${balance2}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
