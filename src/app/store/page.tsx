"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Web3 } from "web3";
import ProductGrid from "./components/ProductGrid";
import { ProductItem } from "./components/ProductCard";
import {
  getProducts,
  removeProduct,
  initializeProducts,
  updateProduct,
} from "../Utils/productStorage";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [filter, setFilter] = useState<"all" | "fixed" | "auction">("all");

  // Shipping form state
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    initializeProducts();
    loadProducts();
    initWeb3();

    const handleStorageUpdate = () => loadProducts();
    window.addEventListener("products-updated", handleStorageUpdate);
    return () => window.removeEventListener("products-updated", handleStorageUpdate);
  }, []);

  const loadProducts = () => {
    const allProducts = getProducts();
    let filteredProducts;
    switch (filter) {
      case "fixed": filteredProducts = allProducts.filter((p) => !p.isAuction); break;
      case "auction": filteredProducts = allProducts.filter((p) => p.isAuction); break;
      default: filteredProducts = allProducts;
    }
    setProducts(filteredProducts);
  };

  const initWeb3 = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        if (accounts.length > 0) {
          setAccount(accounts[0]); setIsConnected(true);
        }
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) setAccount(accounts[0]);
          else { setAccount(null); setIsConnected(false); }
        });
        window.ethereum.on("chainChanged", () => window.location.reload());
      } catch (error) {
        console.error("Web3 init error:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const processBuyProduct = async (product: ProductItem, shippingData: typeof shippingInfo) => {
    if (!web3 || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    // TODO: send shippingData to backend
    console.log(`Purchasing ${product.name} with shipping:`, shippingData);

    try {
      const tx = { from: account, to: product.seller, value: product.price };
      const confirmMsg = `This will send ${web3.utils.fromWei(product.price, "ether")} ETH to ${product.seller}. Continue?`;
      if (confirm(confirmMsg)) {
        const receipt = await web3.eth.sendTransaction(tx);
        console.log("Transaction success:", receipt);
        if (removeProduct(product.id)) {
          alert(`Successfully purchased ${product.name}!`);
          loadProducts();
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Transaction failed. See console for details.");
    }
  };

  const handleBuyClick = (product: ProductItem) => {
    setSelectedProduct(product);
    setShowShippingForm(true);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitShipping = (e: FormEvent) => {
    e.preventDefault();
    if (selectedProduct) processBuyProduct(selectedProduct, shippingInfo);
    setShippingInfo({ name: "", address1: "", address2: "", city: "", zip: "" });
    setSelectedProduct(null);
    setShowShippingForm(false);
  };

  const handleCloseShippingForm = () => {
    setShowShippingForm(false);
    setSelectedProduct(null);
    setShippingInfo({ name: "", address1: "", address2: "", city: "", zip: "" });
  };

  const handleBidProduct = async (product: ProductItem, amount: string) => {
    // existing bid logic...
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try { await window.ethereum.request({ method: "eth_requestAccounts" }); initWeb3(); }
      catch (error) { console.error("Connect wallet error:", error); }
    } else alert("MetaMask is not installed.");
  };

  const handleFilterChange = (newFilter: "all" | "fixed" | "auction") => {
    setFilter(newFilter);
    loadProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Wallet */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <div>
          {isConnected ? (
            <div className="flex items-center">
              <span className="badge badge-success mr-2">Connected</span>
              <span className="text-sm truncate max-w-xs">{account}</span>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "fixed", "auction"] as const).map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}
            onClick={() => handleFilterChange(f)}
          >
            {f === "all" ? "All Items" : f === "fixed" ? "Fixed Price" : "Auctions"}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} onBuyProduct={handleBuyClick} onBidProduct={handleBidProduct} />

      {/* Shipping Modal */}
      {showShippingForm && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmitShipping}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleShippingChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  name="address1"
                  value={shippingInfo.address1}
                  onChange={handleShippingChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="address2"
                  value={shippingInfo.address2}
                  onChange={handleShippingChange}
                  className="input input-bordered w-full"
                  placeholder="Apt, Suite, etc. (optional)"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={shippingInfo.zip}
                  onChange={handleShippingChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseShippingForm} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit & Buy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
