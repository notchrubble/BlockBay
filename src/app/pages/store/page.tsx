'use client';

import React, { useState, useEffect } from 'react';
import { Web3 } from 'web3';
import ProductGrid from '../store/components/ProductGrid';
import { ProductItem } from '../store/components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Mock data for product listings
  const mockProducts: ProductItem[] = [
    {
      id: '1',
      name: 'Vintage Watch',
      description: 'A beautiful vintage timepiece with leather strap and gold accents.',
      price: '500000000000000000', // 0.5 ETH in wei
      seller: '0x123456789abcdef...',
      imageUrl: 'https://picsum.photos/200', //picsum.photos is a placeholder (replace this later)
      isAuction: false
    },
    {
      id: '2',
      name: 'Gaming Laptop',
      description: 'High-performance gaming laptop with RGB keyboard and powerful graphics.',
      price: '2000000000000000000', // 2 ETH in wei
      seller: '0xabcdef123456789...',
      imageUrl: 'https://picsum.photos/200',
      isAuction: false
    },
    {
      id: '3',
      name: 'Diamond Necklace',
      description: 'Elegant diamond necklace with 24K gold chain.',
      price: '1000000000000000000', // 1 ETH in wei
      seller: '0x9876543210abcdef...',
      imageUrl: 'https://picsum.photos/200',
      isAuction: true,
      endTime: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
    },
    {
      id: '4',
      name: 'Antique Vase',
      description: 'Hand-painted ceramic vase from the 18th century.',
      price: '300000000000000000', // 0.3 ETH in wei
      seller: '0xfedcba9876543210...',
      imageUrl: 'https://picsum.photos/200',
      isAuction: true,
      endTime: Math.floor(Date.now() / 1000) + 172800 // 48 hours from now
    },
    {
      id: '5',
      name: 'Electric Guitar',
      description: 'Professional electric guitar with amp and accessories.',
      price: '800000000000000000', // 0.8 ETH in wei
      seller: '0x123abcdef456789...',
      imageUrl: 'https://picsum.photos/200',
      isAuction: false
    },
    {
      id: '6',
      name: 'Mountain Bike',
      description: 'Premium mountain bike with carbon fiber frame and hydraulic brakes.',
      price: '1500000000000000000', // 1.5 ETH in wei
      seller: '0x789abcdef123456...',
      imageUrl: 'https://picsum.photos/200',
      isAuction: false
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setProducts(mockProducts);
    
    // Initialize Web3
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        // Set the first account as the current account
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
        
        // Set up event listeners for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount(null);
            setIsConnected(false);
          }
        });
        
        // Handle chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
        
      } catch (error) {
        console.error("User denied account access or there was an error:", error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const handleBuyProduct = async (product: ProductItem) => {
    if (!web3 || !account) {
      alert('Please connect your wallet first!');
      return;
    }
    
    //todo: interact with smart contract
    console.log(`Buying product: ${product.name} for ${product.price} wei`);
    alert(`This would initiate a purchase transaction for ${product.name}`);
    
  };

  const handleBidProduct = async (product: ProductItem, amount: string) => {
    if (!web3 || !account) {
      alert('Please connect your wallet first!');
      return;
    }
    
    //todo: interact with smart contract
    const bidAmount = prompt('Enter bid amount in ETH:', '');
    if (!bidAmount) return;
    
    const bidAmountWei = web3.utils.toWei(bidAmount, 'ether');
    console.log(`Bidding on product: ${product.name} with ${bidAmount} ETH (${bidAmountWei} wei)`);
    alert(`This would place a bid for ${bidAmount} ETH on ${product.name}`);
  
  };
  
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        initWeb3();
      } catch (error) {
        console.error("Failed to connect to wallet:", error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this dApp.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace Products</h1>
        <div>
          {isConnected ? (
            <div className="flex items-center">
              <span className="badge badge-success mr-2">Connected</span>
              <span className="text-sm truncate max-w-xs">{account}</span>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-sm btn-outline">All Items</button>
          <button className="btn btn-sm btn-outline">Fixed Price</button>
          <button className="btn btn-sm btn-outline">Auctions</button>
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