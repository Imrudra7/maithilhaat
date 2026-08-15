'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Heart, Palette, ShoppingBag } from 'lucide-react';
import { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
    product: ProductResponse;
}

const fallbackImage = '/images/maithil-art-gallery-hero.png';

export default function ProductCard({ product }: ProductCardProps) {
    const activeVariants = product.variants.filter((variant) => variant.isActive);
    const variants = activeVariants.length > 0 ? activeVariants : product.variants;
    const lowestSalePrice = variants.length > 0 ? Math.min(...variants.map((variant) => variant.salePrice)) : 0;
    const originalPrice = variants.find((variant) => variant.salePrice === lowestSalePrice)?.price || 0;
    const discount = originalPrice > lowestSalePrice
        ? Math.round(((originalPrice - lowestSalePrice) / originalPrice) * 100)
        : 0;
    const material = product.attributes?.material ?? product.attributes?.craft ?? product.type;
    const artist = product.attributes?.artist ?? product.attributes?.origin ?? 'Maithil artisan';

    return (
        <article className="mh-card-hover group relative flex min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-[#fff2d2]/70 bg-[#fff8e7]/54 shadow-[0_20px_70px_-46px_rgba(69,32,15,0.75)] backdrop-blur-xl hover:border-amber-200/80 hover:bg-[#fff3d7]/70 hover:shadow-[0_30px_90px_-52px_rgba(69,32,15,0.95)]">
            <div className="mh-rang-strip absolute inset-x-0 top-0 z-10 h-1 opacity-80" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(90deg,rgba(185,28,28,0.07)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.055)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                {discount > 0 && (
                    <Badge className="w-fit border-none bg-red-600 font-black text-white shadow-sm">
                        {discount}% OFF
                    </Badge>
                )}
                <Badge variant="secondary" className="w-fit bg-white/90 text-[10px] font-black text-primary shadow-sm backdrop-blur">
                    Handmade
                </Badge>
            </div>

            <button
                type="button"
                aria-label={`Add ${product.name} to wishlist`}
                className="mh-press absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-400 shadow-sm backdrop-blur transition-colors hover:text-red-500"
            >
                <Heart className="h-4 w-4" />
            </button>

            <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <img
                        src={product.imageUrl || fallbackImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241711]/85 via-[#241711]/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-[#241711]">
                            View artwork <ArrowUpRight className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </Link>

            <div className="relative flex flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Palette className="h-3 w-3 text-primary" />
                        <span className="truncate">{String(material)}</span>
                    </p>
                    <Link href={`/product/${product.slug}`}>
                        <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 text-stone-950 transition-colors group-hover:text-primary sm:text-base">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="truncate text-xs font-semibold text-stone-500">{String(artist)}</p>
                </div>

                <div className="mt-auto space-y-3">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-lg font-black text-[#25140d] sm:text-xl">Rs {lowestSalePrice.toLocaleString()}</span>
                        {discount > 0 && (
                            <span className="text-xs font-bold text-stone-400 line-through">Rs {originalPrice.toLocaleString()}</span>
                        )}
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="mh-press mh-shine w-full rounded-xl border-2 border-[#2b1710]/10 bg-[#fff8e7]/70 text-xs font-black text-[#2b1710] hover:border-primary hover:bg-primary hover:text-white sm:text-sm"
                    >
                        <Link href={`/product/${product.slug}`}>
                            <ShoppingBag className="h-4 w-4" />
                            Choose Piece
                        </Link>
                    </Button>
                </div>
            </div>
        </article>
    );
}
