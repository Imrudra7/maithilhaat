// src/lib/services/product-service.ts
import apiClient from '../api-client';
import { ProductResponse, CategoryResponse, MerchantResponse } from '@/types/product';
import { MaithilResponse } from '@/types/common';

const productUrl: string = '/product/api';

function normalizeProduct(product: ProductResponse): ProductResponse {
    return {
        ...product,
        isActive: product.isActive ?? product.active ?? false,
        variants: (product.variants ?? []).map((variant) => ({
            ...variant,
            isActive: variant.isActive ?? variant.active ?? false,
        })),
    };
}

export const productService = {

    getProductById: async (id: string): Promise<ProductResponse> => {

        const response =
            await apiClient.get<MaithilResponse<ProductResponse>>(
                `${productUrl}/${id}`
            );

        return normalizeProduct(response.data.data);
    },

    getCategoryTree: async (
        merchantId?: string
    ): Promise<CategoryResponse[]> => {

        const url = merchantId
            ? `${productUrl}/public/category/tree?merchantId=${merchantId}`
            : `${productUrl}/public/category/tree`;

        const response =
            await apiClient.get<
                MaithilResponse<CategoryResponse[]>
            >(url);

        return response.data.data;
    },

    getMerchant: async (
        id: string
    ): Promise<MerchantResponse> => {

        const response =
            await apiClient.get<
                MaithilResponse<MerchantResponse>
            >(`${productUrl}/merchant/${id}`);

        return response.data.data;
    },

    getProductBySlug: async (
        slug: string
    ): Promise<ProductResponse> => {

        const response =
            await apiClient.get<
                MaithilResponse<ProductResponse>
            >(`${productUrl}/public/slug/${slug}`);

        return normalizeProduct(response.data.data);
    },

    getAllProducts: async (): Promise<ProductResponse[]> => {

        const response =
            await apiClient.get<
                MaithilResponse<ProductResponse[]>
            >(`${productUrl}/public/all`);

        return response.data.data.map(normalizeProduct);
    }
};
