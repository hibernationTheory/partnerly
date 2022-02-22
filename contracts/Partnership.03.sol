//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Partnership03 {
    address[] public addresses;
    uint256[] public splitRatios;

    constructor(address[] memory _addresses, uint256[] memory _splitRatios) {
        require(
            _addresses.length > 1,
            "More than one address should be provided to establish a partnership"
        );

        require(
            _splitRatios.length == _addresses.length,
            "The address amount and the split ratio amount should be equal"
        );
        addresses = _addresses;
        splitRatios = _splitRatios;
        console.log("Contract is Deployed");
    }
}
