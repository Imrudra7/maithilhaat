import { CreditCard, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";

const trustItems = [
  {
    title: "Authentic handmade",
    copy: "Curated pieces with Mithila-inspired craft identity.",
    Icon: ShieldCheck,
  },
  {
    title: "Packed with care",
    copy: "Art, kapra aur decor ke liye thoughtful packaging.",
    Icon: PackageCheck,
  },
  {
    title: "Secure payments",
    copy: "Checkout flow modern ecommerce standards ke saath.",
    Icon: CreditCard,
  },
  {
    title: "Shipping support",
    copy: "Order updates aur delivery tracking ke liye ready flow.",
    Icon: Truck,
  },
];

export default function TrustServiceBand() {
  return (
    <section className="mh-scroll-reveal relative overflow-hidden py-12 md:py-16">
      <div className="mh-scroll-parallax absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(239,210,168,0.82),rgba(43,23,16,0.94)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,232,194,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(245,158,11,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="container mx-auto px-4">
        <div className="mh-fade-up relative overflow-hidden rounded-[1.5rem] border border-white/18 bg-[#2b1710]/82 p-4 text-white shadow-[0_30px_100px_-58px_rgba(0,0,0,0.92)] backdrop-blur-2xl sm:rounded-[2rem] sm:p-5 md:p-7">
          <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,232,194,0.08)_0_2px,transparent_3px),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.08)_0_2px,transparent_3px)] bg-[size:30px_30px]" />
          <div className="absolute right-8 top-6 hidden text-8xl font-black leading-none text-white/[0.035] lg:block">HAAT</div>

          <div className="relative mb-7 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[11px] font-black uppercase tracking-widest backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-amber-200" />
              Bharosa aur seva
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight min-[390px]:text-4xl md:text-5xl">
              Beautiful shopping, clear confidence
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-stone-300">
              User ko purchase se pehle jo assurance chahiye, woh homepage par hi visible rahega.
            </p>
          </div>

          <div className="mh-stagger relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="mh-card-hover group relative overflow-hidden rounded-[1.5rem] border border-white/16 bg-white/12 p-5 shadow-[0_24px_80px_-58px_rgba(0,0,0,0.85)] backdrop-blur-xl hover:bg-white/16"
              >
                <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-70" />
                <div className="mh-orbit absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/10" />
                <div className="mh-icon-glow mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/18 bg-white/14 text-amber-100 shadow-inner">
                  <item.Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-stone-300">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
