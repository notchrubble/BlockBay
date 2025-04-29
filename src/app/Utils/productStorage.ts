import { ProductItem } from "../store/components/ProductCard";

const PRODUCTS_STORAGE_KEY = "marketplace_products";

// Initial products to be added to localStorage
const initialProducts: ProductItem[] = [
  {
    id: "1",
    name: "Vintage Watch",
    description:
      "A beautiful vintage timepiece with leather strap and gold accents.",
    price: "500000000000000000", // 0.5 ETH in wei
    seller: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", // note: replace these addresses with valid addresses from the test ganache network (it's gonna be different from mine unless we can somehow share the same ganache network)
    imageUrl:
      "https://images.unsplash.com/photo-1651735060244-781017915251?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // for the future this should link to a local image in the /public folder
    isAuction: false,
  },
  {
    id: "2",
    name: "Gaming Laptop",
    description:
      "High-performance gaming laptop with RGB keyboard and powerful graphics.",
    price: "2000000000000000000", // 2 ETH in wei
    seller: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
    imageUrl:
      "https://images.unsplash.com/photo-1605134513573-384dcf99a44c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isAuction: false,
  },
  {
    id: "3",
    name: "Diamond Necklace",
    description: "Elegant diamond necklace with 24K gold chain.",
    price: "1000000000000000000", // 1 ETH in wei
    seller: "0xd03ea8624C8C5987235048901fB614fDcA89b117",
    imageUrl:
      "http://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isAuction: true,
    endTime: Math.floor(Date.now() / 1000) + 600, // 10 minutes
  },
  {
    id: "4",
    name: "Antique Vase",
    description: "Hand-painted ceramic vase from the 18th century.",
    price: "300000000000000000", // 0.3 ETH in wei
    seller: "0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9",
    imageUrl:
      "https://images.unsplash.com/photo-1723544541566-175e43e5af31?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isAuction: true,
    endTime: Math.floor(Date.now() / 1000) + 300, // 5 minutes
  },
  {
    id: "5",
    name: "Electric Guitar",
    description: "Professional electric guitar with amp and accessories.",
    price: "800000000000000000", // 0.8 ETH in wei
    seller: "0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E",
    imageUrl:
      "https://images.unsplash.com/photo-1568193755668-aae18714a9f1?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isAuction: false,
  },
  {
    id: "6",
    name: "Mountain Bike",
    description:
      "Premium mountain bike with carbon fiber frame and hydraulic brakes.",
    price: "1500000000000000000", // 1.5 ETH in wei
    seller: "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    imageUrl:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isAuction: false,
  },
];

export function initializeProducts(forceReset: boolean = false): void {
  const existing = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!existing || forceReset) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
  }
}

export function getProducts(): ProductItem[] {
  const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addProduct(product: Omit<ProductItem, "id">, id: string): void {
  const stored = getProducts();
  const newProduct: ProductItem = { ...product, id };
  const updated = [...stored, newProduct];

  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));

  window.dispatchEvent(new Event("products-updated"));
}

export function removeProduct(id: string): boolean {
  const stored = getProducts();
  const filtered = stored.filter((p) => p.id !== id);

  if (stored.length === filtered.length) return false;

  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function updateProduct(updatedProduct: ProductItem): void {
  const stored = getProducts();
  const index = stored.findIndex((p) => p.id === updatedProduct.id);

  if (index !== -1) {
    stored[index] = updatedProduct;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(stored));
  }
}