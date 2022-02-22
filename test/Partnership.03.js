const { expect } = require("chai");

describe("Partnership", () => {
  it("can be deployed by providing at least two addresses and equal amounts of split ratios on initialization", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership03");

    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];

    const splitRatios = [1, 1];

    const contract = await Contract.deploy(addresses, splitRatios);
    await contract.deployed();
  });

  it("can NOT be deployed when the split ratios are not equivalent to the address amount", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership03");

    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];

    const splitRatios = [1, 1, 1];

    await expect(Contract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "The address amount and the split ratio amount should be equal"
    );
  });

  it("can NOT be deployed when the the address amount is less than two", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership03");

    const [owner] = await hre.ethers.getSigners();
    const addresses = [owner.address];

    const splitRatios = [1];

    await expect(Contract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "More than one address should be provided to establish a partnership"
    );
  });
});
