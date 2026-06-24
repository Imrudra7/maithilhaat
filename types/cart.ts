import { MaithilResponse } from "@/types/common";

/* =========================
   Requests
========================= */

export interface AddCartItemRequest {
    productId: string;
    variantId: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    cartItemId: string;
    quantity?: number;
    method?: string; // INCREASE / DECREASE
}

/* =========================
   Responses
========================= */

export interface CartItemResponse {
    cartItemId: string;

    productId: string;

    variantId: string;

    quantity: number;

    packSize: string;

    uom: string;

    unitPrice: string;

    discountedPrice: string;

    value: string;
}

export interface CartResponse {
    cartId: string;

    status: string;

    items: CartItemResponse[];

    itemTotalAmount: string;

    discountedItemTotalAmount: string;

    handlingFee: string;

    deliveryPartnerFee: string;

    platformFee: string;

    toPay: string;
}

/* =========================
   Wrapper Response
========================= */

export type CartApiResponse =
    MaithilResponse<CartResponse>;