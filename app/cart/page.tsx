// src/app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cartService } from '@/lib/services/cart-service';

export default function CartPage() {
    // Mock Cart Items (Based on your Product/Variant structure)
    const [items, setItems] = useState([
        {
            id: 'p1',
            name: 'Classic Madhubani Tree of Life',
            variant: 'A4 Size',
            price: 1999,
            mrp: 2499,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=200'
        }
    ]);

    const updateQuantity = async (id: string, delta: number) => {
        const targetItem = items.find(item => item.id === id);
        if (!targetItem) return;

        const quantity = Math.max(1, targetItem.quantity + delta);
        await cartService.updateCart({ cartItemId: id, quantity }); // Assuming updateCart is a method in cartService

        setItems(prevItems => prevItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
    };

    const removeItem = async (id: string) => {
        await cartService.deleteItem({ cartItemId: id }); 
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = items.reduce((acc, item) => acc + ((item.mrp - item.price) * item.quantity), 0);
    const deliveryFee = subtotal > 1999 ? 0 : 99;

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-black tracking-tighter mb-10">Your Shopping Bag <span className="text-lg font-normal text-slate-400">({items.length} items)</span></h1>

            <div className="flex flex-col lg:flex-row gap-10">

                {/* 1. Left: Cart Items List */}
                <div className="flex-1 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 md:gap-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900 md:text-lg leading-tight">{item.name}</h3>
                                        <p className="text-xs font-bold text-primary uppercase mt-1 tracking-wider">{item.variant}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl w-fit">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-primary transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-black w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-primary transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        {item.mrp > item.price && (
                                            <p className="text-xs text-slate-400 line-through font-bold">₹{(item.mrp * item.quantity).toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold">Your cart is empty</p>
                            <Link href="/shop">
                                <Button variant="link" className="text-primary font-black">Continue Shopping</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* 2. Right: Order Summary */}
                <aside className="w-full lg:w-[380px] space-y-6">
                    <Card className="p-6 rounded-3xl border-none shadow-xl bg-slate-900 text-white">
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>

                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>Total Savings</span>
                                <span>- ₹{discount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? <span className="text-green-400 font-bold uppercase text-[10px]">Free</span> : `₹${deliveryFee}`}</span>
                            </div>

                            <Separator className="bg-slate-800" />

                            <div className="flex justify-between text-xl font-black pt-2">
                                <span>Total Amount</span>
                                <span>₹{(subtotal + deliveryFee).toLocaleString()}</span>
                            </div>
                        </div>
                        <Link href="/checkout" className="w-full block">
                            <Button className="w-full mt-8 h-14 rounded-2xl font-black text-lg gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                                Checkout Now
                                <ChevronRight size={20} />
                            </Button>
                        </Link>
                    </Card>

                    {/* Trust Indicators */}
                    <div className="p-6 rounded-3xl border border-slate-100 space-y-4 bg-white">
                        <div className="flex gap-4 items-start">
                            <ShieldCheck className="text-green-600 shrink-0" size={24} />
                            <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-tight">100% Secure Payments with Encryption</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Truck className="text-blue-600 shrink-0" size={24} />
                            <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-tight">Express delivery in 2-4 business days</p>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}