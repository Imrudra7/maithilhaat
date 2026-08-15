import Hero from "@/components/sections/Hero";
import QuickCategories from "@/components/sections/QuickCategories";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import MithilaShowcaseSlider from "@/components/sections/MithilaShowcaseSlider";
import ShopByOccasion from "@/components/sections/ShopByOccasion";
import ArtisanSpotlight from "@/components/sections/ArtisanSpotlight";
import TrustServiceBand from "@/components/sections/TrustServiceBand";
import { ArrowRight, Brush, CheckCircle2, HandHeart, Sparkles } from "lucide-react";
import Link from "next/link";

const craftPromises = [
  { icon: HandHeart, text: "Ghar jaisa asli" },
  { icon: CheckCircle2, text: "Artisan curated" },
  { icon: Sparkles, text: "Mithila vibes" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      <section className="mh-scroll-reveal relative -mt-20 overflow-hidden pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="mh-scroll-parallax absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.94),rgba(121,72,43,0.72)_18%,rgba(223,196,158,0.78)_42%,rgba(239,225,197,0.72)_68%,rgba(231,247,240,0.66)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center opacity-95" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(67,37,23,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(67,37,23,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#5a3424] via-[#7a482b]/72 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="mh-card-hover relative mb-7 overflow-hidden rounded-[1.5rem] border border-white/38 bg-[#f3dfbb]/36 shadow-[0_30px_100px_-58px_rgba(69,32,15,0.72)] backdrop-blur-2xl sm:rounded-[2rem]">
            <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
            <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full border border-primary/10" />
            <div className="absolute bottom-6 left-6 hidden h-20 w-20 rounded-full border border-primary/10 md:block" />

            <div className="grid gap-5 p-4 sm:gap-7 sm:p-5 md:grid-cols-[minmax(0,1fr)_360px] md:p-7 lg:grid-cols-[minmax(0,1fr)_430px]">
              <div className="mh-stagger flex flex-col justify-between gap-7">
                <div className="max-w-3xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary shadow-sm backdrop-blur-xl">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Mithila ke rang
                  </p>
                  <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#25140d] min-[390px]:text-4xl md:text-6xl">
                    Apna pasandida kala chuniye
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-stone-600 md:text-base">
                    Darbhanga se Madhubani tak, har category mein haath ki mehnat, lok rang aur Maithili kahaniyon ka asar hai.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/shop"
                    className="mh-press mh-shine inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/60 bg-[#2b1710]/90 px-5 text-sm font-black text-white shadow-lg shadow-stone-900/10 transition-all hover:-translate-y-0.5 hover:bg-primary"
                  >
                    Sab dekhiye
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="flex flex-wrap gap-2">
                    {craftPromises.map((item) => (
                      <span
                        key={item.text}
                        className="mh-tab-option inline-flex h-10 items-center gap-2 rounded-full border border-[#2b1710]/10 bg-white/38 px-4 text-xs font-black text-[#3a2117] shadow-sm backdrop-blur-xl"
                      >
                        <item.icon className="h-3.5 w-3.5 text-primary" />
                        {item.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <MithilaShowcaseSlider />
            </div>
          </div>

          <QuickCategories />
        </div>
      </section>

      <section className="mh-scroll-reveal relative overflow-hidden py-14 md:py-20">
        <div className="mh-scroll-parallax absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(90,52,36,0.36),rgba(244,210,160,0.82)_34%,rgba(224,240,221,0.76)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center opacity-95" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(185,28,28,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute -left-16 top-10 h-44 w-44 rounded-full border border-primary/10" />
        <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full border border-emerald-700/10" />
        <div className="container mx-auto px-4">
          <div className="mh-card-hover relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#f4dfbd]/48 p-4 shadow-[0_30px_100px_-58px_rgba(69,32,15,0.78)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-5 md:p-7">
            <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,rgba(185,28,28,0.08)_0_2px,transparent_3px),radial-gradient(circle_at_84%_68%,rgba(15,118,110,0.08)_0_2px,transparent_3px)] bg-[size:28px_28px]" />
            <div className="absolute right-8 top-8 hidden text-8xl font-black leading-none text-primary/[0.055] lg:block">ART</div>
            <div className="absolute -left-8 top-16 hidden h-36 w-36 rounded-full border border-[#7c2d12]/10 bg-[conic-gradient(from_40deg,rgba(185,28,28,0.12),rgba(245,158,11,0.16),rgba(15,118,110,0.1),rgba(185,28,28,0.12))] opacity-80 md:block" />
            <div className="absolute bottom-0 right-0 hidden h-24 w-72 rounded-tl-[3rem] bg-[#2b1710]/[0.045] lg:block" />

            <div className="mh-stagger relative mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#fff8e7]/62 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary shadow-sm backdrop-blur-xl">
                  <Brush className="h-4 w-4" />
                  Haat se naya aaya
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#25140d] md:text-5xl">
                  Dil jeetne wali kala
                </h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-stone-600">
                  Fresh artisan pieces jo ghar ko sirf decorate nahi, ek kahani dete hain.
                </p>
              </div>
              <Link
                href="/shop"
                className="mh-press mh-shine inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/65 bg-[#2b1710]/90 px-5 text-sm font-black text-white shadow-lg shadow-stone-900/10 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-primary"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative">
              <FeaturedProducts />
            </div>
          </div>
        </div>
      </section>

      <ShopByOccasion />
      <ArtisanSpotlight />
      <TrustServiceBand />

      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,231,0.72),rgba(43,23,16,0.96)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(185,28,28,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(245,158,11,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>
    </div>
  );
}
