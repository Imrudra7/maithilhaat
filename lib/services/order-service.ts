import apiClient from "@/lib/api-client";

export interface PlaceOrderRequest {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface OrderAddressResponse {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface OrderItemResponse {
    orderItemId: string;
    productId: string;
    variantId: string;

    productName: string;
    variantLabel: string;
    imageUrl: string;

    quantity: number;

    packSize: number;
    uom: string;

    unitPrice: number;
    discountedPrice: number;

    totalAmount: number;
}

export interface OrderResponse {

    orderId: string;

    status: string;

    address: OrderAddressResponse;

    items: OrderItemResponse[];

    itemTotalAmount: number;

    discountedItemTotalAmount: number;

    handlingFee: number;

    deliveryPartnerFee: number;

    platformFee: number;

    toPay: number;

    createdAt: string;

    updatedAt: string;
}

class OrderService {

    async placeOrder(
        request: PlaceOrderRequest
    ): Promise<OrderResponse> {

        const response = await apiClient.post(
            "/order/api",
            request
        );

        return response.data.data;
    }

    async getOrders(): Promise<OrderResponse[]> {

        const response = await apiClient.get(
            "/order/api"
        );

        return response.data.data;
    }

    async getOrder(
        orderId: string
    ): Promise<OrderResponse> {

        const response = await apiClient.get(
            `/order/api/${orderId}`
        );

        return response.data.data;
    }

    async updateAddress(
        orderId: string,
        request: PlaceOrderRequest
    ): Promise<OrderResponse> {

        const response = await apiClient.put(
            `/order/api/${orderId}/address`,
            request
        );

        return response.data.data;
    }

    async cancelOrder(
        orderId: string
    ): Promise<OrderResponse> {

        const response = await apiClient.patch(
            `/order/api/${orderId}/cancel`
        );

        return response.data.data;
    }
}

export const orderService = new OrderService();