import React from "react";
import Image from "next/image";
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
}

interface ProductCardProps {
  product: ProductItem;
  onBuy: (product: ProductItem) => void;
  onBid?: (product: ProductItem, amount: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy, onBid }) => {
  const priceInEth = formatEther(product.price);

  const isAuctionActive =
    product.isAuction &&
    product.endTime &&
    product.endTime > Math.floor(Date.now() / 1000);

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure className="px-4 pt-4">
        <div className="relative w-full h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{product.name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center mt-2">
          <div className="badge badge-primary">
            {product.isAuction ? "Auction" : "Fixed Price"}
          </div>
          {product.isAuction && product.endTime && (
            <div className="badge badge-secondary ml-2">
              {isAuctionActive ? "Active" : "Ended"}
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-primary font-semibold">{priceInEth} ETH</p>
          <p className="text-xs text-gray-500 truncate">
            Seller: {product.seller}
          </p>
        </div>
        <div className="card-actions justify-end mt-2">
          {product.isAuction ? (
            <button
              className="btn btn-primary btn-sm"
              disabled={!isAuctionActive}
              onClick={() => onBid && onBid(product, "")}
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
