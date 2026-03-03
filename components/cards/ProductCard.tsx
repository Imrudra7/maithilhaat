'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { ProductResponse } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
    product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
    // 💰 Variant mein se sabse kam price nikalna (MRP aur Sale Price dono)
    const lowestSalePrice = product.variants.length > 0
        ? Math.min(...product.variants.map(v => v.salePrice))
        : 0;

    const originalPrice = product.variants.find(v => v.salePrice === lowestSalePrice)?.price || 0;

    const discount = originalPrice > lowestSalePrice
        ? Math.round(((originalPrice - lowestSalePrice) / originalPrice) * 100)
        : 0;

    return (
        <div className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            {/* Wishlist Button */}
            <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                <Heart size={18} />
            </button>

            {/* Discount Badge */}
            {discount > 0 && (
                <Badge className="absolute top-4 left-4 z-10 bg-red-600 font-bold border-none">
                    {discount}% OFF
                </Badge>
            )}

            {/* Product Image */}
            <Link href={`/product/${product.slug}`}>
                <div className="aspect-[4/5] overflow-hidden bg-slate-50">
                    <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="p-4 space-y-2">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">
                        Handmade Art
                    </p>
                    <Link href={`/product/${product.slug}`}>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-slate-900">₹{lowestSalePrice}</span>
                    {discount > 0 && (
                        <span className="text-xs text-slate-400 line-through font-bold">₹{originalPrice}</span>
                    )}
                </div>

                {/* Quick Add Button */}
                <Button
                    variant="outline"
                    className="w-full rounded-xl font-bold gap-2 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all group/btn"
                >
                    <ShoppingBag size={16} className="group-hover/btn:animate-bounce" />
                    Add to Haat
                </Button>
            </div>
        </div>
    );
}