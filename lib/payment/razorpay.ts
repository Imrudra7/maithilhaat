import { PaymentResponse, paymentService } from "@/lib/services/payment-service";

interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    handler: (response: RazorpaySuccessResponse) => Promise<void>;
    modal: {
        ondismiss: () => void;
    };
    theme: {
        color: string;
    };
}

interface RazorpayInstance {
    open: () => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

export async function openRazorpay(payment: PaymentResponse, onSuccess: () => void) {
    const options: RazorpayOptions = {
        key: payment.razorpayKey,

        amount: payment.amount * 100,

        currency: payment.currency,

        order_id: payment.gatewayOrderId,

        name: "Maithil Art",

        description: "Order Payment",

        handler: async function (response) {
            await paymentService.verifyPayment({
                paymentId: payment.paymentId,

                providerOrderId: response.razorpay_order_id,

                providerPaymentId: response.razorpay_payment_id,

                providerSignature: response.razorpay_signature,
            }, crypto.randomUUID());

            onSuccess();
        },

        modal: {
            ondismiss: function () {
                console.log("Payment cancelled");
            },
        },

        theme: {
            color: "#B45309",
        },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
}
