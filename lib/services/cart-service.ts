import { MaithilResponse } from "@/types/common";

export interface AddCartItemRequest {
    productId: string;
    variantId?: string;
    quantity: number;
    packSize?: string | number;
    uom?: string;
}

export interface UpdateCartItemRequest {
    cartItemId: string;
    quantity?: number;
    packSize?: string | number;
    uom?: string;
}

export interface CartItemResponse {
    cartItemId: string;
    productId: string;
    variantId?: string;
    quantity: number;
    packSize?: string | number;
    uom?: string;
    unitPrice?: string;
    discountedPrice?: string;
    value?: string;
}

export interface CartResponse {
    cartId: string;
    status?: string;
    items?: CartItemResponse[];
    itemTotalAmount?: string;
    discountedItemTotalAmount?: string;
    handlingFee?: string;
    deliveryPartnerFee?: string;
    platformFee?: string;
    toPay?: string;
}



const CART_API_BASE = '/cart/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<MaithilResponse<T>> {
    const response = await fetch(path, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers ?? {}),
        },
        ...options,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => undefined);
        const errorMessage = body?.message ?? response.statusText;
        throw new Error(errorMessage);
    }

    return response.json();
}

export const cartService = {
    getCart(): Promise<MaithilResponse<CartResponse>> {
        return request<CartResponse>(CART_API_BASE, {
            method: 'GET',
        });
    },

    addToCart(requestBody: AddCartItemRequest): Promise<MaithilResponse<CartResponse>> {
        return request<CartResponse>(CART_API_BASE, {
            method: 'POST',
            body: JSON.stringify(requestBody),
        });
    },

    updateCart(requestBody: UpdateCartItemRequest): Promise<MaithilResponse<CartResponse>> {
        return request<CartResponse>(CART_API_BASE, {
            method: 'PATCH',
            body: JSON.stringify(requestBody),
        });
    },

    deleteItem(requestBody: UpdateCartItemRequest): Promise<MaithilResponse<CartResponse>> {
        return request<CartResponse>(`${CART_API_BASE}/item`, {
            method: 'DELETE',
            body: JSON.stringify(requestBody),
        });
    },

    clearCart(): Promise<MaithilResponse<CartResponse>> {
        return request<CartResponse>(`${CART_API_BASE}/all`, {
            method: 'DELETE',
        });
    },
};
