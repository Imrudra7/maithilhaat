// src/types/product.ts

export type ProductType = 'PHYSICAL' | 'SERVICE' | 'DIGITAL';

export interface ProductVariantResponse {
  id: string;
  skuCode: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  variantAttributes: Record<string, any>;
  isActive: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  merchantId: string;
  type: ProductType;
  attributes: Record<string, any>;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  variants: ProductVariantResponse[];
}

export interface CategoryResponse {
  id: string;
  name: string;
  parentId: string | null;
  isActive: boolean;
  children: CategoryResponse[]; // Tree structure ke liye
}

export interface MerchantResponse {
  id: string;
  name: string;
  merchantCode: string;
  isActive: boolean;
  createdAt: string;
}