'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { productService } from '@/lib/services/product-service';
import { ProductResponse, ProductVariantResponse } from '@/types/product';
import { toast } from 'sonner';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Product Data on Load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductBySlug(slug as string);
        setProduct(data);
        // Default: Pehla variant select kar lo
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        toast.error("Bhai, painting load nahi ho payi!");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Painting nahi mili!</h2>
        <Button onClick={() => window.history.back()}>Wapas Chalein</Button>
      </div>
    );
  }

  // Discount Calculate karne ke liye helper
  const discount = selectedVariant 
    ? Math.round(((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* 1. Left Column: Image Gallery */}
        <div className="flex-1 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3"} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* 2. Right Column: Details */}
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <div className="flex gap-2">
               <Badge variant="secondary" className="font-bold text-primary bg-primary/10 tracking-tight">
                 {product.type === 'PHYSICAL' ? 'Authentic Handmade' : product.type}
               </Badge>
               {selectedVariant && selectedVariant.stockQuantity < 5 && (
                 <Badge variant="destructive" className="animate-pulse">Only {selectedVariant.stockQuantity} left!</Badge>
               )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                  <Star size={16} className="fill-green-600 text-green-600" />
                  <span className="text-sm font-bold text-green-700">4.9</span>
               </div>
               <span className="text-sm text-slate-400 font-medium tracking-tight">Artist: {product.attributes.artist || 'Maithil Haat Artisans'}</span>
            </div>
          </div>

          {/* Pricing Logic */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-slate-900">₹{selectedVariant?.salePrice}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through font-medium">₹{selectedVariant?.price}</span>
                  <Badge className="bg-red-600 font-bold border-none">{discount}% OFF</Badge>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase italic">Hurry! Prices may change</p>
          </div>

          <p className="text-slate-600 leading-relaxed font-medium">
            {product.description}
          </p>

          {/* Variant Selector: JSONB variantAttributes Mapping */}
          <div className="space-y-4 border-t border-b py-6">
            <div className="space-y-3">
              <Label className="text-sm font-black uppercase tracking-widest text-slate-500">Choose Option</Label>
              <RadioGroup 
                value={selectedVariant?.id} 
                onValueChange={(val) => setSelectedVariant(product.variants.find(v => v.id === val) || null)}
                className="flex flex-wrap gap-4"
              >
                {product.variants.map((variant) => {
                  // JSONB se label nikal rahe hain (e.g. size)
                  const variantLabel = Object.values(variant.variantAttributes).join(" / ");
                  return (
                    <div key={variant.id} className="flex items-center">
                      <RadioGroupItem value={variant.id} id={variant.id} className="peer sr-only" />
                      <Label
                        htmlFor={variant.id}
                        className="px-5 py-3 border-2 rounded-2xl font-bold cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary transition-all hover:bg-slate-50"
                      >
                        {variantLabel}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1 h-14 rounded-2xl font-black text-lg gap-3 shadow-2xl shadow-primary/30 transition-all active:scale-95"
              disabled={selectedVariant?.stockQuantity === 0}
            >
              <ShoppingBag size={20} />
              {selectedVariant?.stockQuantity === 0 ? 'Out of Stock' : 'Add to Haat'}
            </Button>
            <Button size="lg" variant="outline" className="h-14 w-14 rounded-2xl border-2 hover:bg-red-50 hover:border-red-200 group">
              <Heart size={24} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </Button>
          </div>

          {/* Product Highlights (Attributes) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-4 bg-slate-50/50 rounded-3xl px-6 border border-slate-100">
             {Object.entries(product.attributes).map(([key, value]) => (
               <div key={key}>
                 <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{key}</p>
                 <p className="font-bold text-xs text-slate-700 capitalize">{String(value)}</p>
               </div>
             ))}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: ShieldCheck, text: "Secure Haat" },
              { icon: Truck, text: "Fast Delivery" },
              { icon: RotateCcw, text: "Easy Return" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1">
                <item.icon className="text-primary" size={20} />
                <span className="text-[9px] font-black uppercase tracking-tight text-slate-500">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}