// src/app/dashboard/orders/page.tsx
'use client';

import React from 'react';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function MyOrdersPage() {
    const orders = [
        { id: 'MH-992834', date: 'Mar 03, 2026', total: 1999, status: 'Processing', items: 1 },
        { id: 'MH-881722', date: 'Feb 12, 2026', total: 8500, status: 'Delivered', items: 2 }
    ];

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <h1 className="text-3xl font-black tracking-tighter mb-8">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-lg transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-primary">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900">Order {order.id}</h3>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                                        <Clock size={12} />
                                        <span>Placed on {order.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">₹{order.total.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{order.items} Items</p>
                                </div>
                                <Badge className={`${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} border-none font-bold px-3 py-1 rounded-lg`}>
                                    {order.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="rounded-xl">
                                    <ChevronRight size={20} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}