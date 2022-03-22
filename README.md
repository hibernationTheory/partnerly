# Partnerly

Imagine building a project with someone. You are planning on monetizing this project by accepting payments in cryptocurrency. You would want to distribute the earnings fairly in between yourselves. [Partnerly.co](https://www.partnerly.co/) helps you do this. It is an app that helps you create a smart contract on the blockchain that can distribute the collected payments between two (or more) parties in a predetermined split ratio.

If you would like to know more about how I built [Partnerly](https://www.partnerly.co) check out [A Practical Introduction to Developing Web3 Apps Using Solidity and React
](https://leanpub.com/develop-web3-apps-using-solidity-and-react/).

This repo contains the code for the smart contract as well as a sample code for building the front end.

To initialize the repo, run:

```
npm install
```

To run the contract, run:

```
npx hardhat run scripts/run.js
```

To test the contract, run:

```
npx hardhat test test/Partnership.js
```

You can find the contract at: `contracts/Partnership.sol`. Other files in the same folder are the intermediary steps taken to build the contract.
