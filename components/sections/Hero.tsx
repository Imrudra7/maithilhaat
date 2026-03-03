// src/components/sections/Hero.tsx
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-slate-100">
      {/* Background Overlay or Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
      <img
        src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=2000"
        alt="Mithila Art"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="container mx-auto px-4 relative z-20 text-white">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tighter">
            Handcrafted <br />
            <span className="text-yellow-400">Mithila Legacy</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-slate-200 max-w-lg">
            Directly from the heart of Bihar to your modern home. Authentic, sustainable, and timeless.
          </p>
          <div className="flex gap-4">
            <Link href="/shop">
              <Button size="lg" className="font-bold h-14 px-8 rounded-xl text-lg">
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="font-bold h-14 px-8 rounded-xl text-lg bg-white/10 backdrop-blur-md border-white/20 text-white">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}