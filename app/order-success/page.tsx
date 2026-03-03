// src/app/order-success/page.tsx
'use client';

import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                <CheckCircle2 size={48} className="text-green-600" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900">
                Order Confirmed!
            </h1>
            <p className="text-slate-500 font-bold text-lg max-w-md mb-10">
                Bhai, aapka order successfully place ho gaya hai. Hum jaldi hi aapke Maithil Art ko pack karke nikalenge.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Package size={24} className="mx-auto mb-3 text-primary" />
                    <h3 className="font-black text-sm uppercase">Order ID</h3>
                    <p className="text-slate-500 font-bold text-xs mt-1">#MH-992834</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <Truck size={24} className="mx-auto mb-3 text-primary" />
                    <h3 className="font-black text-sm uppercase">Est. Delivery</h3>
                    <p className="text-slate-500 font-bold text-xs mt-1">Mar 10 - Mar 12</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <CheckCircle2 size={24} className="mx-auto mb-3 text-primary" />
                    <h3 className="font-black text-sm uppercase">Payment</h3>
                    <p className="text-slate-500 font-bold text-xs mt-1">Confirmed (UPI)</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard/orders">
                    <Button size="lg" className="rounded-2xl font-black px-8 h-14 shadow-xl shadow-primary/20">
                        Track My Order
                    </Button>
                </Link>
                <Link href="/shop">
                    <Button size="lg" variant="outline" className="rounded-2xl font-black px-8 h-14 border-2">
                        Continue Shopping
                        <ArrowRight size={18} className="ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}