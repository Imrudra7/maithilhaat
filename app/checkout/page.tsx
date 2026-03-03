// src/app/checkout/page.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2, MapPin, CreditCard, Truck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
    const [step, setStep] = useState(1); // 1: Address, 2: Payment

    return (
        <div className="container mx-auto px-4 py-10 max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-12">

                {/* LEFT: Checkout Steps */}
                <div className="flex-1 space-y-8">

                    {/* STEP 1: Shipping Address */}
                    <section className={`p-6 rounded-3xl border-2 transition-all ${step === 1 ? 'border-primary bg-white shadow-xl' : 'border-slate-100 opacity-60'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>1</div>
                                <h2 className="text-xl font-black tracking-tight">Shipping Address</h2>
                            </div>
                            {step > 1 && <Button variant="ghost" onClick={() => setStep(1)} className="text-primary font-bold">Edit</Button>}
                        </div>

                        {step === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-wider">Full Name</Label>
                                    <Input placeholder="Enter your name" className="rounded-xl border-slate-200 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-wider">Phone Number</Label>
                                    <Input placeholder="10-digit mobile number" className="rounded-xl border-slate-200 h-12" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-wider">Street Address / Landmark</Label>
                                    <Input placeholder="House No, Street, Area" className="rounded-xl border-slate-200 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-wider">Pincode</Label>
                                    <Input placeholder="6-digit code" className="rounded-xl border-slate-200 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-xs uppercase tracking-wider">City</Label>
                                    <Input placeholder="City name" className="rounded-xl border-slate-200 h-12" />
                                </div>
                                <Button onClick={() => setStep(2)} className="md:col-span-2 h-14 rounded-2xl font-black text-lg mt-4">
                                    Deliver to this Address
                                </Button>
                            </div>
                        )}
                    </section>

                    {/* STEP 2: Payment Method */}
                    <section className={`p-6 rounded-3xl border-2 transition-all ${step === 2 ? 'border-primary bg-white shadow-xl' : 'border-slate-100 opacity-60'}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-primary text-white' : 'bg-slate-200'}`}>2</div>
                            <h2 className="text-xl font-black tracking-tight">Payment Method</h2>
                        </div>

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                <RadioGroup defaultValue="upi" className="grid gap-4">
                                    <Label className="flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="upi" id="upi" />
                                            <span className="font-bold">UPI (PhonePe, Google Pay)</span>
                                        </div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4" alt="UPI" />
                                    </Label>
                                    <Label className="flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <span className="font-bold">Cash on Delivery</span>
                                        </div>
                                    </Label>
                                </RadioGroup>

                                <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                                    Pay & Place Order
                                </Button>
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT: Order Summary Sticky Card */}
                <aside className="w-full lg:w-80 h-fit sticky top-28">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                        <h3 className="font-black text-lg tracking-tight">Order Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Items (1)</span>
                                <span>₹1,999</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-green-600">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-xl font-black pt-2">
                                <span>Payable</span>
                                <span>₹1,999</span>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}