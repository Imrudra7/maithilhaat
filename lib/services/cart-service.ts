// src/lib/services/cart-service.ts

import apiClient from '../api-client';
import { MaithilResponse } from '@/types/common';
import {
    AddCartItemRequest,
    UpdateCartItemRequest,
    CartResponse
} from '@/types/cart';
import { notify } from '@/lib/notify';

const cartUrl = '/cart/api';

function getDistinctProductCount(cart: CartResponse): number {
    return new Set((cart.items ?? []).map((item) => item.productId)).size;
}

function emitCartUpdated(cart: CartResponse, action: 'add' | 'update' | 'delete' | 'clear' = 'update') {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(new CustomEvent('maithilhaat:cart-updated', {
        detail: {
            action,
            count: getDistinctProductCount(cart),
            cart,
        },
    }));
}

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

        notify.success(response.data.message);
        emitCartUpdated(response.data.data, 'add');

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

        notify.success(response.data.message);
        emitCartUpdated(response.data.data, 'update');

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

        notify.success(response.data.message);
        emitCartUpdated(response.data.data, 'delete');

        return response.data.data;
    },

    clearCart: async (): Promise<CartResponse> => {

        const response =
            await apiClient.delete<MaithilResponse<CartResponse>>(
                `${cartUrl}/all`
            );

        notify.success(response.data.message);
        emitCartUpdated(response.data.data, 'clear');

        return response.data.data;
    }
};
