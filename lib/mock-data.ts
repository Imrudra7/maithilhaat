// src/lib/mock-data.ts
import { ProductResponse as Product, CategoryResponse as Category } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "uuid-p1",
    categoryId: "uuid-cat-paintings",
    merchantId: "uuid-merchant-1",
    name: "Classic Madhubani Tree of Life",
    slug: "classic-madhubani-tree-of-life",
    description: "Authentic handmade painting on handmade paper using natural colors.",
    type: "PHYSICAL",
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800",
    isActive: true,
    attributes: { material: "Handmade Paper", origin: "Madhubani, Bihar", theme: "Nature" },
    variants: [
      {
        id: "v1",
        skuCode: "MD-TOL-A4",
        price: 2499,
        salePrice: 1999,
        stockQuantity: 10,
        variantAttributes: { size: "A4", frame: "Without Frame" },
        isActive: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  // ... aise hi aur products add kar sakte ho
];