// src/components/sections/QuickCategories.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Brush, Gem, Home, PackageOpen, Shirt, Sparkles } from 'lucide-react';
import { productService } from '@/lib/services/product-service';
import { CategoryResponse } from '@/types/product';

const categoryStyles = [
  { Icon: Brush, className: 'from-rose-500/20 to-amber-300/20 text-rose-700 border-rose-200/70', motif: 'Machhli rekha' },
  { Icon: Shirt, className: 'from-emerald-500/18 to-teal-300/20 text-emerald-700 border-emerald-200/70', motif: 'Sikki sparsh' },
  { Icon: Home, className: 'from-sky-500/18 to-indigo-300/20 text-sky-800 border-sky-200/70', motif: 'Aangan sajawat' },
  { Icon: Gem, className: 'from-violet-500/18 to-fuchsia-300/20 text-violet-800 border-violet-200/70', motif: 'Kohbar rang' },
  { Icon: Sparkles, className: 'from-amber-500/22 to-orange-300/25 text-amber-800 border-amber-200/80', motif: 'Haat pasand' },
];

function flattenCategories(categories: CategoryResponse[]): CategoryResponse[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

export default function QuickCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategoryTree();
        setCategories(data);
      } catch (error) {
        console.error('Categories load fail!', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const visibleCategories = useMemo(
    () => flattenCategories(categories).filter((category) => category.active).slice(0, 8),
    [categories]
  );

  useEffect(() => {
    if (loading || isPaused || visibleCategories.length <= 1) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const intervalId = window.setInterval(() => {
      const scroller = scrollerRef.current;
      const firstCard = scroller?.firstElementChild as HTMLElement | null;
      if (!scroller || !firstCard) return;

      const gap = Number.parseFloat(window.getComputedStyle(scroller).columnGap || '0');
      const step = firstCard.offsetWidth + gap;
      const loopWidth = step * visibleCategories.length;
      const currentLeft = scroller.scrollLeft >= loopWidth
        ? scroller.scrollLeft - loopWidth
        : scroller.scrollLeft;
      const nextLeft = currentLeft + step;

      if (currentLeft !== scroller.scrollLeft) {
        scroller.scrollLeft = currentLeft;
      }

      scroller.scrollTo({
        left: nextLeft,
        behavior: 'smooth',
      });

      if (nextLeft >= loopWidth) {
        window.setTimeout(() => {
          if (!scrollerRef.current || isPaused) return;
          scrollerRef.current.scrollLeft = nextLeft - loopWidth;
        }, 850);
      }
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [isPaused, loading, visibleCategories.length]);

  if (loading) {
    return (
      <div className="mh-scroll-lane flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-36 w-[82vw] max-w-[310px] shrink-0 animate-pulse rounded-[1.6rem] border border-white/50 bg-white/45 shadow-sm backdrop-blur-xl sm:w-[320px] lg:w-[360px]" />
        ))}
      </div>
    );
  }

  if (visibleCategories.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-[1.5rem] border border-dashed border-primary/20 bg-white/45 px-5 py-6 text-stone-600 shadow-sm backdrop-blur-xl">
        <PackageOpen className="h-5 w-5" />
        <span className="text-sm font-bold">Categories will appear here soon.</span>
      </div>
    );
  }

  return (
    <div className="-mx-4 overflow-hidden px-4">
      <div
        ref={scrollerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="mh-scroll-lane flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5"
      >
      {[...visibleCategories, ...visibleCategories].map((category, index) => {
        const style = categoryStyles[index % categoryStyles.length];
        const childCount = category.children?.filter((child) => child.active).length ?? 0;
        const Icon = style.Icon;
        const displayIndex = index % visibleCategories.length;

        return (
          <Link
            key={`${category.id}-${index}`}
            href={`/shop?categoryId=${category.id}`}
            className="mh-card-hover mh-scroll-reveal group relative min-h-36 w-[82vw] max-w-[310px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] border border-[#fff3d7]/65 bg-[#f4dfbd]/46 p-4 shadow-[0_18px_60px_-38px_rgba(69,32,15,0.7)] backdrop-blur-xl hover:border-amber-200/80 hover:bg-[#fff0cf]/58 hover:shadow-[0_26px_80px_-44px_rgba(69,32,15,0.9)] sm:w-[320px] sm:max-w-none lg:w-[360px] xl:w-[410px]"
          >
            <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-80" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(185,28,28,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.065)_1px,transparent_1px)] bg-[size:28px_28px] opacity-70" />
            <div className="absolute -left-8 bottom-2 text-7xl font-black leading-none text-[#7c2d12]/[0.045]">कमल</div>
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-primary/10" />
            <div className="absolute right-8 top-6 h-14 w-14 rounded-full border border-white/35 bg-[radial-gradient(circle,rgba(185,28,28,0.12)_2px,transparent_3px)] bg-[size:10px_10px] opacity-70" />
            <div className="absolute bottom-3 right-4 text-6xl font-black leading-none text-primary/[0.045] transition-transform duration-500 group-hover:rotate-6">
              {displayIndex + 1}
            </div>

            <div className="relative flex h-full min-w-0 items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className={`mh-icon-glow relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border bg-gradient-to-br shadow-inner ${style.className}`}>
                  <div className="absolute inset-2 rounded-[1rem] border border-white/55" />
                  <div className="absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.9),transparent_26%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,0.4),transparent_26%)]" />
                  <Icon className="relative h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/75">{style.motif}</p>
                  <h3 className="mt-1 truncate text-base font-black text-[#25140d]">{category.name}</h3>
                  <p className="mt-1 text-xs font-black text-stone-500">
                    {childCount > 0 ? `${childCount} sangrah` : 'Kala dekhiye'}
                  </p>
                </div>
              </div>
              <div className="mh-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/65 bg-[#fff8e7]/58 text-primary shadow-sm transition-all group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        );
      })}
      </div>
    </div>
  );
}
