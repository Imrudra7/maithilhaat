// src/components/sections/Hero.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative flex min-h-[620px] w-full items-center overflow-hidden bg-[#2b1710] pb-20 pt-8 sm:h-[72svh] sm:min-h-[560px] sm:max-h-[740px] sm:pt-0">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/62 via-slate-950/34 to-slate-950/20 sm:bg-gradient-to-r sm:from-slate-950/75 sm:via-slate-950/45 sm:to-slate-950/10" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-b from-transparent via-[#2b1710]/72 via-55% to-[#5a3424]" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-[linear-gradient(90deg,rgba(245,158,11,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(185,28,28,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-45" />
      <img
        src="/images/maithil-art-gallery-hero.png"
        alt="Mithila art gallery with handmade paintings and pigments"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="container relative z-20 mx-auto px-4 text-white">
        <div className="mh-fade-up max-w-3xl space-y-5 sm:space-y-6">
          <div className="inline-flex max-w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest backdrop-blur sm:text-xs">
            Authentic Mithila craft
          </div>
          <h1
            lang="mai-Tirh"
            className="maithil-display text-4xl font-black leading-none min-[390px]:text-5xl md:text-7xl"
          >
            𑒧𑒹𑒟𑒱𑒪𑒮𑒰𑒞
          </h1>
          <p className="maithil-copy max-w-2xl text-sm font-black leading-7 min-[390px]:text-base md:text-2xl md:leading-10">
            Handpicked paintings, handloom, decor, and artist-made pieces from Bihar, curated for homes that value craft with a story.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="mh-press mh-shine h-14 w-full rounded-xl px-7 text-base font-black sm:w-auto">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="mh-press h-14 w-full rounded-xl border-white/30 bg-white/10 px-7 text-base font-black text-white backdrop-blur-md hover:bg-white hover:text-slate-950 sm:w-auto">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
