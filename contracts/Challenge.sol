pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Challenge {
    constructor() {
        console.log("Hello World");
    }
    
    receive() external payable {}
}