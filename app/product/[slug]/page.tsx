'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronDown, Heart, Loader2, MapPin, Palette, RotateCcw, ShieldCheck, ShoppingBag, Star, Store, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { productService } from '@/lib/services/product-service';
import { ProductResponse, ProductVariantResponse } from '@/types/product';
import { notify } from '@/lib/notify';
import { cartService } from '@/lib/services/cart-service';
import ProductCard from '@/components/cards/ProductCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const fallbackImage = '/images/maithil-art-gallery-hero.png';

const mockReviewSummary = {
  averageRating: 4.7,
  verdict: 'Loved by collectors',
  ratingsCount: 1284,
  reviewsCount: 214,
  ratingBreakdown: [
    { label: 'Design & Craft', rating: 4.8 },
    { label: 'Color Finish', rating: 4.6 },
    { label: 'Packaging', rating: 4.7 },
    { label: 'Delivery Care', rating: 4.5 },
  ],
  images: [
    '/images/maithil-art-gallery-hero.png',
    '/images/mithila-kapra-showcase.png',
    '/images/mithila-aachar-showcase.png',
    '/images/mithila-thekua-showcase.png',
  ],
};

const mockReviews = [
  {
    id: 'review-1',
    rating: 5,
    title: 'Beautiful finish and safely packed',
    comment: 'Colors look warm in room light and the piece arrived without any damage. The packaging felt thoughtful.',
    reviewer: 'Verified buyer',
    age: '2 weeks ago',
    images: ['/images/maithil-art-gallery-hero.png', '/images/mithila-kapra-showcase.png'],
  },
  {
    id: 'review-2',
    rating: 4,
    title: 'Looks premium on the wall',
    comment: 'Texture and detail are good. Size matched the listing, and it made the corner feel more festive.',
    reviewer: 'MaithilHaat customer',
    age: '1 month ago',
    images: ['/images/mithila-thekua-showcase.png'],
  },
];

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
  const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
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

        productService.getAllProducts()
          .then((products) => {
            setRelatedProducts(
              products
                .filter((item) => item.id !== data.id && item.isActive)
                .slice(0, 8)
            );
          })
          .catch(() => {
            setRelatedProducts([]);
          });
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
      <div className="flex min-h-screen items-center justify-center bg-[#fbf7ef]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#fbf7ef] px-4 text-center">
        <h2 className="text-2xl font-black text-[#261911]">Artwork not found</h2>
        <Button onClick={() => window.history.back()} className="rounded-xl bg-[#5c3524] font-black hover:bg-[#452719]">Go Back</Button>
      </div>
    );
  }

  const discount = selectedVariant && selectedVariant.price > selectedVariant.salePrice
    ? Math.round(((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100)
    : 0;
  const isAddToCartDisabled = !selectedVariant || selectedVariant.stockQuantity === 0 || isAddingToCart;
  const artist = product.attributes.artist || product.attributes.origin || 'Maithil Haat Artisans';
  const attributeEntries = Object.entries(product.attributes);
  const productHighlights = [
    { label: 'Type', value: product.type },
    { label: 'Variant', value: selectedVariant ? Object.values(selectedVariant.variantAttributes).join(' / ') || selectedVariant.skuCode : 'Select option' },
    { label: 'Stock', value: selectedVariant ? `${selectedVariant.stockQuantity} available` : 'Choose variant' },
    { label: 'Artist', value: String(artist) },
  ];

  return (
    <main className="mh-fade-up relative overflow-hidden bg-[#fbf7ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_9%_12%,rgba(15,118,110,0.12),transparent_24%),radial-gradient(circle_at_92%_8%,rgba(185,28,28,0.08),transparent_26%),linear-gradient(180deg,rgba(255,248,231,0.92),rgba(244,223,189,0.42)_46%,rgba(236,253,245,0.34))]" />
      <div className="container relative mx-auto max-w-7xl px-4 py-6 md:py-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,0.92fr)] lg:items-start lg:gap-10">
        <div className="space-y-3">
          <div className="mh-card-hover relative flex overflow-hidden rounded-[1.75rem] border border-[#ead8bd]/80 bg-[#fff8e7]/66 p-3 shadow-[0_28px_90px_-58px_rgba(69,32,15,0.75)] backdrop-blur-xl sm:rounded-[2rem] sm:p-4 lg:min-h-[680px] lg:flex-col">
            <div className="mh-rang-strip absolute inset-x-8 top-0 h-1 rounded-b-full opacity-80" />
            <div className="relative aspect-square flex-1 overflow-hidden rounded-[1.25rem] bg-[#ead8bd]/55 shadow-inner sm:rounded-[1.5rem]">
              <img
                src={product.imageUrl || fallbackImage}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(43,23,16,0.18))]" />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-black text-[#6b5649]">
              <span className="rounded-full bg-[#f4dfbd]/80 px-3 py-1">Handmade catalogue piece</span>
              <span className="rounded-full bg-[#dff2e9]/80 px-3 py-1">MaithilHaat verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
            {[
              { icon: ShieldCheck, text: 'Secure checkout' },
              { icon: Truck, text: 'Careful delivery' },
              { icon: RotateCcw, text: 'Easy support' },
            ].map((item) => (
              <div key={item.text} className="mh-card-hover rounded-2xl border border-[#ead8bd]/70 bg-[#fff8e7]/58 p-3 text-center shadow-[0_18px_60px_-46px_rgba(69,32,15,0.62)] backdrop-blur-xl">
                <item.icon className="mh-icon-glow mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-[#765f51]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mh-fade-up-delay-1 flex rounded-[1.75rem] border border-[#ead8bd]/78 bg-[#fff8e7]/72 shadow-[0_30px_100px_-58px_rgba(69,32,15,0.78)] backdrop-blur-2xl sm:rounded-[2rem] lg:h-[680px] lg:flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto p-4 pr-3 [scrollbar-width:none] sm:p-5 sm:pr-4 md:p-6 md:pr-5 [&::-webkit-scrollbar]:hidden">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-[#5c3524]/10 font-black text-[#5c3524]">
                  {product.type === 'PHYSICAL' ? 'Authentic Handmade' : product.type}
                </Badge>
                {selectedVariant && selectedVariant.stockQuantity < 5 && selectedVariant.stockQuantity > 0 && (
                  <Badge variant="destructive" className="font-black">Only {selectedVariant.stockQuantity} left</Badge>
                )}
              </div>

              <div className="space-y-3.5">
              <div>
                <p className="museum-label text-[#7a5d4c]">Artwork Detail</p>
                <h1 className="mt-2 text-3xl font-black leading-tight tracking-normal text-[#261911] md:text-4xl xl:text-5xl">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-xl border border-[#bfe1d3] bg-[#e6f6ee]/80 px-3 py-1.5">
                  <Star size={16} className="fill-[#0f766e] text-[#0f766e]" />
                  <span className="text-sm font-black text-[#0f766e]">4.9</span>
                </div>
                <span className="text-sm font-bold text-[#765f51]">Artist: {String(artist)}</span>
              </div>

              <div className="mh-card-hover rounded-2xl border border-[#ead8bd]/72 bg-[linear-gradient(135deg,rgba(244,223,189,0.62),rgba(236,253,245,0.42))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-black text-[#261911] sm:text-[2.1rem]">Rs {selectedVariant?.salePrice.toLocaleString()}</span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg font-bold text-[#9a8374] line-through">Rs {selectedVariant?.price.toLocaleString()}</span>
                      <Badge className="bg-red-600 font-black border-none">{discount}% OFF</Badge>
                    </>
                  )}
                </div>
                <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-[#7a685d]">Inclusive of taxes where applicable</p>
              </div>

              <p className="text-sm font-semibold leading-7 text-[#5f4d41] sm:text-base">
                {product.description}
              </p>

              <div className="space-y-3 border-y border-[#e2cdae] py-4">
                <Label className="text-sm font-black uppercase tracking-widest text-[#765f51]">Choose Option</Label>
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
                          className="mh-press cursor-pointer break-words rounded-2xl border-2 border-[#e4d0b1] bg-[#fffaf0]/78 px-4 py-2.5 text-sm font-black text-[#3d281c] transition-all hover:border-[#c79f6e] hover:bg-[#fff3d7] peer-data-[state=checked]:border-[#5c3524] peer-data-[state=checked]:bg-[#5c3524]/10 peer-data-[state=checked]:text-[#5c3524] sm:px-5"
                        >
                          {variantLabel}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <details open className="group rounded-2xl border border-[#ead8bd]/78 bg-[#fffaf0]/58 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span>
                    <span className="block text-lg font-black text-[#342217]">Product highlights</span>
                    <span className="text-sm font-semibold text-[#8a7466]">Key craft, stock, artist and option info</span>
                  </span>
                  <ChevronDown className="h-5 w-5 text-[#6b4a39] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {productHighlights.map((item) => (
                    <div key={item.label} className="border-b border-[#e4d0b1] pb-3">
                      <p className="text-xs font-semibold text-[#8a7466]">{item.label}</p>
                      <p className="mt-1 text-sm font-black text-[#3d281c]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </details>

              <details className="group rounded-2xl border border-[#ead8bd]/78 bg-[#fffaf0]/58 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span>
                    <span className="block text-lg font-black text-[#342217]">All details</span>
                    <span className="text-sm font-semibold text-[#8a7466]">Attributes, description and variant data</span>
                  </span>
                  <ChevronDown className="h-5 w-5 text-[#6b4a39] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 space-y-4">
                  <p className="text-sm font-semibold leading-7 text-[#5f4d41]">{product.description}</p>
                  {attributeEntries.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                      {attributeEntries.map(([key, value]) => (
                        <div key={key} className="rounded-2xl border border-[#ead8bd]/72 bg-[#fffaf0]/62 p-3 shadow-sm backdrop-blur">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#9a8374]">{key}</p>
                          <p className="mt-1 text-xs font-black capitalize text-[#4b3528]">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </details>

              <details open className="group rounded-2xl border border-[#ead8bd]/78 bg-[#fffaf0]/58 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span>
                    <span className="block text-lg font-black text-[#342217]">Delivery details</span>
                    <span className="text-sm font-semibold text-[#8a7466]">Packing, fulfilment and buyer support</span>
                  </span>
                  <ChevronDown className="h-5 w-5 text-[#6b4a39] transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#ead8bd]/70 bg-[#f4dfbd]/42">
                  <div className="flex items-center gap-3 border-b border-[#ead8bd]/70 p-3">
                    <MapPin className="h-4 w-4 text-[#5c3524]" />
                    <p className="text-sm font-bold text-[#4b3528]">Delivery address will be confirmed during checkout.</p>
                  </div>
                  <div className="flex items-center gap-3 border-b border-[#ead8bd]/70 p-3">
                    <Truck className="h-4 w-4 text-[#5c3524]" />
                    <p className="text-sm font-bold text-[#4b3528]">Packed carefully for handmade and framed pieces.</p>
                  </div>
                  <div className="flex items-center gap-3 p-3">
                    <Store className="h-4 w-4 text-[#5c3524]" />
                    <p className="text-sm font-bold text-[#4b3528]">Fulfilled by MaithilHaat artisan marketplace.</p>
                  </div>
                </div>
              </details>

              <details open className="group rounded-2xl border border-[#ead8bd]/78 bg-[#fffaf0]/58 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span>
                    <span className="block text-lg font-black text-[#342217]">Ratings and reviews</span>
                    <span className="text-sm font-semibold text-[#8a7466]">
                      {mockReviewSummary.averageRating} based on {mockReviewSummary.ratingsCount.toLocaleString()} verified ratings
                    </span>
                  </span>
                  <ChevronDown className="h-5 w-5 text-[#6b4a39] transition-transform group-open:rotate-180" />
                </summary>

                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-4xl font-black text-[#261911]">{mockReviewSummary.averageRating}</span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#dff6ea] px-3 py-1 text-sm font-black text-[#0f766e]">
                      <Star className="h-4 w-4 fill-[#0f766e]" />
                      {mockReviewSummary.verdict}
                    </span>
                    <span className="text-sm font-semibold text-[#7a685d]">
                      {mockReviewSummary.reviewsCount.toLocaleString()} reviews
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {mockReviewSummary.images.map((image, index) => (
                      <div key={image} className="relative aspect-square overflow-hidden rounded-xl border border-[#ead8bd] bg-[#ead8bd]/45">
                        <img src={image} alt={`Review photo ${index + 1}`} className="h-full w-full object-cover" />
                        {index === mockReviewSummary.images.length - 1 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#241711]/55 text-lg font-black text-white">
                            +24
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mockReviewSummary.ratingBreakdown.map((item) => (
                      <span key={item.label} className="rounded-lg bg-[#e7f4ef]/90 px-3 py-1.5 text-sm font-black text-[#315c52]">
                        {item.label} {item.rating}
                        <Star className="ml-1 inline h-3 w-3 fill-[#0f766e] text-[#0f766e]" />
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {mockReviews.map((review) => (
                      <article key={review.id} className="rounded-2xl border border-[#ead8bd]/72 bg-[#fff8e7]/82 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-lg bg-[#e7f4ef] px-2 py-1 text-xs font-black text-[#0f766e]">
                              {review.rating}
                              <Star className="h-3 w-3 fill-[#0f766e]" />
                            </span>
                            <h3 className="mt-2 text-sm font-black text-[#342217]">{review.title}</h3>
                          </div>
                          <span className="text-xs font-bold text-[#9a8374]">{review.age}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold leading-6 text-[#6b5649]">{review.comment}</p>
                        {review.images.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {review.images.map((image) => (
                              <div key={image} className="h-14 w-14 overflow-hidden rounded-xl border border-[#ead8bd] bg-[#ead8bd]/40">
                                <img src={image} alt="Customer review" className="h-full w-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-[#9a8374]">{review.reviewer}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </details>

              <div className="rounded-2xl border border-white/10 bg-[#2b1710] p-4 text-white shadow-[0_20px_70px_-50px_rgba(43,23,16,0.9)]">
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

            <div className="border-t border-[#e2cdae] bg-[#fff8e7]/92 p-4 backdrop-blur-xl sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  size="lg"
                  className="mh-press mh-shine h-12 flex-1 gap-3 rounded-2xl bg-[#5c3524] text-base font-black shadow-2xl shadow-primary/20 hover:bg-[#452719]"
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
                <Button size="lg" variant="outline" className="mh-press group h-12 rounded-2xl border-2 border-[#e4d0b1] bg-[#fff8e7]/72 px-5 hover:border-red-200 hover:bg-red-50">
                  <Heart size={22} className="text-[#9a8374] transition-colors group-hover:text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <ProductRail
          eyebrow="Similar Products"
          title="You may also like"
          products={relatedProducts}
        />
      )}

      {relatedProducts.length > 3 && (
        <ProductRail
          eyebrow="More from the haat"
          title="Fresh picks for you"
          products={relatedProducts.slice(3)}
        />
      )}
      </div>
    </main>
  );
}

function ProductRail({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string;
  title: string;
  products: ProductResponse[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollControls = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollLeft(scroller.scrollLeft > 8);
    setCanScrollRight(maxScrollLeft - scroller.scrollLeft > 8);
  };

  useEffect(() => {
    updateScrollControls();

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new ResizeObserver(updateScrollControls);
    observer.observe(scroller);
    window.addEventListener('resize', updateScrollControls);
    scroller.addEventListener('scroll', updateScrollControls, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScrollControls);
      scroller.removeEventListener('scroll', updateScrollControls);
    };
  }, [products.length]);

  const scrollRail = (direction: 'left' | 'right') => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: (direction === 'right' ? 1 : -1) * Math.max(scroller.clientWidth * 0.66, 280),
      behavior: 'smooth',
    });
  };

  return (
    <section className="mt-8 space-y-5 border-t border-[#e2cdae] pt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="museum-label text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-black tracking-normal text-[#261911] md:text-3xl">{title}</h2>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              aria-label={`View all ${title}`}
              className="mh-press h-11 w-11 rounded-full bg-[#241711] p-0 text-white hover:bg-[#5c3524]"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[94vw] overflow-y-auto border-l border-[#ead8bd] bg-[#fbf7ef] p-0 [scrollbar-width:none] sm:max-w-none md:w-[720px] lg:w-[860px] xl:w-[980px] [&::-webkit-scrollbar]:hidden">
            <SheetHeader className="border-b border-[#ead8bd] bg-[linear-gradient(135deg,rgba(223,242,233,0.92),rgba(255,248,231,0.96))] p-5 pr-12">
              <p className="museum-label text-primary">{eyebrow}</p>
              <SheetTitle className="text-2xl font-black tracking-normal text-[#261911]">{title}</SheetTitle>
              <p className="text-sm font-semibold text-[#765f51]">View all matching pieces in one place.</p>
            </SheetHeader>
            <div className="grid gap-4 p-4 min-[560px]:grid-cols-2 xl:grid-cols-3">
              {products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <Button
            type="button"
            variant="outline"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollRail('left')}
            className="mh-press absolute left-0 top-1/2 z-20 h-12 w-12 -translate-x-3 -translate-y-1/2 rounded-full border-[#ead8bd] bg-[#fff8e7]/95 p-0 shadow-[0_18px_50px_-28px_rgba(43,23,16,0.72)] backdrop-blur hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <div
          ref={scrollerRef}
          className="mh-scroll-lane flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((item) => (
            <div key={item.id} className="w-[78vw] max-w-[260px] shrink-0 snap-start sm:w-[260px]">
              <ProductCard product={item} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <Button
            type="button"
            variant="outline"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollRail('right')}
            className="mh-press absolute right-0 top-1/2 z-20 h-12 w-12 translate-x-3 -translate-y-1/2 rounded-full border-[#ead8bd] bg-[#fff8e7]/95 p-0 shadow-[0_18px_50px_-28px_rgba(43,23,16,0.72)] backdrop-blur hover:bg-white"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </section>
  );
}
