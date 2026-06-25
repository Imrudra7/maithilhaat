'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Heart, Menu, MapPin, LogOut, Package, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const router = useRouter();
    const { isLoggedIn, user, logout } = useAuth(); // 🔥 user aur logout yahan se lo

    const handleLogoutClick = async () => {
        try {
            await logout(); // Context wala logout (State + API + LocalStorage handle karega)
            toast.success("Logged out successfully");
            router.push('/login');
        } catch (error) {
            toast.error("Logout failed, try again");
        }
    };

    const handleProfileClick = () => {
        router.push('/profile');
    }

    const handleOrdersClick = () => {
        router.push('/orders');
    }

    const handleWishlistClick = () => {
        router.push('/wishlist');
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Banner */}
            <div className="bg-slate-900 text-white text-[10px] md:text-xs py-2 text-center font-medium tracking-wide">
                ✨ Traditional Mithila Art, Modern Haat. Free Shipping on orders above ₹1999!
            </div>

            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-primary">
                        MAITHIL<span className="text-foreground">HAAT</span>
                    </Link>
                </div>

                {/* Search */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input placeholder="Search paintings..." className="pl-10 bg-muted/50 border-none h-11 rounded-xl" />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4">

                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/5 rounded-xl px-2">
                                    {/* User Avatar Circle */}
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start leading-none">
                                        <span className="text-xs font-bold">Namaste,</span>
                                        <span className="text-[13px] font-black text-primary truncate max-w-[80px]">
                                            {user?.fullName?.split(' ')[0]}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-slate-100" align="end">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mera Account</p>
                                    <p className="text-xs font-bold text-slate-700 truncate">{user?.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleProfileClick} className="rounded-xl cursor-pointer font-bold gap-2 py-2.5">
                                    <User size={16} className="text-slate-500" /> My Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleOrdersClick} className="rounded-xl cursor-pointer font-bold gap-2 py-2.5">
                                    <Package size={16} className="text-slate-500" /> My Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleWishlistClick} className="rounded-xl cursor-pointer font-bold gap-2 py-2.5">
                                    <Heart size={16} className="text-slate-500" /> Wishlist
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogoutClick}
                                    className="rounded-xl cursor-pointer font-black gap-2 py-2.5 text-red-500 focus:text-red-500 focus:bg-red-50"
                                >
                                    <LogOut size={16} /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button className="font-bold px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                Login
                            </Button>
                        </Link>
                    )}

                    {/* Cart with Badge */}
                    <Link href="/cart">
                        <Button variant="outline" className="relative border-2 rounded-xl h-11 w-11 p-0 flex items-center justify-center border-slate-100">
                            <ShoppingCart size={20} />
                            <Badge className="absolute -top-2 -right-2 bg-primary border-2 border-background px-1.5 min-w-[20px] h-5">
                                0
                            </Badge>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}