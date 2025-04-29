import React from "react";
import { formatEther } from "ethers";

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: string; // Price in wei
  seller: string; // Ethereum address
  imageUrl: string;
  isAuction: boolean;
  endTime?: number;
  lastBidder?: string; // Address of the last bidder
}

interface ProductCardProps {
  product: ProductItem;
  onBuy: (product: ProductItem) => void;
  onBid: (product: ProductItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy, onBid }) => {
  const priceInEth = formatEther(product.price);

  const isAuctionActive =
    product.isAuction &&
    product.endTime &&
    product.endTime > Math.floor(Date.now() / 1000);

  // Calculate time remaining for auction
  const getTimeRemaining = () => {
    if (!product.endTime) return null;
    
    const secondsRemaining = product.endTime - Math.floor(Date.now() / 1000);
    if (secondsRemaining <= 0) return "Ended";
    
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m ${secondsRemaining % 60}s`;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure className="px-4 pt-4">
        <div className="relative w-full h-48">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="rounded-xl w-full h-full object-cover"
          />
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{product.name}</h2>
        <p className="text-sm text-gray-400 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center mt-2">
          <div className="badge badge-primary">
            {product.isAuction ? "Auction" : "Fixed Price"}
          </div>
          {product.isAuction && product.endTime && (
            <div className={`badge ml-2 ${isAuctionActive ? "badge-secondary" : "badge-error"}`}>
              {isAuctionActive ? getTimeRemaining() : "Ended"}
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-primary font-semibold">
            {product.isAuction ? `Current bid: ${priceInEth} ETH` : `${priceInEth} ETH`}
          </p>
          <p className="text-xs text-gray-500 truncate">
            Seller: {product.seller}
          </p>
          {product.isAuction && product.lastBidder && (
            <p className="text-xs text-gray-500 truncate">
              Last bidder: {product.lastBidder}
            </p>
          )}
        </div>
        <div className="card-actions justify-end mt-2">
          {product.isAuction ? (
            <button
              className="btn btn-primary btn-sm"
              disabled={!isAuctionActive}
              onClick={() => onBid(product)}
            >
              Place Bid
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onBuy(product)}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
