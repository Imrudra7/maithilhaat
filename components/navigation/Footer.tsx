// src/components/navigation/Footer.tsx
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-primary">
                            MAITHIL<span className="text-foreground">HAAT</span>
                        </Link>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Bringing the ancient legacy of Mithila Art into the modern world. Every piece is handcrafted with love and tradition in Bihar.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-6">Quick Shop</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-600">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Paintings</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Handloom Sarees</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Wall Decor</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-600">
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
                            <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
                            <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-6">Follow Our Story</h4>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm">IG</div>
                            <div className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer shadow-sm">FB</div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 MaithilHaat. All Rights Reserved. Crafted with ❤️ in Bihar.
                    </p>
                    <div className="flex gap-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase hover:text-primary cursor-pointer">Privacy Policy</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase hover:text-primary cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}