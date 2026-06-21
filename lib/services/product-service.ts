// src/lib/services/product-service.ts
import apiClient from '../api-client';
import { ProductResponse, CategoryResponse, MerchantResponse } from '@/types/product';
import { MaithilResponse } from '@/types/common';

const productUrl: string = '/product/api';

export const productService = {
    // 1. Get Single Product (Public)
    getProductById: async (id: string): Promise<ProductResponse> => {

        const response = await apiClient.get<MaithilResponse<ProductResponse>>(`${productUrl}/${id}`);

        return response.data.data;
    },

    // 2. Get Category Tree (Menu ke liye)
    getCategoryTree: async (merchantId?: string): Promise<CategoryResponse[]> => {
        const url = merchantId ? `${productUrl}/public/category/tree?merchantId=${merchantId}` : `${productUrl}/public/category/tree`;
        const response = await apiClient.get<MaithilResponse<CategoryResponse[]>>(url);

        return response.data.data;
    },



    // 3. Get Merchant Details
    getMerchant: async (id: string): Promise<MerchantResponse> => {
        const response = await apiClient.get<MaithilResponse<MerchantResponse>>(`${productUrl}/merchant/${id}`);
        return response.data.data;
    },

    getProductBySlug: async (slug: string): Promise<ProductResponse> => {
        const response = await apiClient.get<MaithilResponse<ProductResponse>>(`${productUrl}/public/slug/${slug}`);
        return response.data.data;
    },

    getAllProducts: async (): Promise<ProductResponse[]> => {
        const response = await apiClient.get<MaithilResponse<ProductResponse[]>>(`${productUrl}/public/all`);
        return response.data.data;
    }
};