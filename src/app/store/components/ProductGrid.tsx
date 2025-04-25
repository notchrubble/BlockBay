import React from "react";
import ProductCard, { ProductItem } from "./ProductCard";

interface ProductGridProps {
  products: ProductItem[];
  onBuyProduct: (product: ProductItem) => void;
  onBidProduct: (product: ProductItem) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onBuyProduct,
  onBidProduct,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuy={onBuyProduct}
            onBid={onBidProduct}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No products found. Try changing filters or add a new item.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
