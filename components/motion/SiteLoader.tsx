import { Palette, Sparkles } from "lucide-react";

export default function SiteLoader() {
  return (
    <main className="relative flex min-h-[70svh] items-center justify-center overflow-hidden px-4 py-14">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.22),rgba(239,225,197,0.82)_34%,rgba(231,247,240,0.62)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center opacity-95" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(67,37,23,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <section className="mh-fade-up relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-[#fff2d2]/70 bg-[#f4dfbd]/62 p-6 text-center shadow-[0_30px_100px_-58px_rgba(69,32,15,0.86)] backdrop-blur-2xl">
        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1.5" />
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full border border-primary/10" />
        <div className="absolute -right-14 bottom-8 h-36 w-36 rounded-full border border-emerald-700/10" />

        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
          <svg
            viewBox="0 0 120 120"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <circle cx="60" cy="60" r="44" fill="rgba(255,248,231,0.58)" />
            <g className="mh-loader-ring">
              <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(43,23,16,0.14)" strokeWidth="7" />
              <circle className="mh-loader-path" cx="60" cy="60" r="45" fill="none" stroke="#b45309" strokeLinecap="round" strokeWidth="7" />
            </g>
            <g fill="none" stroke="#7c2d12" strokeLinecap="round" strokeWidth="3">
              <path d="M60 25 C72 39 72 51 60 60 C48 51 48 39 60 25Z" />
              <path d="M95 60 C81 72 69 72 60 60 C69 48 81 48 95 60Z" />
              <path d="M60 95 C48 81 48 69 60 60 C72 69 72 81 60 95Z" />
              <path d="M25 60 C39 48 51 48 60 60 C51 72 39 72 25 60Z" />
            </g>
          </svg>
          <div className="mh-icon-glow relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2b1710] text-amber-100 shadow-xl shadow-stone-900/15">
            <Palette className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#fff8e7]/62 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            MaithilHaat
          </p>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-[#25140d]">Haat saj raha hai</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
            Mithila rang, craft aur products load ho rahe hain.
          </p>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          <span className="mh-loader-dot h-2.5 w-2.5 rounded-full bg-red-700" />
          <span className="mh-loader-dot h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span className="mh-loader-dot h-2.5 w-2.5 rounded-full bg-teal-700" />
        </div>
      </section>
    </main>
  );
}
