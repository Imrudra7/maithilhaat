// src/lib/services/product-service.ts
import apiClient from '../api-client';
import { ProductResponse, CategoryResponse, MerchantResponse } from '@/types/product';

export const productService = {
    // 1. Get Single Product (Public)
    getProductById: async (id: string): Promise<ProductResponse> => {
        const response = await apiClient.get(`/product/api/${id}`);
        return response.data;
    },

    // 2. Get Category Tree (Menu ke liye)
    getCategoryTree: async (merchantId?: string): Promise<CategoryResponse[]> => {
        const url = merchantId ? `/product/api/category/tree?merchantId=${merchantId}` : '/product/api/category/tree';
        const response = await apiClient.get(url);
        return response.data;
    },

    // 3. Get Merchant Details
    getMerchant: async (id: string): Promise<MerchantResponse> => {
        const response = await apiClient.get(`/product/api/merchant/${id}`);
        return response.data;
    },

    getProductBySlug: async (slug: string): Promise<ProductResponse> => {
        const response = await apiClient.get(`/product/api/public/slug/${slug}`);
        return response.data;
    },

    getAllProducts: async (): Promise<ProductResponse[]> => {
        const response = await apiClient.get(`/public/all`);
        return response.data;
    }
};