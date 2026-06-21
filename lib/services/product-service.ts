// src/lib/services/product-service.ts
import apiClient from '../api-client';
import { ProductResponse, CategoryResponse, MerchantResponse } from '@/types/product';

const productUrl: string = '/product/api';

export const productService = {
    // 1. Get Single Product (Public)
    getProductById: async (id: string): Promise<ProductResponse> => {
        const response = await apiClient.get(`${productUrl}/${id}`);
        return response.data;
    },

    // 2. Get Category Tree (Menu ke liye)
    getCategoryTree: async (merchantId?: string): Promise<CategoryResponse[]> => {
        const url = merchantId ? `${productUrl}/public/category/tree?merchantId=${merchantId}` : `${productUrl}/public/category/tree`;
        const response = await apiClient.get(url);
        return response.data;
    },

    // 3. Get Merchant Details
    getMerchant: async (id: string): Promise<MerchantResponse> => {
        const response = await apiClient.get(`${productUrl}/merchant/${id}`);
        return response.data;
    },

    getProductBySlug: async (slug: string): Promise<ProductResponse> => {
        const response = await apiClient.get(`${productUrl}/public/slug/${slug}`);
        return response.data;
    },

    getAllProducts: async (): Promise<ProductResponse[]> => {
        const response = await apiClient.get(`${productUrl}/public/all`);
        return response.data;
    }
};