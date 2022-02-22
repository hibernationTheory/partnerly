//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Partnership02 {
    string private deploymentMessage = "Contract is deployed";
    uint256 public partnerAmount = 2;
    address[] public addresses;

    constructor(address[] memory _addresses) {
        require(
            _addresses.length == partnerAmount,
            "You can't have more than 2 partners"
        );

        addresses = _addresses;

        console.log(deploymentMessage);
    }
}
