import { paymentService } from "@/lib/services/payment-service";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export async function openRazorpay(payment: any, onSuccess: () => void) {
    const options = {
        key: payment.razorpayKey,

        amount: payment.amount * 100,

        currency: payment.currency,

        order_id: payment.gatewayOrderId,

        name: "Maithil Art",

        description: "Order Payment",

        handler: async function (response: any) {
            await paymentService.verifyPayment({
                paymentId: payment.paymentId,

                providerOrderId: response.razorpay_order_id,

                providerPaymentId: response.razorpay_payment_id,

                providerSignature: response.razorpay_signature,
            });

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
