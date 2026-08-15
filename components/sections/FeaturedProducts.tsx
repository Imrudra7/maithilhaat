// src/components/sections/FeaturedProducts.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, PackageOpen, ShoppingBag, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { productService } from '@/lib/services/product-service';
import { ProductResponse, ProductVariantResponse } from '@/types/product';

const fallbackImage = '/images/maithil-art-gallery-hero.png';

function getDisplayVariant(product: ProductResponse): ProductVariantResponse | undefined {
  return product.variants.find((variant) => variant.isActive) ?? product.variants[0];
}

function getDiscount(variant?: ProductVariantResponse) {
  if (!variant || variant.price <= variant.salePrice) return 0;
  return Math.round(((variant.price - variant.salePrice) / variant.price) * 100);
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Featured products load fail!', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = useMemo(() => {
    return products
      .filter((product) => product.isActive && product.variants?.length > 0)
      .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
      .slice(0, 8);
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/65 bg-[#fff8e7]/42 shadow-sm backdrop-blur-xl">
            <div className="aspect-[4/5] bg-[#ead7b8]/55 animate-pulse" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-24 rounded bg-[#ead7b8]/70 animate-pulse" />
              <div className="h-4 w-full rounded bg-[#ead7b8]/70 animate-pulse" />
              <div className="h-5 w-20 rounded bg-[#ead7b8]/70 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="mh-fade-up relative flex min-h-72 flex-col items-center justify-center gap-4 overflow-hidden rounded-[2rem] border border-[#fff2d2]/65 bg-[linear-gradient(135deg,rgba(255,236,196,0.72),rgba(237,214,174,0.48)),url('/images/mithila-thekua-showcase.png')] bg-cover bg-center px-6 text-center shadow-[0_24px_80px_-48px_rgba(69,32,15,0.7)] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[#f8ead0]/64 backdrop-blur-[2px]" />
        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1" />
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full border border-primary/10" />
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full border border-emerald-700/10" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(185,28,28,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute bottom-8 left-8 hidden text-7xl font-black leading-none text-primary/[0.045] md:block">माछ</div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-[#fff8e7]/68 text-primary shadow-sm backdrop-blur-xl">
          <PackageOpen className="h-8 w-8" />
        </div>
        <div className="relative">
          <h3 className="text-2xl font-black text-[#25140d]">Abhi naya sangrah taiyar ho raha hai</h3>
          <p className="mt-2 text-sm font-semibold text-stone-600">Kalakar naye pieces ko haat ke liye taiyar kar rahe hain.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {featuredProducts.map((product) => {
        const displayVariant = getDisplayVariant(product);
        const discount = getDiscount(displayVariant);
        const material = product.attributes?.material ?? product.attributes?.craft ?? 'Handmade';
        const stockQuantity = displayVariant?.stockQuantity ?? 0;

        return (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="mh-card-hover group relative flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/65 bg-[#fff8e7]/50 shadow-[0_20px_70px_-46px_rgba(69,32,15,0.75)] backdrop-blur-xl hover:border-amber-200/80 hover:bg-[#fff3d7]/70 hover:shadow-[0_30px_90px_-52px_rgba(69,32,15,0.95)]"
          >
            <div className="mh-rang-strip absolute inset-x-0 top-0 z-10 h-1 opacity-80" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(90deg,rgba(185,28,28,0.07)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.055)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
              {discount > 0 && (
                <Badge className="absolute left-3 top-4 z-10 border-none bg-red-600 text-white font-black shadow-sm">
                  {discount}% OFF
                </Badge>
              )}

              <button
                type="button"
                aria-label={`Add ${product.name} to wishlist`}
                className="mh-press absolute right-3 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-stone-400 shadow-sm backdrop-blur-xl transition-colors hover:text-red-500"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
              </button>

              <img
                src={product.imageUrl || fallbackImage}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#241711]/90 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
                <Button className="mh-press h-10 w-full rounded-xl font-black gap-2 bg-white text-[#241711] hover:bg-amber-100">
                  <ShoppingBag className="h-4 w-4" />
                  Piece dekhiye
                </Button>
              </div>
            </div>

            <div className="relative flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400">
                <span className="truncate">{String(material)}</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  4.8
                </span>
              </div>

              <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 text-[#25140d] transition-colors group-hover:text-primary md:text-base">
                {product.name}
              </h3>

              <div className="mt-auto space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-black text-slate-950 md:text-xl">
                    Rs {displayVariant?.salePrice.toLocaleString()}
                  </span>
                  {discount > 0 && displayVariant && (
                    <span className="text-xs font-bold text-stone-400 line-through">
                      Rs {displayVariant.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-black ${stockQuantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
