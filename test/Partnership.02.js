const { expect } = require("chai");

describe("Partnership", () => {
  it("can be deployed by providing two addresses on initialization", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership02");

    const [owner, person1] = await hre.ethers.getSigners();

    const addresses = [owner.address, person1.address];

    const contract = await Contract.deploy(addresses);
    await contract.deployed();
  });

  it("can NOT be deployed when NOT providing addresses on initialization", async () => {
    const Contract = await hre.ethers.getContractFactory("Partnership02");

    let error;
    try {
      const contract = await Contract.deploy();
      await contract.deployed();
    } catch (_error) {
      error = _error;
    } finally {
      expect(error).to.be.ok;
    }
  });
});
