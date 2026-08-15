import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Brush, HandHeart, MapPin, Sparkles } from "lucide-react";

const storyStats = [
  { label: "Craft mood", value: "Madhubani" },
  { label: "Made for", value: "Homes" },
  { label: "Touch", value: "Handmade" },
];

const craftNotes = [
  "Machhli, lotus aur kohbar motifs se inspired collections.",
  "Kapra, painting aur decor ko ek curated home story me rakha gaya.",
  "Every section leads users toward product discovery without losing emotion.",
];

export default function ArtisanSpotlight() {
  return (
    <section className="mh-scroll-reveal relative overflow-hidden py-12 md:py-20">
      <div className="mh-scroll-parallax absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(239,210,168,0.82),rgba(231,247,240,0.72)_58%,rgba(90,52,36,0.4)),url('/images/mithila-aachar-showcase.png')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(185,28,28,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="container mx-auto px-4">
        <div className="mh-fade-up relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#f4dfbd]/52 shadow-[0_30px_100px_-58px_rgba(69,32,15,0.78)] backdrop-blur-2xl sm:rounded-[2rem]">
          <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_22%,rgba(185,28,28,0.08)_0_2px,transparent_3px),radial-gradient(circle_at_86%_74%,rgba(15,118,110,0.08)_0_2px,transparent_3px)] bg-[size:30px_30px]" />
          <div className="absolute -left-12 bottom-10 hidden text-8xl font-black leading-none text-primary/[0.045] md:block">लोक</div>

          <div className="relative grid gap-6 p-4 sm:p-5 md:grid-cols-[0.9fr_1.1fr] md:p-7 lg:p-9">
            <div className="mh-card-hover relative min-h-[320px] overflow-hidden rounded-[1.35rem] border border-white/55 bg-[#2b1710]/20 shadow-[0_24px_80px_-52px_rgba(43,23,16,0.9)] sm:min-h-[420px] sm:rounded-[1.6rem]">
              <Image
                src="/images/maithil-art-gallery-hero.png"
                alt="Mithila artisan craft wall"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b1710]/88 via-[#2b1710]/24 to-transparent" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/16 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-xl">
                <MapPin className="h-3.5 w-3.5 text-amber-200" />
                Bihar se
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/18 bg-white/14 p-4 text-white backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">Artisan spotlight</p>
                <h3 className="mt-2 text-2xl font-black">Haat ki asli pehchan</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-200">
                  Har product card ke peeche craft, region aur ghar ki kahani ko front page par visible rakha gaya hai.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-[#fff8e7]/64 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-primary shadow-sm backdrop-blur-xl">
                <HandHeart className="h-4 w-4" />
                Kalakar aur kahani
              </p>
              <h2 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-[#25140d] min-[390px]:text-4xl md:text-6xl">
                Products nahi, ghar tak pahunchti kala
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-stone-600 md:text-base">
                Homepage ka yeh part user ko batata hai ki MaithilHaat sirf catalog nahi hai. Yeh curated craft, regional identity aur modern shopping experience ka mix hai.
              </p>

              <div className="mh-stagger mt-6 grid gap-3 min-[420px]:grid-cols-3 md:mt-7">
                {storyStats.map((stat) => (
                  <div key={stat.label} className="mh-card-hover rounded-[1.25rem] border border-[#fff2d2]/70 bg-[#fff8e7]/50 p-4 shadow-sm backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">{stat.label}</p>
                    <p className="mt-2 text-lg font-black text-[#25140d]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mh-stagger mt-6 space-y-3">
                {craftNotes.map((note) => (
                  <div key={note} className="mh-card-hover flex gap-3 rounded-[1.25rem] border border-[#fff2d2]/70 bg-[#fff8e7]/42 p-4 shadow-sm backdrop-blur-xl">
                    <div className="mh-icon-glow flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-white/50 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-bold leading-6 text-stone-700">{note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="mh-press mh-shine inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/65 bg-[#2b1710]/90 px-5 text-sm font-black text-white shadow-lg shadow-stone-900/10 transition-all hover:-translate-y-0.5 hover:bg-primary"
                >
                  Explore craft
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="mh-press inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#2b1710]/10 bg-[#fff8e7]/52 px-5 text-sm font-black text-[#2b1710] shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white"
                >
                  Our story
                  <Brush className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
