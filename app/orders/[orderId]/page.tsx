"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    CheckCircle2,
    Truck,
    MapPin,
    Calendar,
    ChevronLeft,
    ShoppingBag,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { orderService, OrderResponse } from "@/lib/services/order-service";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!orderId) return;

        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const data = await orderService.getOrder(orderId as string);
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className="mh-fade-up container mx-auto px-4 py-20 text-center font-bold text-lg text-slate-600 animate-pulse">
                Loading your order details... 🎨
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="mh-fade-up container mx-auto px-4 py-20 text-center max-w-md space-y-4">
                <h2 className="text-2xl font-black text-red-600">Order Not Found</h2>
                <p className="text-slate-500 font-medium">हमें इस ID से कोई आर्डर नहीं मिला। कृपया अपने आर्डर्स सेक्शन में दोबारा चेक करें।</p>
                <Button onClick={() => router.push("/products")} className="mh-press mh-shine bg-amber-700 hover:bg-amber-800">
                    Continue Shopping
                </Button>
            </div>
        );
    }

    // डेट फॉर्मेटिंग हेल्पर
    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const subtotal = order.itemTotalAmount;
    const savings = order.itemTotalAmount - order.discountedItemTotalAmount;

    return (
        <div className="mh-fade-up container mx-auto max-w-4xl px-4 py-8 animate-in fade-in duration-3xl md:py-12">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="mh-press mb-6 -ml-2 text-slate-600 font-bold hover:text-amber-700 flex items-center gap-1"
            >
                <ChevronLeft className="h-4 w-4" /> Back to Home
            </Button>

            {/* Top Success Banner */}
            <div className="mh-card-hover relative mb-8 overflow-hidden space-y-3 rounded-3xl border border-amber-200/60 bg-amber-50/30 p-5 text-center md:p-8">
                <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
                <div className="mh-float-soft w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Thank You for Your Order! 🎉</h1>
                <p className="text-slate-600 max-w-md mx-auto font-medium text-sm leading-relaxed">
                    आपका आर्डर सफलता पूर्वक स्वीकार कर लिया गया है। मिथिला कला की यह खूबसूरत कृति जल्द ही आपके घर पहुंचेगी।
                </p>
                <div className="mt-2 inline-block max-w-full rounded-xl border bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
                    Order ID: <span className="text-slate-800 font-mono select-all">{order.orderId}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* LEFT/CENTER: Order Status & Items Summary */}
                <div className="md:col-span-2 space-y-6">
                    {/* Status & Date Info Card */}
                    <div className="mh-card-hover space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Placed On</span>
                                    <span className="text-sm font-bold text-slate-700">{formattedDate}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Truck className="h-4 w-4 text-slate-400" />
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mt-0.5 ${order.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                                            order.status === "PENDING_PAYMENT" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-slate-100 text-slate-700"
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ordered Items Card */}
                    <div className="mh-card-hover space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                        <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-2 mb-2">
                            <ShoppingBag className="h-4 w-4 text-amber-700" />
                            <span>Items in Your Order</span>
                        </h3>
                        <div className="divide-y divide-slate-100">
                            {order.items.map((item) => (
                                <div key={item.orderItemId} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 min-[420px]:flex-row min-[420px]:items-center">
                                    <div className="mh-card-hover w-16 h-16 bg-slate-50 border rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.imageUrl || "/images/maithil-art-gallery-hero.png"}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-slate-800 truncate">{item.productName}</h4>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                                            Qty: {item.quantity} {item.uom && `• Size: ${item.packSize} ${item.uom}`}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 text-left min-[420px]:text-right">
                                        <span className="font-black text-sm text-slate-900">₹{item.totalAmount.toLocaleString()}</span>
                                        {item.discountedPrice < item.unitPrice && (
                                            <span className="block text-xs font-medium text-slate-400 line-through">
                                                ₹{(item.unitPrice * item.quantity).toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Shipping Address & Pricing Snapshot */}
                <div className="space-y-6">
                    {/* Shipping Address Card */}
                    <div className="mh-card-hover space-y-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                        <h3 className="font-black text-md text-slate-900 tracking-tight flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-amber-700" />
                            <span>Delivery Address</span>
                        </h3>
                        <div className="text-sm font-medium text-slate-600 leading-relaxed space-y-1">
                            <p className="font-black text-slate-800 text-sm">{order.address.fullName}</p>
                            <p className="text-xs text-slate-500 font-bold mb-2">📞 {order.address.phoneNumber}</p>
                            <Separator className="my-2" />
                            <p>{order.address.addressLine1}</p>
                            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                            <p>{order.address.city}, {order.address.state} - {order.address.postalCode}</p>
                        </div>
                    </div>

                    {/* Price Summary Card */}
                    <div className="mh-card-hover space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                        <h3 className="font-black text-md text-slate-900 tracking-tight flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-amber-700" />
                            <span>Payment Summary</span>
                        </h3>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {savings > 0 && (
                                <div className="flex justify-between font-bold text-green-600">
                                    <span>Discount Saved</span>
                                    <span>- ₹{savings.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-slate-500">
                                <span>Handling Fee</span>
                                <span>₹{order.handlingFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-500">
                                <span>Delivery Fee</span>
                                <span>₹{order.deliveryPartnerFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-500">
                                <span>Platform Fee</span>
                                <span>₹{order.platformFee.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between gap-3 pt-1 text-lg font-black text-slate-900">
                                <span>Total Paid</span>
                                <span className="text-amber-800">₹{order.toPay.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
