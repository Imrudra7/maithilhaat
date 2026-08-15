"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  ChevronRight,
  Gift,
  LockKeyhole,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cartService } from "@/lib/services/cart-service";
import { productService } from "@/lib/services/product-service";
import { CartItemResponse, CartResponse } from "@/types/cart";

const FALLBACK_PRODUCT_IMAGE = "/images/maithil-art-gallery-hero.png";

const trustNotes = [
  { icon: ShieldCheck, title: "Secure checkout", copy: "Encrypted payment flow" },
  { icon: Truck, title: "Craft-safe delivery", copy: "Packed for handmade pieces" },
  { icon: BadgeCheck, title: "Artisan verified", copy: "Curated MaithilHaat picks" },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [productSlugs, setProductSlugs] = useState<Record<string, string>>({});

  const hydrateProductSlugs = async (cartItems: CartItemResponse[]) => {
    const missingProductIds = Array.from(
      new Set(
        cartItems
          .filter((item) => !(item.slug || item.productSlug))
          .map((item) => item.productId)
          .filter((productId) => productId && !productSlugs[productId])
      )
    );

    if (missingProductIds.length === 0) return;

    try {
      const products = await productService.getAllProducts();
      const neededProductIds = new Set(missingProductIds);
      const resolvedSlugs = products
        .filter((product) => neededProductIds.has(product.id) && product.slug)
        .map((product) => [product.id, product.slug] as const);

      setProductSlugs((current) => ({
        ...current,
        ...Object.fromEntries(resolvedSlugs),
      }));
    } catch {
      // Cart remains usable even if product links cannot be hydrated.
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const response = await cartService.getCart();
        setCart(response);
        void hydrateProductSlugs(response.items ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
    // Initial cart hydration should run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cart?.items ?? [];
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const getProductHref = (item: CartItemResponse) => {
    const slug = item.slug || item.productSlug || productSlugs[item.productId];
    return slug ? `/product/${slug}` : undefined;
  };

  const getProductImage = (item: CartItemResponse) =>
    typeof item.imageUrl === "string" && item.imageUrl
      ? item.imageUrl
      : FALLBACK_PRODUCT_IMAGE;

  const formatAmount = (amount: number) => `Rs ${amount.toLocaleString()}`;

  const updateQuantity = async (cartItemId: string, delta: number) => {
    setLoading(true);
    const updatedCart = await cartService.updateCart({
      cartItemId,
      method: delta > 0 ? "CART_INCREASE_ITEM" : "CART_DECREASE_ITEM",
    });

    setCart(updatedCart);
    void hydrateProductSlugs(updatedCart.items ?? []);
    setLoading(false);
  };

  const removeItem = async (cartItemId: string) => {
    setLoading(true);
    const updatedCart = await cartService.deleteItem({
      cartItemId,
    });

    setCart(updatedCart);
    void hydrateProductSlugs(updatedCart.items ?? []);
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.2),rgba(239,225,197,0.78)_38%,rgba(231,247,240,0.48)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center" />
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <div className="mh-fade-up relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#f4dfbd]/64 p-8 text-center shadow-[0_30px_100px_-58px_rgba(69,32,15,0.86)] backdrop-blur-2xl">
            <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
            <ShoppingBag className="mh-float-soft mx-auto mb-4 h-9 w-9 text-primary" />
            <p className="text-sm font-black uppercase tracking-widest text-[#2b1710]">
              Cart taiyar ho raha hai
            </p>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = Number(cart?.itemTotalAmount ?? 0);
  const discountedSubtotal = Number(cart?.discountedItemTotalAmount ?? 0);
  const totalSavings = Math.max(subtotal - discountedSubtotal, 0);
  const deliveryFee = Number(cart?.deliveryPartnerFee ?? 0);
  const handlingFee = Number(cart?.handlingFee ?? 0);
  const platformFee = Number(cart?.platformFee ?? 0);
  const totalAmount = Number(cart?.toPay ?? 0);

  return (
    <main className="relative overflow-hidden pb-12">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(43,23,16,0.18),rgba(239,225,197,0.82)_28%,rgba(255,248,231,0.82)_68%,rgba(231,247,240,0.46)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center opacity-95" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(69,32,15,0.12)_1px,transparent_0)] bg-[length:24px_24px]" />

      <div className="container mx-auto px-4 py-6 md:py-10">
        <section className="mh-fade-up relative mb-6 overflow-hidden rounded-[1.5rem] border border-white/40 bg-[#2b1710]/88 p-5 text-white shadow-[0_32px_100px_-55px_rgba(43,23,16,0.9)] backdrop-blur-xl sm:rounded-[2rem] md:p-8">
          <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(43,23,16,0.4),rgba(43,23,16,0.9)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center opacity-55" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-100 backdrop-blur">
                <Sparkles className="h-4 w-4 text-amber-200" />
                <span className="truncate">MaithilHaat collection bag</span>
              </div>
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Apan pasandida kala checkout ke liye taiyar.
              </h1>
              <p className="mt-4 max-w-xl text-sm font-bold leading-7 text-stone-200 sm:text-base">
                Review your handmade picks, adjust quantities, and move ahead with a clean secure checkout.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                <p className="text-2xl font-black">{items.length}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">
                  Products
                </p>
              </div>
              <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                <p className="text-2xl font-black">{itemCount}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">
                  Pieces
                </p>
              </div>
              <div className="mh-card-hover rounded-2xl border border-white/15 bg-white/14 p-4 backdrop-blur-xl">
                <p className="text-2xl font-black">
                  {totalSavings > 0 ? formatAmount(totalSavings) : "0"}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-300">
                  Savings
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-8">
          <section className="space-y-4">
            {items.length > 0 && (
              <div className="mh-scroll-reveal flex flex-col gap-3 rounded-[1.35rem] border border-[#fff2d2]/70 bg-[#fff8e7]/62 p-4 shadow-[0_20px_70px_-50px_rgba(69,32,15,0.65)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary">
                    Review pieces
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[#2b1710]">
                    Your cart items
                  </h2>
                </div>
                <Button asChild variant="outline" className="mh-press rounded-2xl border-2 bg-white/58 font-black">
                  <Link href="/shop">
                    Continue shopping
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            <div className="mh-stagger space-y-4">
              {items.map((item) => {
                const productHref = getProductHref(item);
                const itemUnitPrice = Number(item.unitPrice);
                const itemSalePrice = Number(item.discountedPrice);
                const lineTotal = itemSalePrice * item.quantity;
                const lineOriginal = itemUnitPrice * item.quantity;
                const lineSaving = Math.max(lineOriginal - lineTotal, 0);
                const productImage = (
                  <img
                    src={getProductImage(item)}
                    alt={item.productName ?? "Cart product"}
                    className="h-full w-full object-cover transition duration-500 group-hover/product-image:scale-110"
                  />
                );

                return (
                  <article
                    key={item.cartItemId}
                    className="mh-card-hover group relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#fff8e7]/68 p-3 shadow-[0_20px_70px_-48px_rgba(69,32,15,0.78)] backdrop-blur-xl hover:border-amber-200/80 hover:bg-[#fff3d7]/74 sm:p-4"
                  >
                    <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
                    <div className="grid gap-4 sm:grid-cols-[132px_minmax(0,1fr)]">
                      <div className="h-52 overflow-hidden rounded-[1.15rem] border border-white/70 bg-[#2b1710]/10 sm:h-36">
                        {productHref ? (
                          <Link
                            href={productHref}
                            aria-label={`View ${item.productName ?? "product"}`}
                            className="group/product-image block h-full w-full"
                          >
                            {productImage}
                          </Link>
                        ) : (
                          productImage
                        )}
                      </div>

                      <div className="flex min-w-0 flex-col justify-between gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-widest text-primary/80">
                              {item.variantLabel || "Handmade pick"}
                            </p>
                            {productHref ? (
                              <Link
                                href={productHref}
                                className="group/product-name mt-1 inline-block"
                              >
                                <h3 className="text-xl font-black leading-tight text-[#2b1710] transition-colors duration-300 group-hover/product-name:text-primary">
                                  <span className="bg-[linear-gradient(90deg,#a23a2d,#d08b26,#006b5c)] bg-[length:0_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size,color] duration-500 ease-out group-hover/product-name:bg-[length:100%_2px]">
                                    {item.productName}
                                  </span>
                                </h3>
                              </Link>
                            ) : (
                              <h3 className="mt-1 text-xl font-black leading-tight text-[#2b1710]">
                                {item.productName}
                              </h3>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="mh-press flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#2b1710]/10 bg-white/62 text-stone-400 shadow-sm backdrop-blur transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove ${item.productName ?? "product"}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid gap-3 min-[460px]:grid-cols-[auto_1fr] min-[460px]:items-end">
                          <div className="flex w-fit items-center gap-2 rounded-2xl border border-[#2b1710]/10 bg-white/58 p-1.5 shadow-inner backdrop-blur-xl">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="mh-press flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff8e7] text-[#2b1710] shadow-sm transition-colors hover:bg-primary hover:text-white"
                              aria-label={`Decrease ${item.productName ?? "product"}`}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="min-w-7 text-center text-base font-black text-[#2b1710]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="mh-press flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff8e7] text-[#2b1710] shadow-sm transition-colors hover:bg-primary hover:text-white"
                              aria-label={`Increase ${item.productName ?? "product"}`}
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-end justify-between gap-2 min-[460px]:justify-end min-[460px]:text-right">
                            {lineSaving > 0 && (
                              <span className="rounded-full border border-emerald-700/10 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                Saved {formatAmount(lineSaving)}
                              </span>
                            )}
                            <div>
                              <p className="text-xl font-black text-[#2b1710]">
                                {formatAmount(lineTotal)}
                              </p>
                              {itemUnitPrice > itemSalePrice && (
                                <p className="text-xs font-bold text-stone-400 line-through">
                                  {formatAmount(lineOriginal)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {items.length === 0 && (
              <section className="mh-fade-up relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#f4dfbd]/58 p-6 text-center shadow-[0_30px_100px_-58px_rgba(69,32,15,0.78)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">
                <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-white/70 bg-white/54 text-primary shadow-inner">
                  <ShoppingBag className="h-9 w-9" />
                </div>
                <h2 className="mt-6 text-3xl font-black text-[#2b1710]">
                  Cart abhi khaali hai
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-6 text-stone-600">
                  Paintings, kapra, decor aur festive pieces add karke apna MaithilHaat collection shuru kariye.
                </p>
                <Button asChild className="mh-press mh-shine mt-7 h-12 rounded-2xl px-6 font-black">
                  <Link href="/shop">
                    Shop collection
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </section>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <Card className="mh-fade-up-delay-1 relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#2b1710]/90 p-5 text-white shadow-[0_30px_100px_-58px_rgba(43,23,16,0.95)] backdrop-blur-2xl">
              <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-amber-100">
                    Order details
                  </p>
                  <h2 className="mt-1 text-2xl font-black">To pay</h2>
                </div>
                <div className="mh-icon-glow flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/12">
                  <PackageCheck className="h-6 w-6 text-amber-100" />
                </div>
              </div>

              <div className="space-y-3 text-sm font-bold">
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Subtotal</span>
                  <span>{formatAmount(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4 text-emerald-300">
                  <span>Total savings</span>
                  <span>- {formatAmount(totalSavings)}</span>
                </div>
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Handling fee</span>
                  <span>{formatAmount(handlingFee)}</span>
                </div>
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Delivery fee</span>
                  <span>{formatAmount(deliveryFee)}</span>
                </div>
                <div className="flex justify-between gap-4 text-stone-300">
                  <span>Platform fee</span>
                  <span>{formatAmount(platformFee)}</span>
                </div>

                <Separator className="bg-white/12" />

                <div className="flex items-end justify-between gap-4 pt-1">
                  <span className="text-lg font-black">Payable</span>
                  <span className="text-3xl font-black">
                    {formatAmount(totalAmount)}
                  </span>
                </div>
              </div>

              {items.length > 0 ? (
                <Button
                  asChild
                  className="mh-press mh-shine mt-7 h-14 w-full rounded-2xl text-base font-black"
                >
                  <Link href="/checkout">
                    Checkout now
                    <ChevronRight size={20} />
                  </Link>
                </Button>
              ) : (
                <Button
                  disabled
                  className="mt-7 h-14 w-full rounded-2xl text-base font-black"
                >
                  Add items to checkout
                </Button>
              )}
            </Card>

            <div className="mh-card-hover relative overflow-hidden rounded-[1.35rem] border border-[#fff2d2]/70 bg-[#fff8e7]/64 p-4 shadow-sm backdrop-blur-xl">
              <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-70" />
              <div className="mb-4 flex items-center gap-3">
                <Gift className="mh-icon-glow h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-black text-[#2b1710]">
                    Handmade care note
                  </p>
                  <p className="text-xs font-bold text-stone-500">
                    Fragile aur textile items carefully packed honge.
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {trustNotes.map((note) => (
                  <div
                    key={note.title}
                    className="flex gap-3 rounded-2xl border border-white/65 bg-white/48 p-3"
                  >
                    <note.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-black text-[#2b1710]">
                        {note.title}
                      </p>
                      <p className="text-xs font-bold text-stone-500">
                        {note.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mh-card-hover rounded-[1.35rem] border border-[#fff2d2]/70 bg-white/54 p-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-xs font-bold leading-5 text-stone-600">
                  Payment, address aur order data secure flow se process hoga before final confirmation.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
