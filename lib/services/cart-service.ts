// src/lib/services/cart-service.ts

import apiClient from '../api-client';
import { MaithilResponse } from '@/types/common';
import {
    AddCartItemRequest,
    UpdateCartItemRequest,
    CartResponse
} from '@/types/cart';
import { toast } from 'sonner';

const cartUrl = '/cart/api';

export const cartService = {

    getCart: async (): Promise<CartResponse> => {

        const response =
            await apiClient.get<MaithilResponse<CartResponse>>(cartUrl);

        return response.data.data;
    },

    addToCart: async (
        requestBody: AddCartItemRequest
    ): Promise<CartResponse> => {

        const response =
            await apiClient.post<MaithilResponse<CartResponse>>(
                cartUrl,
                requestBody
            );

        toast.success(response.data.message);

        return response.data.data;
    },

    updateCart: async (
        requestBody: UpdateCartItemRequest
    ): Promise<CartResponse> => {

        const response =
            await apiClient.patch<MaithilResponse<CartResponse>>(
                cartUrl,
                requestBody
            );

        toast.success(response.data.message);

        return response.data.data;
    },

    deleteItem: async (
        requestBody: UpdateCartItemRequest
    ): Promise<CartResponse> => {

        const response =
            await apiClient.delete<MaithilResponse<CartResponse>>(
                `${cartUrl}/item`,
                {
                    data: requestBody
                }
            );

        toast.success(response.data.message);

        return response.data.data;
    },

    clearCart: async (): Promise<CartResponse> => {

        const response =
            await apiClient.delete<MaithilResponse<CartResponse>>(
                `${cartUrl}/all`
            );

        toast.success(response.data.message);

        return response.data.data;
    }
};