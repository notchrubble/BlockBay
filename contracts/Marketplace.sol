// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    event Bought(address indexed buyer, uint256 amount);
    event Faucet(address indexed receiver, uint256 amount);

    // Allow the contract to receive ETH
    receive() external payable {}

    // No-arg constructor but payable so we can seed initial balance
    constructor() payable {}

    function buy() external payable {
        require(msg.value == 0.1 ether, "Please send exactly 0.1 ETH");
        emit Bought(msg.sender, msg.value);
    }

    function faucet() external {
        require(address(this).balance >= 1 ether, "Faucet empty");
        payable(msg.sender).transfer(1 ether);
        emit Faucet(msg.sender, 1 ether);
    }
}
