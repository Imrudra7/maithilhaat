'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Loader2, Palette, RotateCcw, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { productService } from '@/lib/services/product-service';
import { ProductResponse, ProductVariantResponse } from '@/types/product';
import { notify } from '@/lib/notify';
import { cartService } from '@/lib/services/cart-service';

const fallbackImage = '/images/maithil-art-gallery-hero.png';

function getApiMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: string }).message || fallback);
  }

  return fallback;
}

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductBySlug(slug as string);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants.find((variant) => variant.isActive) ?? data.variants[0]);
        }
      } catch (error) {
        console.error('Product fetch error:', error);
        notify.error('Artwork could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) {
      notify.warning('Please choose an option first.');
      return;
    }

    try {
      setIsAddingToCart(true);
      await cartService.addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
      });
    } catch (error: unknown) {
      console.error('Add to cart error:', error);
      notify.error(getApiMessage(error, 'Could not add this piece to your bag.'));
    } finally {
      setIsAddingToCart(false);
    }
  };

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
        <h2 className="text-2xl font-black">Artwork not found</h2>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const discount = selectedVariant && selectedVariant.price > selectedVariant.salePrice
    ? Math.round(((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100)
    : 0;
  const isAddToCartDisabled = !selectedVariant || selectedVariant.stockQuantity === 0 || isAddingToCart;
  const artist = product.attributes.artist || product.attributes.origin || 'Maithil Haat Artisans';

  return (
    <div className="mh-fade-up container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(340px,0.96fr)] lg:gap-14">
        <div className="space-y-4">
          <div className="mh-card-hover relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-3 shadow-2xl shadow-stone-900/10">
            <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-stone-100">
              <img
                src={product.imageUrl || fallbackImage}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
            {[
              { icon: ShieldCheck, text: 'Secure checkout' },
              { icon: Truck, text: 'Careful delivery' },
              { icon: RotateCcw, text: 'Easy support' },
            ].map((item) => (
              <div key={item.text} className="mh-card-hover rounded-2xl border border-stone-200 bg-white/80 p-4 text-center shadow-sm">
                <item.icon className="mh-icon-glow mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-stone-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="mh-fade-up-delay-1 art-panel rounded-[2rem] p-4 sm:p-6 md:p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary font-black">
                {product.type === 'PHYSICAL' ? 'Authentic Handmade' : product.type}
              </Badge>
              {selectedVariant && selectedVariant.stockQuantity < 5 && selectedVariant.stockQuantity > 0 && (
                <Badge variant="destructive" className="font-black">Only {selectedVariant.stockQuantity} left</Badge>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="museum-label">Artwork Detail</p>
                <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-stone-950 md:text-6xl">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                  <Star size={16} className="fill-emerald-600 text-emerald-600" />
                  <span className="text-sm font-black text-emerald-700">4.9</span>
                </div>
                <span className="text-sm font-bold text-stone-500">Artist: {String(artist)}</span>
              </div>

              <div className="mh-card-hover rounded-2xl bg-stone-50 p-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-stone-950 sm:text-4xl">Rs {selectedVariant?.salePrice.toLocaleString()}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-stone-400 line-through font-bold">Rs {selectedVariant?.price.toLocaleString()}</span>
                      <Badge className="bg-red-600 font-black border-none">{discount}% OFF</Badge>
                    </>
                  )}
                </div>
                <p className="mt-2 text-[11px] text-stone-400 font-black tracking-widest uppercase">Inclusive of taxes where applicable</p>
              </div>

              <p className="text-base font-medium leading-8 text-stone-600">
                {product.description}
              </p>

              <div className="space-y-4 border-y border-stone-200 py-6">
                <Label className="text-sm font-black uppercase tracking-widest text-stone-500">Choose Option</Label>
                <RadioGroup
                  value={selectedVariant?.id}
                  onValueChange={(val) => setSelectedVariant(product.variants.find((variant) => variant.id === val) || null)}
                  className="flex flex-wrap gap-3"
                >
                  {product.variants.map((variant) => {
                    const variantLabel = Object.values(variant.variantAttributes).join(' / ') || variant.skuCode;
                    return (
                      <div key={variant.id} className="flex items-center">
                        <RadioGroupItem value={variant.id} id={variant.id} className="peer sr-only" />
                        <Label
                          htmlFor={variant.id}
                          className="mh-press cursor-pointer break-words rounded-2xl border-2 border-stone-200 bg-white px-4 py-3 text-sm font-black transition-all hover:bg-stone-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary sm:px-5"
                        >
                          {variantLabel}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  size="lg"
                  className="mh-press mh-shine h-14 flex-1 rounded-2xl text-lg font-black gap-3 shadow-2xl shadow-primary/25"
                  onClick={handleAddToCart}
                  disabled={isAddToCartDisabled}
                >
                  {isAddingToCart ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag size={20} />}
                  {!selectedVariant
                    ? 'Select Option'
                    : selectedVariant.stockQuantity === 0
                      ? 'Out of Stock'
                      : isAddingToCart
                        ? 'Adding...'
                        : 'Add to Haat'}
                </Button>
                <Button size="lg" variant="outline" className="mh-press h-14 rounded-2xl border-2 px-5 hover:bg-red-50 hover:border-red-200 group">
                  <Heart size={22} className="text-stone-400 group-hover:text-red-500 transition-colors" />
                </Button>
              </div>

              {Object.keys(product.attributes).length > 0 && (
                <div className="grid grid-cols-1 gap-3 pt-2 min-[420px]:grid-cols-2 md:grid-cols-3">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="mh-card-hover rounded-2xl border border-stone-200 bg-white p-4">
                      <p className="text-[10px] uppercase font-black text-stone-400 tracking-widest">{key}</p>
                      <p className="mt-1 text-xs font-black text-stone-700 capitalize">{String(value)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-2xl bg-[#2b1710] p-5 text-white">
                <p className="flex items-center gap-2 text-sm font-black">
                  <Palette className="h-4 w-4 text-amber-300" />
                  Collected directly through MaithilHaat
                </p>
                <p className="mt-2 text-xs font-semibold leading-6 text-stone-300">
                  Each order supports a craft-led marketplace and keeps artisan stories visible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
