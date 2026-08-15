// src/components/navigation/Footer.tsx
import Link from 'next/link';
import { HeartHandshake, Instagram, Mail, MapPin, Palette } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative mt-12 overflow-hidden border-t border-stone-200 bg-[#241711] text-stone-100">
            <div className="mh-rang-strip absolute inset-x-0 top-0 h-1" />
            <div className="container mx-auto px-4 py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
                    <div className="space-y-5">
                        <Link href="/" className="group inline-flex items-center gap-3">
                            <span className="mh-icon-glow flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary">
                                <Palette className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="block text-2xl font-black tracking-tight">MaithilHaat</span>
                                <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">Artisan marketplace</span>
                            </span>
                        </Link>
                        <p className="max-w-sm text-sm font-medium leading-7 text-stone-300">
                            A curated space for Mithila paintings, handloom, decor, and everyday objects shaped by artists and craft families.
                        </p>
                    </div>

                    <div>
                        <h4 className="museum-label mb-5 text-stone-400">Collect</h4>
                        <ul className="space-y-3 text-sm font-bold text-stone-300">
                            <li><Link href="/shop" className="transition-colors hover:text-white hover:underline hover:underline-offset-4">Original paintings</Link></li>
                            <li><Link href="/shop" className="transition-colors hover:text-white hover:underline hover:underline-offset-4">Handloom pieces</Link></li>
                            <li><Link href="/shop" className="transition-colors hover:text-white hover:underline hover:underline-offset-4">Home decor</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="museum-label mb-5 text-stone-400">Care</h4>
                        <ul className="space-y-3 text-sm font-bold text-stone-300">
                            <li><Link href="/orders" className="transition-colors hover:text-white hover:underline hover:underline-offset-4">Track order</Link></li>
                            <li><Link href="/cart" className="transition-colors hover:text-white hover:underline hover:underline-offset-4">Shopping bag</Link></li>
                            <li><Link href="/profile" className="transition-colors hover:text-white hover:underline hover:underline-offset-4">My profile</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="museum-label text-stone-400">Stay Close</h4>
                        <div className="space-y-3 text-sm font-bold text-stone-300">
                            <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-amber-300" /> Bihar, India</p>
                            <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-emerald-300" /> support@maithilhaat.in</p>
                            <p className="flex items-center gap-3"><HeartHandshake className="h-4 w-4 text-rose-300" /> Made with artisan-first values</p>
                        </div>
                        <Link href="/" className="mh-press inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white hover:text-[#241711]">
                            <Instagram className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-[11px] font-black uppercase tracking-widest text-stone-500 md:flex-row md:items-center md:justify-between">
                    <p>Copyright 2026 MaithilHaat. All rights reserved.</p>
                    <div className="flex gap-5">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Craft policy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
