import apiClient from "@/lib/api-client";

export interface CreatePaymentRequest {
    orderId: string;
}

export interface VerifyPaymentRequest {
    paymentId: string;
    providerOrderId: string;
    providerPaymentId: string;
    providerSignature: string;
}

export interface PaymentResponse {
    paymentId: string;
    orderId: string;

    amount: number;
    currency: string;

    status: string;

    gateway: string;

    razorpayKey: string;

    gatewayOrderId: string;
    gatewayPaymentId?: string;
}

class PaymentService {

    async createPayment(
        request: CreatePaymentRequest
    ): Promise<PaymentResponse> {

        const response = await apiClient.post(
            "/payment/api",
            request
        );

        return response.data.data;
    }

    async getPayment(
        paymentId: string
    ): Promise<PaymentResponse> {

        const response = await apiClient.get(
            `/payment/api/${paymentId}`
        );

        return response.data.data;
    }

    async getPaymentByOrder(
        orderId: string
    ): Promise<PaymentResponse> {

        const response = await apiClient.get(
            `/payment/api/order/${orderId}`
        );

        return response.data.data;
    }

    async verifyPayment(
        request: VerifyPaymentRequest
    ): Promise<PaymentResponse> {

        const response = await apiClient.post(
            "/payment/api/verify",
            request
        );

        return response.data.data;
    }
}

export const paymentService = new PaymentService();