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
    image?: string;
    prefill?: {
        name?: string;
        contact?: string;
        email?: string;
    };
    notes?: Record<string, string>;
    method?: {
        upi?: boolean;
        card?: boolean;
        netbanking?: boolean;
        wallet?: boolean;
        paylater?: boolean;
    };
    config?: {
        display: {
            blocks: Record<string, {
                name: string;
                instruments: Array<{ method: string }>;
            }>;
            sequence: string[];
            preferences: {
                show_default_blocks: boolean;
            };
        };
    };
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

interface RazorpayCustomerPrefill {
    name?: string;
    contact?: string;
    email?: string;
}

export async function openRazorpay(
    payment: PaymentResponse,
    onSuccess: () => void,
    prefill?: RazorpayCustomerPrefill
) {
    const options: RazorpayOptions = {
        key: payment.razorpayKey,

        amount: payment.amount * 100,

        currency: payment.currency,

        order_id: payment.gatewayOrderId,

        name: "MaithilHaat",

        description: "Mithila craft order payment",

        image: `${window.location.origin}/maithilhaat-razorpay-logo.svg`,

        prefill,

        notes: {
            brand: "MaithilHaat",
            orderId: payment.orderId,
            gateway: payment.gateway,
        },

        method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
            paylater: true,
        },

        config: {
            display: {
                blocks: {
                    upi: {
                        name: "UPI",
                        instruments: [{ method: "upi" }],
                    },
                    card: {
                        name: "Cards",
                        instruments: [{ method: "card" }],
                    },
                    netbanking: {
                        name: "Netbanking",
                        instruments: [{ method: "netbanking" }],
                    },
                    wallet: {
                        name: "Wallets",
                        instruments: [{ method: "wallet" }],
                    },
                },
                sequence: ["block.upi", "block.card", "block.netbanking", "block.wallet"],
                preferences: {
                    show_default_blocks: true,
                },
            },
        },

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
            color: "#2B1710",
        },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
}
