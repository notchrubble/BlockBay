// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    event ItemListed(address indexed seller, uint indexed id, string name, uint256 price, bool isAuction);

    event Bought(address indexed buyer, uint256 amount);
    event Faucet(address indexed receiver, uint256 amount);

    struct Product {
        uint id;
        address seller;
        string name;
        string description;
        string category;
        string image;
        uint256 price; // in wei
        bool isAuction;
        uint256 endTime; // for auction only
    }

    Product[] public products;
    uint public productCount;

    // Allow the contract to receive ETH
    receive() external payable {}

    // No-arg constructor but payable so we can seed initial balance
    constructor() payable {}
    function listItem(
        string memory name,
        string memory description,
        string memory category,
        string memory image,
        uint256 price
    ) public {
        require(price > 0, "Price must be greater than 0");

        products.push(Product({
            id: productCount,
            seller: msg.sender,
            name: name,
            description: description,
            category: category,
            image: image,
            price: price,
            isAuction: false,
            endTime: 0
        }));

        emit ItemListed(msg.sender, productCount, name, price, false);
        productCount++;
    }

    function listAuctionItem(
        string memory name,
        string memory description,
        string memory category,
        string memory image,
        uint256 startingBid,
        uint256 endTime
    ) public {
        require(startingBid > 0, "Starting bid must be greater than 0");
        require(endTime > block.timestamp, "End time must be in the future");

        products.push(Product({
            id: productCount,
            seller: msg.sender,
            name: name,
            description: description,
            category: category,
            image: image,
            price: startingBid,
            isAuction: true,
            endTime: endTime
        }));

        emit ItemListed(msg.sender, productCount, name, startingBid, true);
        productCount++;
    }

     function getAllProducts() public view returns (Product[] memory) {
        return products;
    }

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
