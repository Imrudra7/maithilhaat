"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    ChevronRight,
    Calendar,
    Clock,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orderService, OrderResponse } from "@/lib/services/order-service";

export default function OrderHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                setLoading(true);
                const data = await orderService.getOrders(); // सारे आर्डर्स मंगाए
                // लेटेस्ट आर्डर्स को ऊपर दिखाने के लिए सॉर्ट कर सकते हैं
                const sortedOrders = data.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Error fetching order history:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    // स्टेटस के हिसाब से बैज (Badge) का रंग बदलने वाला हेल्पर
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "CONFIRMED":
            case "DELIVERED":
                return <Badge className="bg-green-100 hover:bg-green-100 text-green-700 font-black border-none px-3 py-1 rounded-full flex items-center gap-1 w-fit"><CheckCircle2 className="h-3 w-3" /> {status}</Badge>;
            case "PENDING_PAYMENT":
                return <Badge className="bg-yellow-100 hover:bg-yellow-100 text-yellow-700 font-black border-none px-3 py-1 rounded-full flex items-center gap-1 w-fit"><Clock className="h-3 w-3" /> {status}</Badge>;
            case "FAILED":
            case "CANCELLED":
            case "TIMEOUT":
                return <Badge className="bg-red-100 hover:bg-red-100 text-red-700 font-black border-none px-3 py-1 rounded-full flex items-center gap-1 w-fit"><XCircle className="h-3 w-3" /> {status}</Badge>;
            default:
                return <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-700 font-black border-none px-3 py-1 rounded-full flex items-center gap-1 w-fit">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center font-bold text-lg text-slate-600 animate-pulse">
                Fetching your order history... 🎨
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center max-w-md space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-black text-slate-800">Oops! Something went wrong</h2>
                <p className="text-slate-500 font-medium">आर्डर हिस्ट्री लोड करने में कोई समस्या आई। कृपया बाद में प्रयास करें।</p>
                <Button onClick={() => window.location.reload()} className="bg-amber-700 hover:bg-amber-800">
                    Retry Again
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="text-amber-700 h-8 w-8" />
                        <span>My Orders</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500">आपके द्वारा खरीदे गए मिथिला आर्ट्स के सभी आर्डर्स की सूची</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="border-amber-700 text-amber-700 hover:bg-amber-50 rounded-xl font-bold flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Continue Shopping
                </Button>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
                <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-12 text-center space-y-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No Orders Found</h3>
                    <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">आपने अभी तक MaithilArt पर कोई आर्डर प्लेस नहीं किया है।</p>
                    <Button onClick={() => router.push("/")} className="bg-amber-700 hover:bg-amber-800 rounded-xl font-bold">
                        Browse Art Gallery
                    </Button>
                </div>
            ) : (
                /* Orders List Container */
                <div className="space-y-6">
                    {orders.map((order) => {
                        const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });

                        return (
                            <div
                                key={order.orderId}
                                onClick={() => router.push(`/orders/${order.orderId}`)}
                                className="group border border-slate-100 rounded-3xl p-5 md:p-6 bg-white hover:shadow-xl hover:border-amber-700/20 transition-all duration-3xl cursor-pointer"
                            >
                                {/* Top bar of individual order row */}
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Order ID</div>
                                        <div className="text-sm font-mono font-bold text-slate-800">{order.orderId}</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="space-y-1 sm:text-right">
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 sm:justify-end">
                                                <Calendar className="h-3 w-3" /> Date Placed
                                            </div>
                                            <div className="text-sm font-bold text-slate-700">{orderDate}</div>
                                        </div>
                                        <div className="space-y-1 sm:text-right">
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-wider sm:text-right">Status</div>
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-slate-50 my-4" />

                                {/* Middle Section: Products Grid / Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    {/* Product Snapshot details */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-4 overflow-hidden">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <div
                                                    key={item.orderItemId}
                                                    className="w-12 h-12 rounded-xl bg-slate-50 border-2 border-white overflow-hidden flex-shrink-0 shadow-sm"
                                                    style={{ zIndex: 3 - idx }}
                                                >
                                                    <img
                                                        src={item.imageUrl || "https://placehold.co/150"}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-black text-slate-600 shadow-sm z-0">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-slate-800 max-w-xs md:max-w-md truncate">
                                                {order.items[0]?.productName}
                                                {order.items.length > 1 && ` and ${order.items.length - 1} other item(s)`}
                                            </p>
                                            <p className="text-xs font-medium text-slate-400">Total Items: {order.items.reduce((acc, curr) => acc + curr.quantity, 0)}</p>
                                        </div>
                                    </div>

                                    {/* Action Price & View Details Trigger */}
                                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none pt-3 sm:pt-0">
                                        <div className="space-y-0.5 sm:text-right">
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Payable</div>
                                            <div className="text-lg font-black text-amber-800">₹{order.toPay.toLocaleString()}</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-amber-700 group-hover:text-white flex items-center justify-center text-slate-400 transition-all duration-3xl">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}