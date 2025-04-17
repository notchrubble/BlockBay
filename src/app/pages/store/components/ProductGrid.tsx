import React from 'react';
import ProductCard, { ProductItem } from './ProductCard';

interface ProductGridProps {
  products: ProductItem[];
  onBuyProduct: (product: ProductItem) => void;
  onBidProduct: (product: ProductItem, amount: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onBuyProduct, 
  onBidProduct 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onBuy={onBuyProduct}
          onBid={onBidProduct}
        />
      ))}
    </div>
  );
};

export default ProductGrid;