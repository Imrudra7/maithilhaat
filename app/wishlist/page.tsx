'use client';

import Link from 'next/link';
import { ArrowRight, Bell, Clock3, Eye, Gift, Heart, Palette, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const wishlistPlans = [
    { Icon: Eye, title: 'Watch craft drops', copy: 'New paintings, kapra aur decor ko save karke later compare karna easy hoga.', status: 'Upcoming' },
    { Icon: Gift, title: 'Gift shortlist', copy: 'Shaadi, griha pravesh aur festive gifting ke liye pieces shortlist karein.', status: 'Planned' },
    { Icon: Bell, title: 'Back-in-stock mood', copy: 'Wishlist APIs connect hone ke baad reminders aur saved intent yahin dikhega.', status: 'Soon' },
];

const wishlistMoods = ['Kohbar wall', 'Sikki decor', 'Madhubani painting', 'Thekua box', 'Maithili kapra'];

export default function WishlistPage() {
    return (
        <main className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(90,52,36,0.2),rgba(239,225,197,0.78)_26%,rgba(231,247,240,0.58)_76%,rgba(90,52,36,0.16)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center opacity-95" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(67,37,23,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,118,110,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute -left-20 top-20 -z-10 h-56 w-56 rounded-full border border-primary/10" />
            <div className="absolute -right-24 bottom-12 -z-10 h-72 w-72 rounded-full border border-emerald-700/10" />

            <div className="container mx-auto px-4 py-8 md:py-12">
            <section className="mh-fade-up mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#f4dfbd]/50 shadow-[0_30px_100px_-58px_rgba(69,32,15,0.78)] backdrop-blur-2xl sm:rounded-[2rem]">
                <div className="mh-rang-strip h-1.5" />
                <div className="grid gap-7 p-5 md:grid-cols-[0.9fr_1.1fr] md:p-10">
                    <div className="mh-card-hover relative flex min-h-72 items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/18 bg-[#2b1710] text-white shadow-2xl shadow-stone-900/10">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(43,23,16,0.28),rgba(43,23,16,0.82)),url('/images/maithil-art-gallery-hero.png')] bg-cover bg-center" />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,232,194,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,232,194,0.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
                        <div className="mh-float-soft relative flex h-44 w-44 items-center justify-center rounded-full border border-white/15">
                            <div className="mh-orbit absolute h-28 w-28 rotate-12 rounded-[2rem] border border-amber-300/50" />
                            <Heart className="h-16 w-16 fill-rose-400 text-rose-400" />
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-6">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/70 bg-[#fff8e7]/62 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary shadow-sm backdrop-blur-xl">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Collector&apos;s corner
                        </div>

                        <div>
                            <p className="museum-label text-primary">Wishlist</p>
                            <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-stone-950 md:text-5xl">
                                Save the pieces that stay with you.
                            </h1>
                        </div>

                        <p className="text-sm font-semibold leading-7 text-stone-700">
                            Your saved artworks will appear here once wishlist APIs are connected. For now, continue exploring the collection and choose pieces from the product pages.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button asChild className="mh-press mh-shine h-12 rounded-2xl font-black">
                                <Link href="/shop">
                                    Browse Art
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="mh-press h-12 rounded-2xl border-2 font-black">
                                <Link href="/">
                                    <Palette className="h-4 w-4" />
                                    Back Home
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mh-scroll-reveal mx-auto mt-6 max-w-5xl">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="museum-label text-primary">Coming Soon</p>
                        <h2 className="text-2xl font-black tracking-tight text-stone-950">Wishlist features jo aage aayenge</h2>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#fff2d2]/70 bg-[#fff8e7]/64 px-4 py-2 text-xs font-black text-primary shadow-sm backdrop-blur-xl">
                        <Clock3 className="h-4 w-4" />
                        Future-ready
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                {wishlistPlans.map((plan) => (
                    <div key={plan.title} className="mh-card-hover relative overflow-hidden rounded-[1.5rem] border border-[#fff2d2]/70 bg-[#fff8e7]/58 p-5 shadow-sm backdrop-blur-xl">
                        <div className="mh-rang-strip absolute inset-x-0 top-0 h-1 opacity-75" />
                        <div className="flex items-start justify-between gap-3">
                            <plan.Icon className="mh-icon-glow h-6 w-6 text-primary" />
                            <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                                {plan.status}
                            </span>
                        </div>
                        <h2 className="mt-4 text-lg font-black text-stone-950">{plan.title}</h2>
                        <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">{plan.copy}</p>
                    </div>
                ))}
                </div>
            </section>

            <section className="mh-scroll-reveal mx-auto mt-6 max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/55 bg-[#2b1710]/86 p-5 text-white shadow-[0_28px_90px_-56px_rgba(43,23,16,0.9)] backdrop-blur-2xl sm:p-6">
                <div className="mh-rang-strip -mx-5 -mt-5 mb-5 h-1.5 sm:-mx-6 sm:-mt-6" />
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">Saved mood board</p>
                        <h2 className="mt-2 text-2xl font-black">Aapka Maithil collection plan</h2>
                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-stone-300">
                            Wishlist ko future me products, price watch aur gifting bundles ke saath connect kar sakte hain.
                        </p>
                    </div>
                    <Button asChild className="mh-press mh-shine h-12 rounded-2xl bg-white text-[#2b1710] font-black hover:bg-amber-100">
                        <Link href="/shop">
                            <ShoppingBag className="h-4 w-4" />
                            Start shortlisting
                        </Link>
                    </Button>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                    {wishlistMoods.map((mood) => (
                        <span key={mood} className="mh-tab-option rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-stone-100 backdrop-blur">
                            {mood}
                        </span>
                    ))}
                </div>
            </section>
            </div>
        </main>
    );
}
