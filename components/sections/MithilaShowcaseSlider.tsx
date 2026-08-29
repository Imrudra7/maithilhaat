'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Palette } from 'lucide-react';

const showcaseSlides = [
  {
    title: 'Madhubani Painting',
    subtitle: 'Machhli, kamal aur kohbar rekha',
    tag: 'Kala',
    image: '/images/maithil-art-gallery-hero.png',
    tone: 'from-indigo-950/80',
  },
  {
    title: 'Ghar ka Aachar',
    subtitle: 'Sarson tel, masala aur mitti ki khushboo',
    tag: 'Swaad',
    image: '/images/mithila-aachar-showcase.png',
    tone: 'from-amber-950/80',
  },
  {
    title: 'Thekua Prasad',
    subtitle: 'Chhath wali mithaas, haath se bana',
    tag: 'Parampara',
    image: '/images/mithila-thekua-showcase.png',
    tone: 'from-orange-950/80',
  },
  {
    title: 'Maithili Kapra',
    subtitle: 'Cotton, rang aur lok-chitra ka sparsh',
    tag: 'Kapra',
    image: '/images/mithila-kapra-showcase.png',
    tone: 'from-emerald-950/80',
  },
];

export default function MithilaShowcaseSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % showcaseSlides.length);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const activeSlide = showcaseSlides[activeIndex];

  return (
    <div
      className="mh-card-hover relative min-h-[320px] overflow-hidden rounded-[1.6rem] border border-white/60 bg-[#2b1710]/80 p-3 shadow-2xl shadow-stone-900/10 md:min-h-72"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="absolute inset-3 overflow-hidden rounded-[1.25rem]">
        {showcaseSlides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={`${slide.title} showcase`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className={`absolute inset-0 bg-gradient-to-t ${activeSlide.tone} via-[#2b1710]/18 to-transparent`} />
      </div>

      <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm backdrop-blur-xl md:left-6 md:top-6">
        <MapPin className="h-3.5 w-3.5 text-amber-200" />
        Bihar se
      </div>

      <div className="absolute right-5 top-5 rounded-full border border-white/25 bg-white/20 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm backdrop-blur-xl md:right-6 md:top-6">
        {activeSlide.tag}
      </div>

      <div className="absolute bottom-5 left-4 right-4 text-white md:left-5 md:right-5">
          <div className="inline-flex max-w-full items-center gap-3 rounded-[1.25rem] border border-white/25 bg-[#2b1710]/42 px-3 py-2.5 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:rounded-full">
          <div className="mh-icon-glow flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
            <Palette className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black">{activeSlide.title}</p>
            <p className="mt-1 truncate text-xs font-semibold text-stone-200">{activeSlide.subtitle}</p>
          </div>
        </div>

        <div className="mt-3 flex gap-2 pl-2">
          {showcaseSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Show ${slide.title}`}
              onClick={() => setActiveIndex(index)}
              className={`mh-press mh-tab-option h-2 rounded-full border border-white/30 transition-all ${
                index === activeIndex ? 'w-8 bg-amber-200' : 'w-2 bg-white/55 hover:bg-white/80'
              }`}
              data-active={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
