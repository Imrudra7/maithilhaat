"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    CreditCard,
    HelpCircle,
    MapPinned,
    PackageCheck,
    PackageOpen,
    Palette,
    ReceiptText,
    RotateCcw,
    ShoppingBag,
    Truck,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orderService, OrderResponse } from "@/lib/services/order-service";

const fallbackImage = "/images/maithil-art-gallery-hero.png";

const orderCareCards = [
    {
        Icon: MapPinned,
        title: "Delivery clarity",
        copy: "Order detail page par address, total aur item snapshot ek jagah rakha gaya hai.",
    },
    {
        Icon: RotateCcw,
        title: "Collect again",
        copy: "Repeat buying ke liye recent purchases ko visual product memory ki tarah design kiya gaya hai.",
    },
    {
        Icon: HelpCircle,
        title: "Support ready",
        copy: "Invoice, payment aur delivery question ke liye order card se direct context milta hai.",
    },
];

function getStatusMeta(status: string) {
    switch (status) {
        case "CONFIRMED":
            return {
                label: "Confirmed",
                Icon: CheckCircle2,
                badge: "bg-emerald-100 text-emerald-700",
                accent: "text-emerald-600",
                panel: "bg-emerald-50 border-emerald-100",
            };
        case "DELIVERED":
            return {
                label: "Delivered",
                Icon: PackageCheck,
                badge: "bg-teal-100 text-teal-700",
                accent: "text-teal-600",
                panel: "bg-teal-50 border-teal-100",
            };
        case "PENDING_PAYMENT":
            return {
                label: "Payment Pending",
                Icon: Clock,
                badge: "bg-amber-100 text-amber-800",
                accent: "text-amber-700",
                panel: "bg-amber-50 border-amber-100",
            };
        case "FAILED":
        case "CANCELLED":
        case "TIMEOUT":
            return {
                label: status.replace("_", " "),
                Icon: XCircle,
                badge: "bg-red-100 text-red-700",
                accent: "text-red-600",
                panel: "bg-red-50 border-red-100",
            };
        default:
            return {
                label: status.replace("_", " "),
                Icon: Truck,
                badge: "bg-stone-100 text-stone-700",
                accent: "text-stone-600",
                panel: "bg-stone-50 border-stone-100",
            };
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function OrderSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <div className="flex animate-pulse gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-stone-100" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-1/2 rounded bg-stone-100" />
                            <div className="h-3 w-3/4 rounded bg-stone-100" />
                            <div className="h-3 w-1/3 rounded bg-stone-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function OrderHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                setLoading(true);
                setError(false);
                const data = await orderService.getOrders();
                const sortedOrders = [...data].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

    const summary = useMemo(() => {
        const totalSpent = orders.reduce((sum, order) => sum + order.toPay, 0);
        const activeOrders = orders.filter((order) => !["DELIVERED", "CANCELLED", "FAILED", "TIMEOUT"].includes(order.status)).length;
        const totalPieces = orders.reduce(
            (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
            0
        );

        return { totalSpent, activeOrders, totalPieces };
    }, [orders]);

    if (error) {
        return (
            <main className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.18),rgba(239,225,197,0.78)_24%,rgba(231,247,240,0.58)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center" />
                <div className="container mx-auto px-4 py-16">
                <section className="mh-fade-up mx-auto max-w-xl rounded-[2rem] border border-red-100 bg-[#fff8e7]/74 p-8 text-center shadow-2xl shadow-red-900/5 backdrop-blur-xl">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h1 className="mt-6 text-3xl font-black tracking-tight text-stone-950">Orders could not be loaded</h1>
                    <p className="mt-3 text-sm font-semibold leading-7 text-stone-500">
                        We could not reach your order history right now. Please try again in a moment.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button onClick={() => window.location.reload()} className="rounded-2xl font-black">
                            Retry
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/shop")} className="rounded-2xl border-2 font-black">
                            Browse Art
                        </Button>
                    </div>
                </section>
                </div>
            </main>
        );
    }

    return (
        <main className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.18),rgba(239,225,197,0.78)_24%,rgba(231,247,240,0.58)_76%,rgba(90,52,36,0.14)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center opacity-95" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(67,37,23,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute -left-20 top-24 -z-10 h-56 w-56 rounded-full border border-primary/10" />
            <div className="absolute -right-24 top-[520px] -z-10 h-72 w-72 rounded-full border border-emerald-700/10" />

            <div className="container mx-auto px-4 py-8 md:py-12">
            <section className="mh-fade-up relative mb-8 overflow-hidden rounded-[1.5rem] border border-white/55 bg-[#2b1710]/88 text-white shadow-[0_32px_100px_-55px_rgba(43,23,16,0.9)] backdrop-blur-xl sm:rounded-[2rem]">
                <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
                <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:p-10">
                    <div className="space-y-5">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/shop")}
                            className="mh-press h-10 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#2b1710]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continue collecting
                        </Button>

                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-amber-200">Collector account</p>
                            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-6xl">My Orders</h1>
                        </div>
                        <p className="max-w-xl text-sm font-semibold leading-7 text-stone-300 md:text-base">
                            Track every artwork, textile, and crafted object you have brought home from MaithilHaat.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 self-end min-[420px]:grid-cols-3">
                        <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                            <ShoppingBag className="mb-3 h-5 w-5 text-amber-200" />
                            <p className="break-words text-2xl font-black">{orders.length}</p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">Orders</p>
                        </div>
                        <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                            <Palette className="mb-3 h-5 w-5 text-rose-200" />
                            <p className="break-words text-2xl font-black">{summary.totalPieces}</p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">Pieces</p>
                        </div>
                        <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                            <CreditCard className="mb-3 h-5 w-5 text-emerald-200" />
                            <p className="break-words text-xl font-black min-[420px]:text-2xl">Rs {summary.totalSpent.toLocaleString()}</p>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">Value</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="space-y-4">
                    <div className="mh-card-hover relative overflow-hidden rounded-2xl border border-[#fff2d2]/70 bg-[#f4dfbd]/52 p-5 shadow-[0_24px_80px_-52px_rgba(69,32,15,0.75)] backdrop-blur-2xl">
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1" />
                        <p className="museum-label">Order Snapshot</p>
                        <div className="mt-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-stone-500">Active orders</span>
                                <span className="text-lg font-black text-stone-950">{summary.activeOrders}</span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-stone-500">Completed</span>
                                <span className="text-lg font-black text-stone-950">
                                    {orders.filter((order) => order.status === "DELIVERED").length}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-stone-500">Pending payment</span>
                                <span className="text-lg font-black text-stone-950">
                                    {orders.filter((order) => order.status === "PENDING_PAYMENT").length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mh-card-hover rounded-2xl border border-[#fff2d2]/70 bg-[#fff8e7]/58 p-5 shadow-sm backdrop-blur-xl">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ReceiptText className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-stone-950">Need invoice help?</h2>
                                <p className="mt-1 text-xs font-semibold leading-6 text-stone-500">
                                    Open an order to review the address, payment total, and item details.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mh-card-hover relative overflow-hidden rounded-2xl border border-[#fff2d2]/70 bg-[#2b1710]/86 p-5 text-white shadow-[0_24px_80px_-52px_rgba(43,23,16,0.9)] backdrop-blur-xl">
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-80" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">Collector care</p>
                        <h2 className="mt-2 text-lg font-black">Har order ki kahani safe rahe</h2>
                        <p className="mt-2 text-xs font-semibold leading-6 text-stone-300">
                            Product, payment, delivery aur craft memory ko easy scan format me rakha gaya hai.
                        </p>
                    </div>
                </aside>

                <section>
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="museum-label">History</p>
                            <h2 className="text-2xl font-black tracking-tight text-stone-950">Recent Purchases</h2>
                        </div>
                    </div>

                    {loading ? (
                        <OrderSkeleton />
                    ) : orders.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-primary/20 bg-[linear-gradient(135deg,rgba(255,248,231,0.74),rgba(255,255,255,0.5)),url('/images/mithila-thekua-showcase.png')] bg-cover bg-center p-10 text-center shadow-sm backdrop-blur-xl">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-50 text-primary">
                                <PackageOpen className="h-8 w-8" />
                            </div>
                            <h3 className="mt-6 text-2xl font-black text-stone-950">No orders yet</h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-7 text-stone-500">
                                Your first collected piece will appear here with delivery and payment details.
                            </p>
                            <Button onClick={() => router.push("/shop")} className="mh-press mh-shine mt-7 rounded-2xl font-black">
                                Browse Art Gallery
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const orderDate = formatDate(order.createdAt);
                                const statusMeta = getStatusMeta(order.status);
                                const StatusIcon = statusMeta.Icon;
                                const totalItems = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
                                const primaryItem = order.items[0];

                                return (
                                    <button
                                        type="button"
                                        key={order.orderId}
                                        onClick={() => router.push(`/orders/${order.orderId}`)}
                                        className="mh-card-hover group relative w-full overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#fff8e7]/62 p-4 text-left shadow-[0_20px_70px_-50px_rgba(69,32,15,0.7)] backdrop-blur-xl hover:border-amber-200/80 hover:bg-[#fff3d7]/76 hover:shadow-2xl hover:shadow-stone-900/10 md:p-5"
                                    >
                                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex -space-x-4 overflow-hidden py-1">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <div
                                                            key={item.orderItemId}
                                                            className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-stone-100 shadow-sm"
                                                            style={{ zIndex: 4 - idx }}
                                                        >
                                                            <img
                                                                src={item.imageUrl || fallbackImage}
                                                                alt={item.productName}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {order.items.length > 3 && (
                                                        <div className="z-0 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-stone-100 text-xs font-black text-stone-600 shadow-sm">
                                                            +{order.items.length - 3}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge className={`${statusMeta.badge} border-none px-3 py-1 font-black`}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusMeta.label}
                                                        </Badge>
                                                        <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-stone-400">
                                                            <Calendar className="h-3 w-3" />
                                                            {orderDate}
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-3 truncate text-base font-black text-stone-950 md:text-lg">
                                                        {primaryItem?.productName ?? "MaithilHaat order"}
                                                        {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                                                    </h3>
                                                    <p className="mt-1 truncate text-sm font-semibold text-stone-500">
                                                        Order {order.orderId}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-stone-100 pt-4 md:min-w-64 md:border-t-0 md:pt-0">
                                                <div className="grid grid-cols-2 gap-3 text-left min-[420px]:text-right">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Items</p>
                                                        <p className="mt-1 text-sm font-black text-stone-900">{totalItems}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total</p>
                                                        <p className="mt-1 break-words text-base font-black text-primary">Rs {order.toPay.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${statusMeta.panel} ${statusMeta.accent} transition-transform group-hover:translate-x-1`}>
                                                    <ChevronRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="mh-scroll-reveal mt-6 grid gap-3 md:grid-cols-3">
                        {orderCareCards.map((card) => (
                            <div key={card.title} className="mh-card-hover rounded-2xl border border-[#fff2d2]/70 bg-[#fff8e7]/58 p-4 shadow-sm backdrop-blur-xl">
                                <card.Icon className="mh-icon-glow h-5 w-5 text-primary" />
                                <h3 className="mt-3 text-sm font-black text-stone-950">{card.title}</h3>
                                <p className="mt-1 text-xs font-semibold leading-5 text-stone-600">{card.copy}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </section>
            </div>
        </main>
    );
}
