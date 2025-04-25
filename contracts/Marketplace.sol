// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    event ItemListed(address indexed seller, uint indexed id, string name, uint256 price, bool isAuction);
    event BidPlaced(uint indexed productId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint indexed productId, address indexed winner, uint256 amount);
    event ItemSold(uint indexed productId, address indexed buyer, uint256 amount);

    struct Product {
        uint id;
        address seller;
        string name;
        string description;
        string category;
        string image;
        uint256 price; // in wei (or current highest bid for auctions)
        bool isAuction;
        uint256 endTime; // for auction only
        address highestBidder; // for auction only
        bool sold;
    }

    mapping(uint => mapping(address => uint256)) public bids; // productId => bidder => bid amount
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
            endTime: 0,
            highestBidder: address(0),
            sold: false
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
            endTime: endTime,
            highestBidder: address(0),
            sold: false
        }));

        emit ItemListed(msg.sender, productCount, name, startingBid, true);
        productCount++;
    }

    function placeBid(uint productId) external payable {
        require(productId < productCount, "Product does not exist");
        Product storage product = products[productId];
        
        require(product.isAuction, "Product is not an auction");
        require(block.timestamp < product.endTime, "Auction has ended");
        require(!product.sold, "Item has been sold");
        require(msg.sender != product.seller, "Seller cannot bid on their own item");
        require(msg.value > product.price, "Bid must be higher than current price");
        
        // Return previous bid to previous highest bidder if exists
        if (product.highestBidder != address(0)) {
            payable(product.highestBidder).transfer(product.price);
        }
        
        // Update product with new highest bid
        product.price = msg.value;
        product.highestBidder = msg.sender;
        
        emit BidPlaced(productId, msg.sender, msg.value);
    }
    
    function endAuction(uint productId) external {
        require(productId < productCount, "Product does not exist");
        Product storage product = products[productId];
        
        require(product.isAuction, "Product is not an auction");
        require(block.timestamp >= product.endTime, "Auction has not ended yet");
        require(!product.sold, "Auction already ended");
        
        product.sold = true;
        
        // If there was at least one bid
        if (product.highestBidder != address(0)) {
            payable(product.seller).transfer(product.price);
            emit AuctionEnded(productId, product.highestBidder, product.price);
        }
    }

    function buyItem(uint productId) external payable {
        require(productId < productCount, "Product does not exist");
        Product storage product = products[productId];
        
        require(!product.isAuction, "Cannot buy auction item");
        require(!product.sold, "Item already sold");
        require(msg.value == product.price, "Please send the exact price");
        
        product.sold = true;
        payable(product.seller).transfer(msg.value);
        
        emit ItemSold(productId, msg.sender, msg.value);
    }

    function getAllProducts() public view returns (Product[] memory) {
        return products;
    }

    function faucet() external {
        require(address(this).balance >= 1 ether, "Faucet empty");
        payable(msg.sender).transfer(1 ether);
    }
}