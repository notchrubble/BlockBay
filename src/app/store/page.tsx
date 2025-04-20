"use client";

import React, { useState, useEffect } from "react";
import { Web3 } from "web3";
import ProductGrid from "./components/ProductGrid";
import { ProductItem } from "./components/ProductCard";
import {
  getProducts,
  removeProduct,
  initializeProducts,
  updateProduct,
} from "../Utils/productStorage";

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [filter, setFilter] = useState<"all" | "fixed" | "auction">("all");

  useEffect(() => {
    // Initialize products in localStorage
    initializeProducts(); // change to initializeProducts(true) to force refresh the local storage cache for the products
    loadProducts();
    initWeb3();
  }, []);

  const loadProducts = () => {
    const allProducts = getProducts();
    let filteredProducts;

    switch (filter) {
      case "fixed":
        filteredProducts = allProducts.filter((p) => !p.isAuction);
        break;
      case "auction":
        filteredProducts = allProducts.filter((p) => p.isAuction);
        break;
      default:
        filteredProducts = allProducts;
    }

    setProducts(filteredProducts);
  };

  const initWeb3 = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Set the first account as the current account
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }

        // Set up event listeners for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
            setIsConnected(false);
          }
        });

        // Handle chain changes
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      } catch (error) {
        console.error(
          "User denied account access or there was an error:",
          error
        );
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const handleBuyProduct = async (product: ProductItem) => {
    if (!web3 || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      console.log(`Buying product: ${product.name} for ${product.price} wei`);

      // Simulate the transaction
      //todo: change logic to use smart contract
      const transactionObj = {
        from: account,
        to: product.seller,
        value: product.price,
      };

      const confirmation = confirm(
        `This will send ${web3.utils.fromWei(
          product.price,
          "ether"
        )} ETH from your account to ${product.seller}. Continue?`
      );

      if (confirmation) {
        try {
          // Send transaction using MetaMask
          const receipt = await web3.eth.sendTransaction(transactionObj);
          console.log("Transaction successful:", receipt);

          // Remove the product from localStorage since it's been purchased
          const removed = removeProduct(product.id);
          if (removed) {
            alert(`Successfully purchased ${product.name}!`);
            // Reload products to update the UI
            loadProducts();
          }
        } catch (error) {
          console.error("Transaction failed:", error);
          alert("Transaction failed. See console for details.");
        }
      }
    } catch (error) {
      console.error("Error buying product:", error);
      alert("Error during purchase. See console for details.");
    }
  };

  const handleBidProduct = async (product: ProductItem, amount: string) => {
    if (!web3 || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    //todo: change logic to use smart contract
    const bidAmount = prompt("Enter bid amount in ETH:", "");
    if (!bidAmount) return;

    try {
      const bidAmountWei = web3.utils.toWei(bidAmount, "ether");

      // Check if bid is higher than current price
      if (BigInt(bidAmountWei) <= BigInt(product.price)) {
        alert("Your bid must be higher than the current price!");
        return;
      }

      console.log(
        `Bidding on product: ${product.name} with ${bidAmount} ETH (${bidAmountWei} wei)`
      );

      // Simulate the transaction
      //todo: change logic to use smart contract
      const transactionObj = {
        from: account,
        to: product.seller,
        value: web3.utils.toWei("0.01", "ether"), // Just a small deposit to "lock in" the bid
      };

      const confirmation = confirm(
        `This will place a bid of ${bidAmount} ETH on ${product.name}. Continue?`
      );

      if (confirmation) {
        try {
          // Send transaction using MetaMask
          const receipt = await web3.eth.sendTransaction(transactionObj);
          console.log("Bid transaction successful:", receipt);

          // Update the product price to reflect the new bid
          const updatedProduct = {
            ...product,
            price: bidAmountWei,
            lastBidder: account,
          };

          updateProduct(updatedProduct);
          alert(
            `Successfully placed bid of ${bidAmount} ETH on ${product.name}!`
          );
          loadProducts();
        } catch (error) {
          console.error("Bid transaction failed:", error);
          alert("Bid transaction failed. See console for details.");
        }
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Error placing bid. See console for details.");
    }
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        initWeb3();
      } catch (error) {
        console.error("Failed to connect to wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this dApp.");
    }
  };

  const handleFilterChange = (newFilter: "all" | "fixed" | "auction") => {
    setFilter(newFilter);

    const allProducts = getProducts();
    let filteredProducts;

    switch (newFilter) {
      case "fixed":
        filteredProducts = allProducts.filter((p) => !p.isAuction);
        break;
      case "auction":
        filteredProducts = allProducts.filter((p) => p.isAuction);
        break;
      default:
        filteredProducts = allProducts;
    }

    setProducts(filteredProducts);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <div>
          {isConnected ? (
            <div className="flex items-center">
              <span className="badge badge-success mr-2">Connected</span>
              <span className="text-sm truncate max-w-xs">{account}</span>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${
              filter === "all" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => handleFilterChange("all")}
          >
            All Items
          </button>
          <button
            className={`btn btn-sm ${
              filter === "fixed" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => handleFilterChange("fixed")}
          >
            Fixed Price
          </button>
          <button
            className={`btn btn-sm ${
              filter === "auction" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => handleFilterChange("auction")}
          >
            Auctions
          </button>
        </div>
      </div>

      <ProductGrid
        products={products}
        onBuyProduct={handleBuyProduct}
        onBidProduct={handleBidProduct}
      />
    </div>
  );
};

export default ProductsPage;
