const { expect } = require("chai");

describe("Partnership", () => {
  it("can be deployed by providing at least two addresses and equal amounts of split ratios on initialization", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership07");

    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];

    const splitRatios = [1, 1];

    const contract = await Contract.deploy(addresses, splitRatios);
    await contract.deployed();
  });

  it("can NOT be deployed when the split ratios are not equivalent to the address amount", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership07");

    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];

    const splitRatios = [1, 1, 1];

    await expect(Contract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "The address amount and the split ratio amount should be equal"
    );
  });

  it("can NOT be deployed when the the address amount is less than two", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership07");

    const [owner] = await hre.ethers.getSigners();
    const addresses = [owner.address];

    const splitRatios = [1];

    await expect(Contract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "More than one address should be provided to establish a partnership"
    );
  });

  it("can NOT be deployed when any of the split ratios is less than one", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership07");

    const [owner, person1] = await hre.ethers.getSigners();
    const addresses = [owner.address, person1.address];

    const splitRatios = [1, 0];

    await expect(Contract.deploy(addresses, splitRatios)).to.be.revertedWith(
      "Split ratio can not be 0 or less"
    );
  });

  it("can receive transactions in Ether", async () => {
    const Contract = await ethers.getContractFactory("Partnership07");

    const [owner, person1] = await hre.ethers.getSigners();

    const addresses = [owner.address, person1.address];
    const splitRatios = [1, 1];

    const contract = await Contract.deploy(addresses, splitRatios);
    await contract.deployed();

    // send ether to contract
    await owner.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("1.0"),
    });
  });

  it("has a balance that increases after receiving a transaction", async () => {
    const Contract = await ethers.getContractFactory("Partnership07");

    const [owner, person1, person2] = await hre.ethers.getSigners();

    const addresses = [person1.address, person2.address];
    const splitRatios = [1, 1];

    const contract = await Contract.deploy(addresses, splitRatios);
    await contract.deployed();

    expect(await contract.getBalance()).to.equal(0);

    const value = ethers.utils.parseEther("1.0");

    // send ether to contract
    await owner.sendTransaction({
      to: contract.address,
      value,
    });

    expect(await contract.getBalance()).to.equal(value);
  });

  describe("withdraw", () => {
    it("can be called if the contract balance is more than 0", async () => {
      const Contract = await ethers.getContractFactory("Partnership07");

      const [owner, person1] = await hre.ethers.getSigners();

      const addresses = [owner.address, person1.address];
      const splitRatios = [1, 1];

      expect(addresses.length).to.equal(splitRatios.length);

      const contract = await Contract.deploy(addresses, splitRatios);
      await contract.deployed();

      // send ether to contract
      await owner.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("5.0"),
      });

      expect(await contract.getBalance()).to.not.equal(0);

      await contract.withdraw();
    });

    it("can NOT be called if the contract balance is less than or equal to 0", async () => {
      const Contract = await ethers.getContractFactory("Partnership07");

      const [owner, person1] = await hre.ethers.getSigners();

      const addresses = [owner.address, person1.address];
      const splitRatios = [1, 1];

      expect(addresses.length).to.equal(splitRatios.length);

      const contract = await Contract.deploy(addresses, splitRatios);
      await contract.deployed();

      expect(await contract.getBalance()).to.equal(0);

      await expect(contract.withdraw()).to.be.revertedWith(
        "Insufficient balance"
      );
    });

    it("can NOT be called when the total split ratio is greater than the contract balance", async () => {
      const Contract = await ethers.getContractFactory("Partnership07");

      const [owner, person1] = await hre.ethers.getSigners();

      const addresses = [owner.address, person1.address];
      const splitRatios = [10, 10];

      expect(addresses.length).to.equal(splitRatios.length);

      const contract = await Contract.deploy(addresses, splitRatios);
      await contract.deployed();

      expect(await contract.getBalance()).to.equal(0);

      // send ether to contract
      await owner.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseEther("0.00000000000000001"),
      });

      expect(await contract.getBalance()).to.equal(10);

      await expect(contract.withdraw()).to.be.revertedWith(
        "Balance should be greater than the total split ratios"
      );
    });
  });
});
