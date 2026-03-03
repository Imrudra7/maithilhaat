// src/components/sections/FeaturedProducts.tsx
'use client';

import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product'; 
import Link from 'next/link';

const products: Product[] = [
  {
    id: "p1",
    name: "Classic Madhubani Tree of Life",
    categoryId: "cat-123",
    merchantId: "mer-456",
    description: "Authentic handmade painting",
    type: "PHYSICAL",
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    isActive: true,
    attributes: { material: "Handmade Paper", origin: "Bihar" },
    variants: [
      {
        id: "v1",
        skuCode: "MD-TOL-01",
        price: 2499,
        salePrice: 1999,
        stockQuantity: 15,
        variantAttributes: { size: "A4" },
        isActive: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "p2",
    name: "Handpainted Silk Saree - Lotus",
    categoryId: "cat-456",
    merchantId: "mer-789",
    description: "Premium silk with Mithila motifs",
    type: "PHYSICAL",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    isActive: true,
    attributes: { material: "Pure Silk", craft: "Handpainted" },
    variants: [
      {
        id: "v2",
        skuCode: "SK-LOT-02",
        price: 9500,
        salePrice: 8500,
        stockQuantity: 5,
        variantAttributes: { color: "Cream" },
        isActive: true
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function FeaturedProducts() {
  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); // 🔥 Yeh line redirect hone se rokegi
    e.stopPropagation(); // Bubbling rokhne ke liye
    console.log(`Added product ${productId} to cart`);
    // Yahan tumhara cart logic aayega
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      {products.map((product) => {
        const displayVariant = product.variants.find(v => v.isActive) || product.variants[0];
        const hasDiscount = displayVariant.price > displayVariant.salePrice;
        const discountPercentage = hasDiscount 
          ? Math.round(((displayVariant.price - displayVariant.salePrice) / displayVariant.price) * 100) 
          : 0;

        return (
          /* 🔥 Link se wrap kiya hai taaki poora card clickable ho */
          <Link 
            key={product.id} 
            href={`/product/${product.id}`} 
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden">
              {hasDiscount && (
                <Badge className="absolute top-3 left-3 z-10 bg-red-600 text-white font-black border-none">
                  {discountPercentage}% OFF
                </Badge>
              )}
              
              <button 
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <Heart size={18} />
              </button>
              
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Action Button (Instamart Feel) */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                <Button 
                  className="w-full font-bold gap-2 rounded-xl h-11 shadow-lg"
                  onClick={(e) => handleAddToCart(e, product.id)}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{product.attributes?.material || "Handmade"}</span>
                <span className="flex items-center gap-1">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  4.8
                </span>
              </div>

              <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors text-sm md:text-base">
                {product.name}
              </h3>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-black text-slate-900">
                    ₹{displayVariant.salePrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      ₹{displayVariant.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {displayVariant.stockQuantity < 10 && (
                  <span className="text-[10px] text-red-500 font-bold mt-1">
                    Only {displayVariant.stockQuantity} left!
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}