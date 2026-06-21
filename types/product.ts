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
  level: number;
  parentId: string | null;
  active: boolean;
  children: CategoryResponse[];
}

export interface MerchantResponse {
  id: string;
  name: string;
  merchantCode: string;
  isActive: boolean;
  createdAt: string;
}

// src/types/product.ts

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
  updatedAt: string; // 👈 Ye line add karo
  variants: ProductVariantResponse[];
}

//export type Product = ProductResponse;