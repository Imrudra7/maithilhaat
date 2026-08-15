import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Home, Lamp, Palette, Sparkles } from "lucide-react";

const occasions = [
  {
    title: "Griha Pravesh Gifts",
    eyebrow: "Naya ghar",
    copy: "Wall art, decor aur blessings wale pieces jo ghar ko apnapan dete hain.",
    image: "/images/maithil-art-gallery-hero.png",
    Icon: Home,
  },
  {
    title: "Kohbar Wedding Edit",
    eyebrow: "Shaadi sanskar",
    copy: "Kohbar rang, lotus motifs aur gifting pieces for wedding moments.",
    image: "/images/mithila-kapra-showcase.png",
    Icon: Palette,
  },
  {
    title: "Festive Haat",
    eyebrow: "Puja aur parv",
    copy: "Chhath, Diwali aur ghar ke utsav ke liye handmade choices.",
    image: "/images/mithila-thekua-showcase.png",
    Icon: Lamp,
  },
  {
    title: "Handmade Gifting",
    eyebrow: "Dil se diya",
    copy: "Artisan-made pieces jo gift se zyada ek kahani lagte hain.",
    image: "/images/mithila-aachar-showcase.png",
    Icon: Gift,
  },
];

export default function ShopByOccasion() {
  return (
    <section className="mh-scroll-reveal relative overflow-hidden py-12 md:py-20">
      <div className="mh-scroll-parallax absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(43,23,16,0.84),rgba(90,52,36,0.66)_34%,rgba(239,210,168,0.76)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,232,194,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(245,158,11,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-4 text-white md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-widest backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-amber-200" />
              Mauka ke hisaab se
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight min-[390px]:text-4xl md:text-5xl">
              Har occasion ke liye ek Maithil rang
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-stone-200">
              User ko category sochne ki zaroorat na pade, bas moment choose kare aur curated haat me pahunch jaye.
            </p>
          </div>

          <Link
            href="/shop"
            className="mh-press mh-shine inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/12 px-5 text-sm font-black text-white shadow-lg shadow-black/10 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#2b1710]"
          >
            Shop all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mh-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {occasions.map((occasion) => (
            <Link
              key={occasion.title}
              href="/shop"
              className="mh-card-hover group relative min-h-[310px] overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/45 bg-[#f4dfbd]/22 shadow-[0_28px_90px_-56px_rgba(0,0,0,0.95)] backdrop-blur-xl hover:border-amber-200/80 sm:min-h-[360px] sm:rounded-[1.75rem]"
            >
              <Image
                src={occasion.image}
                alt={occasion.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(43,23,16,0.18),rgba(43,23,16,0.28)_34%,rgba(43,23,16,0.92))]" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,232,194,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,232,194,0.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
              <div className="mh-orbit absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/18" />

              <div className="relative flex h-full min-h-[310px] flex-col justify-end p-4 text-white sm:min-h-[360px] sm:p-5">
                <div className="mh-icon-glow mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/18 shadow-inner backdrop-blur-xl">
                  <occasion.Icon className="h-6 w-6 text-amber-100" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">{occasion.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-black leading-tight">{occasion.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-stone-200">{occasion.copy}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-amber-100">
                  Dekhiye
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
