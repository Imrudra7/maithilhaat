"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  MapPin,
  PackageCheck,
  Palette,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { orderService, OrderResponse } from "@/lib/services/order-service";

const fallbackImage = "/images/maithil-art-gallery-hero.png";

const supportCards = [
  {
    Icon: FileText,
    title: "Invoice ready",
    copy: "Order ID, amount aur item snapshot support ke liye ready hai.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure payment",
    copy: "Payment details MaithilHaat ke secure checkout flow se processed hain.",
  },
  {
    Icon: HelpCircle,
    title: "Need help?",
    copy: "Delivery, payment ya artwork care ke liye order reference use karein.",
  },
];

const journeySteps = [
  { key: "PENDING_PAYMENT", label: "Payment", Icon: CreditCard },
  { key: "ORDER_CONFIRMED", label: "Confirmed", Icon: CheckCircle2 },
  { key: "ORDER_PACKED", label: "Packed", Icon: PackageCheck },
  { key: "ORDER_SHIPPED", label: "Shipped", Icon: Truck },
  { key: "ORDER_DELIVERED", label: "Delivered", Icon: Home },
];

function getStatusMeta(status: string) {
  switch (status) {
    case "ORDER_CONFIRMED":
      return {
        label: "Confirmed",
        Icon: CheckCircle2,
        badge: "bg-emerald-100 text-emerald-700",
        accent: "text-emerald-600",
        panel: "bg-emerald-50 border-emerald-100",
        headline: "Order accepted",
        copy: "Your MaithilHaat pieces are confirmed and getting ready for careful packing.",
      };
    case "ORDER_DELIVERED":
      return {
        label: "Delivered",
        Icon: PackageCheck,
        badge: "bg-emerald-100 text-emerald-700",
        accent: "text-emerald-600",
        panel: "bg-emerald-50 border-emerald-100",
        headline: "Delivered home",
        copy: "This handmade collection has reached its new home.",
      };
    case "ORDER_PAYMENT_PENDING":
      return {
        label: "Payment Pending",
        Icon: Clock,
        badge: "bg-emerald-100 text-emerald-700",
        accent: "text-emerald-600",
        panel: "bg-emerald-50 border-emerald-100",
        headline: "Payment pending",
        copy: "Complete payment to confirm this MaithilHaat order.",
      };
    case "FAILED":
    case "CANCELLED":
    case "TIMEOUT":
      return {
        label: status.replaceAll("_", " "),
        Icon: XCircle,
        badge: "bg-red-100 text-red-700",
        accent: "text-red-600",
        panel: "bg-red-50 border-red-100",
        headline: "Order not active",
        copy: "This order is not moving ahead. You can continue collecting from the shop.",
      };
    default:
      return {
        label: status.replaceAll("_", " "),
        Icon: Truck,
        badge: "bg-emerald-100 text-emerald-700",
        accent: "text-emerald-600",
        panel: "bg-emerald-50 border-emerald-100",
        headline: "Order in progress",
        copy: "Your order details are available below.",
      };
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return `Rs ${amount.toLocaleString()}`;
}

function getJourneyIndex(status: string) {
  const index = journeySteps.findIndex((step) => step.key === status);
  if (status === "ORDER_CONFIRMED") return 1;
  if (["ORDER_FAILED", "ORDER_CANCELLED", "ORDER_TIMEOUT"].includes(status)) return -1;
  return index >= 0 ? index : 1;
}

function LoadingState() {
  return (
    <main className="relative min-h-[72vh] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.18),rgba(239,225,197,0.78)_34%,rgba(231,247,240,0.58)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center" />
      <div className="container mx-auto flex min-h-[72vh] items-center justify-center px-4">
        <section className="mh-fade-up relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#f4dfbd]/64 p-8 text-center shadow-[0_30px_100px_-58px_rgba(69,32,15,0.86)] backdrop-blur-2xl">
          <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
          <ReceiptText className="mh-float-soft mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="text-2xl font-black text-[#2b1710]">Order details loading</h1>
          <p className="mt-2 text-sm font-bold text-stone-600">
            Your MaithilHaat order snapshot is being prepared.
          </p>
        </section>
      </div>
    </main>
  );
}

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
        setError(false);
        const data = await orderService.getOrder(orderId);
        setOrder(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const summary = useMemo(() => {
    if (!order) {
      return {
        totalPieces: 0,
        savings: 0,
        subtotal: 0,
        statusMeta: getStatusMeta(""),
        placedDate: "",
        updatedDate: "",
      };
    }

    return {
      totalPieces: order.items.reduce((sum, item) => sum + item.quantity, 0),
      savings: Math.max(order.itemTotalAmount - order.discountedItemTotalAmount, 0),
      subtotal: order.itemTotalAmount,
      statusMeta: getStatusMeta(order.status),
      placedDate: formatDate(order.createdAt),
      updatedDate: formatDate(order.updatedAt || order.createdAt),
    };
  }, [order]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !order) {
    return (
      <main className="relative min-h-[72vh] overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.18),rgba(239,225,197,0.78)_34%,rgba(231,247,240,0.58)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center" />
        <div className="container mx-auto flex min-h-[72vh] items-center justify-center px-4 py-14">
          <section className="mh-fade-up relative w-full max-w-xl overflow-hidden rounded-[1.5rem] border border-red-100 bg-[#fff8e7]/74 p-8 text-center shadow-2xl shadow-red-900/5 backdrop-blur-xl">
            <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-black text-stone-950">
              Order could not be loaded
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-7 text-stone-500">
              We could not find this order right now. Please check your order history or continue exploring the collection.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={() => router.push("/orders")} className="mh-press mh-shine rounded-2xl font-black">
                Go to orders
              </Button>
              <Button variant="outline" onClick={() => router.push("/shop")} className="mh-press rounded-2xl border-2 font-black">
                Browse art
              </Button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const StatusIcon = summary.statusMeta.Icon;
  const activeJourneyIndex = getJourneyIndex(order.status);

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.18),rgba(239,225,197,0.78)_24%,rgba(231,247,240,0.58)_76%,rgba(90,52,36,0.14)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center opacity-95" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(67,37,23,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute -left-20 top-24 -z-10 h-56 w-56 rounded-full border border-primary/10" />
      <div className="absolute -right-24 top-[520px] -z-10 h-72 w-72 rounded-full border border-emerald-700/10" />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <section className="mh-fade-up relative mb-7 overflow-hidden rounded-[1.5rem] border border-white/55 bg-[#2b1710]/88 text-white shadow-[0_32px_100px_-55px_rgba(43,23,16,0.9)] backdrop-blur-xl sm:rounded-[2rem]">
          <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(43,23,16,0.34),rgba(43,23,16,0.92)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center opacity-48" />
          <Badge className={`${summary.statusMeta.badge} absolute right-4 top-5 z-10 hidden border-none px-5 py-2 text-sm font-black shadow-[0_16px_35px_-24px_rgba(6,95,70,0.7)] backdrop-blur-xl sm:inline-flex lg:right-10 lg:top-10`}>
            <StatusIcon className="h-4 w-4" />
            {summary.statusMeta.label}
          </Badge>
          <div className="relative grid gap-7 p-4 sm:p-6 lg:grid-cols-[1fr_360px] lg:p-10">
            <div className="space-y-5">
              <Button
                variant="outline"
                onClick={() => router.push("/orders")}
                className="mh-press h-10 rounded-xl border-white/20 bg-white/10 text-white hover:bg-white hover:text-[#2b1710]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to orders
              </Button>

              <div>
                <Badge className={`${summary.statusMeta.badge} border-none px-4 py-2 font-black sm:hidden`}>
                  <StatusIcon className="h-4 w-4" />
                  {summary.statusMeta.label}
                </Badge>
                <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  {summary.statusMeta.headline}
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-stone-300 md:text-base">
                  {summary.statusMeta.copy}
                </p>
              </div>

              <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-white/12 px-4 py-3 text-xs font-bold text-stone-200 backdrop-blur-xl">
                <span className="font-black uppercase tracking-widest text-amber-100">Order ID</span>
                <span className="break-all font-mono">{order.orderId}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 self-end">
              <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                <ShoppingBag className="mb-3 h-5 w-5 text-amber-200" />
                <p className="text-2xl font-black">{order.items.length}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">Items</p>
              </div>
              <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                <Palette className="mb-3 h-5 w-5 text-rose-200" />
                <p className="text-2xl font-black">{summary.totalPieces}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">Pieces</p>
              </div>
              <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                <CreditCard className="mb-3 h-5 w-5 text-emerald-200" />
                <p className="break-words text-xl font-black">{formatAmount(order.toPay)}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">Value</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mh-scroll-reveal mb-7 overflow-hidden rounded-[1.35rem] border border-[#fff2d2]/70 bg-[#fff8e7]/62 p-4 shadow-[0_20px_70px_-50px_rgba(69,32,15,0.65)] backdrop-blur-xl md:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="museum-label">Order Journey</p>
              <h2 className="mt-1 text-2xl font-black text-[#2b1710]">Craft movement</h2>
            </div>
            <p className="text-xs font-bold text-stone-500">
              Last updated {summary.updatedDate}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {journeySteps.map((step, index) => {
              const isDone = activeJourneyIndex >= index;
              const isCurrent = activeJourneyIndex === index;
              const isBlocked = activeJourneyIndex < 0;
              const StepIcon = step.Icon;

              return (
                <div
                  key={step.key}
                  className={`mh-tab-option rounded-2xl border p-4 ${
                    isCurrent && !isBlocked
                      ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-800 shadow-[0_18px_42px_-30px_rgba(4,120,87,0.62)]"
                      : isDone && !isBlocked
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : "border-white/60 bg-white/42 text-stone-500"
                  }`}
                  data-active={isDone && !isBlocked}
                >
                  <div className="flex items-center gap-3 md:block">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                      isCurrent && !isBlocked
                        ? "border-emerald-500/20 bg-white text-emerald-700"
                        : isDone && !isBlocked
                        ? "border-primary/15 bg-white text-primary"
                        : "border-stone-200 bg-white/62 text-stone-400"
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div className="md:mt-3">
                      <p className="text-sm font-black">{step.label}</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest opacity-70">
                        {isDone && !isBlocked ? "Done" : "Upcoming"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <div className="mh-scroll-reveal relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#fff8e7]/66 p-4 shadow-[0_20px_70px_-48px_rgba(69,32,15,0.7)] backdrop-blur-xl sm:p-5">
              <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="museum-label">Selected Pieces</p>
                  <h2 className="mt-1 text-2xl font-black text-[#2b1710]">Items in this order</h2>
                </div>
                <Button variant="outline" onClick={() => router.push("/shop")} className="mh-press rounded-2xl border-2 bg-white/58 font-black">
                  Collect more
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => {
                  const originalTotal = item.unitPrice * item.quantity;
                  const saved = Math.max(originalTotal - item.totalAmount, 0);

                  return (
                    <article
                      key={item.orderItemId}
                      className="mh-card-hover grid gap-4 rounded-[1.25rem] border border-white/65 bg-white/50 p-3 shadow-sm backdrop-blur-xl min-[520px]:grid-cols-[96px_minmax(0,1fr)]"
                    >
                      <div className="h-48 overflow-hidden rounded-2xl border border-white/70 bg-stone-100 min-[520px]:h-24">
                        <img
                          src={item.imageUrl || fallbackImage}
                          alt={item.productName}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="grid min-w-0 gap-3 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-center">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                            {item.variantLabel || "Handmade item"}
                          </p>
                          <h3 className="mt-1 truncate text-lg font-black text-[#2b1710]">
                            {item.productName}
                          </h3>
                          <p className="mt-1 text-xs font-bold text-stone-500">
                            Qty {item.quantity}
                            {item.uom ? ` | Size ${item.packSize} ${item.uom}` : ""}
                          </p>
                        </div>
                        <div className="text-left min-[520px]:text-right">
                          {saved > 0 && (
                            <p className="mb-1 text-xs font-black text-emerald-700">
                              Saved {formatAmount(saved)}
                            </p>
                          )}
                          <p className="text-lg font-black text-[#2b1710]">
                            {formatAmount(item.totalAmount)}
                          </p>
                          {item.discountedPrice < item.unitPrice && (
                            <p className="text-xs font-bold text-stone-400 line-through">
                              {formatAmount(originalTotal)}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mh-scroll-reveal grid gap-3 md:grid-cols-3">
              {supportCards.map((card) => (
                <div key={card.title} className="mh-card-hover rounded-2xl border border-[#fff2d2]/70 bg-[#fff8e7]/58 p-4 shadow-sm backdrop-blur-xl">
                  <card.Icon className="mh-icon-glow h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-sm font-black text-stone-950">{card.title}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-stone-600">{card.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="mh-card-hover relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#fff8e7]/66 p-5 shadow-[0_24px_80px_-52px_rgba(69,32,15,0.75)] backdrop-blur-2xl">
              <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="museum-label">Delivery Address</p>
                  <h2 className="text-lg font-black text-[#2b1710]">Ship to</h2>
                </div>
              </div>
              <div className="space-y-2 text-sm font-semibold leading-6 text-stone-600">
                <p className="text-base font-black text-[#2b1710]">{order.address.fullName}</p>
                <p className="font-bold text-primary">{order.address.phoneNumber}</p>
                <Separator />
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                <p>
                  {order.address.city}, {order.address.state} - {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
              </div>
            </div>

            <div className="mh-card-hover relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#2b1710]/90 p-5 text-white shadow-[0_30px_100px_-58px_rgba(43,23,16,0.95)] backdrop-blur-2xl">
              <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-100">Payment Summary</p>
                  <h2 className="mt-1 text-2xl font-black">Order total</h2>
                </div>
                <CreditCard className="h-6 w-6 text-amber-100" />
              </div>
              <div className="space-y-3 text-sm font-bold">
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Subtotal</span>
                  <span>{formatAmount(summary.subtotal)}</span>
                </div>
                {summary.savings > 0 && (
                  <div className="flex justify-between gap-4 text-emerald-300">
                    <span>Discount saved</span>
                    <span>- {formatAmount(summary.savings)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Handling fee</span>
                  <span>{formatAmount(order.handlingFee)}</span>
                </div>
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Delivery fee</span>
                  <span>{formatAmount(order.deliveryPartnerFee)}</span>
                </div>
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Platform fee</span>
                  <span>{formatAmount(order.platformFee)}</span>
                </div>
                <Separator className="bg-white/12" />
                <div className="flex items-end justify-between gap-4 pt-1">
                  <span className="text-lg font-black">Payable</span>
                  <span className="text-3xl font-black">{formatAmount(order.toPay)}</span>
                </div>
              </div>
            </div>

            <div className="mh-card-hover relative overflow-hidden rounded-[1.35rem] border border-[#fff2d2]/70 bg-[#fff8e7]/64 p-4 shadow-sm backdrop-blur-xl">
              <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-70" />
              <div className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-black text-[#2b1710]">Collector care</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-stone-600">
                    Handmade pieces are checked and packed carefully before dispatch.
                  </p>
                </div>
              </div>
            </div>

            <div className="mh-card-hover rounded-[1.35rem] border border-[#fff2d2]/70 bg-white/54 p-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-black text-[#2b1710]">Continue collecting</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-stone-600">
                    Explore similar paintings, kapra, decor and festive craft pieces.
                  </p>
                  <Button onClick={() => router.push("/shop")} variant="outline" className="mh-press mt-4 h-10 rounded-xl border-2 bg-white/64 font-black">
                    Browse shop
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
