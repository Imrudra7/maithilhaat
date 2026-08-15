'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart, LogOut, Menu, Package, Palette, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { notify } from '@/lib/notify';
import { cartService } from '@/lib/services/cart-service';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
    const router = useRouter();
    const { isLoggedIn, user, logout } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        let isMounted = true;

        const fetchCartCount = async () => {
            try {
                const cart = await cartService.getCart();
                if (!isMounted) return;
                setCartCount(new Set((cart.items ?? []).map((item) => item.productId)).size);
            } catch {
                if (isMounted) setCartCount(0);
            }
        };

        const handleCartUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<{ count?: number }>;
            setCartCount(customEvent.detail?.count ?? 0);
        };

        fetchCartCount();
        window.addEventListener('maithilhaat:cart-updated', handleCartUpdated);
        window.addEventListener('focus', fetchCartCount);

        return () => {
            isMounted = false;
            window.removeEventListener('maithilhaat:cart-updated', handleCartUpdated);
            window.removeEventListener('focus', fetchCartCount);
        };
    }, [isLoggedIn]);

    const handleLogoutClick = async () => {
        try {
            await logout();
            setCartCount(0);
            notify.success('Logged out successfully');
            router.push('/login');
        } catch {
            notify.error('Logout failed, try again');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
            <div className="bg-[#2b1710] px-3 py-2 text-center text-[10px] font-bold leading-4 tracking-wide text-white md:text-xs">
                Traditional Mithila art, modern haat. Free shipping on orders above Rs 1999.
            </div>

            <div className="container mx-auto flex h-16 items-center justify-between gap-2 px-3 sm:px-4 md:h-20 md:gap-4">
                <Link href="/" className="group flex shrink-0 items-center gap-3">
                    <span className="mh-icon-glow flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Palette className="h-5 w-5" />
                    </span>
                    <span className="leading-none">
                        <span className="block text-lg font-black tracking-tight text-primary md:text-2xl">Maithil</span>
                        <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">Haat</span>
                    </span>
                </Link>

                <nav className="hidden lg:flex items-center gap-7 text-sm font-black text-stone-600">
                    <Link href="/shop" className="relative transition-colors after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all hover:text-primary hover:after:w-full">Shop</Link>
                    <Link href="/orders" className="relative transition-colors after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all hover:text-primary hover:after:w-full">Orders</Link>
                    <Link href="/wishlist" className="relative transition-colors after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all hover:text-primary hover:after:w-full">Wishlist</Link>
                </nav>

                <div className="hidden md:flex flex-1 max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search paintings, sarees, decor..."
                        className="pl-11 bg-white/85 border-stone-200 h-12 rounded-2xl shadow-sm focus-visible:ring-primary/25"
                    />
                </div>

                <div className="flex items-center gap-1.5 md:gap-4">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="mh-press flex items-center gap-2 hover:bg-primary/10 rounded-2xl px-1.5 md:px-2">
                                    <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/15">
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start leading-none">
                                        <span className="text-xs font-bold text-muted-foreground">Namaste,</span>
                                        <span className="text-[13px] font-black text-primary truncate max-w-[90px]">
                                            {user?.fullName?.split(' ')[0]}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-2xl border-stone-100" align="end">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mera Account</p>
                                    <p className="text-xs font-bold text-slate-700 truncate">{user?.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-xl cursor-pointer font-bold gap-2 py-2.5">
                                    <User size={16} className="text-slate-500" /> My Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/orders')} className="rounded-xl cursor-pointer font-bold gap-2 py-2.5">
                                    <Package size={16} className="text-slate-500" /> My Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/wishlist')} className="rounded-xl cursor-pointer font-bold gap-2 py-2.5">
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
                            <Button className="mh-press mh-shine rounded-2xl px-6 font-black shadow-lg shadow-primary/20 hover:scale-105">
                                Login
                            </Button>
                        </Link>
                    )}

                    <Link href="/cart">
                        <Button variant="outline" className="mh-press relative flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-stone-200 bg-white/85 p-0">
                            <ShoppingCart size={20} />
                            <Badge className="absolute -top-2 -right-2 bg-primary border-2 border-background px-1.5 min-w-[20px] h-5">
                                {cartCount}
                            </Badge>
                        </Button>
                    </Link>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                aria-label="Open menu"
                                className="mh-press h-11 w-11 rounded-2xl border-2 border-stone-200 bg-white/85 p-0 lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[88vw] max-w-sm overflow-y-auto border-l border-[#fff2d2]/70 bg-[linear-gradient(180deg,rgba(255,248,231,0.96),rgba(244,223,189,0.96)),url('/images/mithila-kapra-showcase.png')] bg-cover bg-center p-0">
                            <SheetHeader className="border-b border-[#2b1710]/10 p-5 text-left">
                                <SheetTitle className="flex items-center gap-3 text-[#2b1710]">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                        <Palette className="h-5 w-5" />
                                    </span>
                                    MaithilHaat
                                </SheetTitle>
                            </SheetHeader>

                            <div className="space-y-5 p-5">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        placeholder="Search paintings, sarees..."
                                        className="h-12 rounded-2xl border-[#2b1710]/10 bg-white/70 pl-11 shadow-sm"
                                    />
                                </div>

                                <nav className="grid gap-2 text-sm font-black text-[#2b1710]">
                                    {[
                                        { href: '/shop', label: 'Shop' },
                                        { href: '/orders', label: 'Orders' },
                                        { href: '/wishlist', label: 'Wishlist' },
                                        { href: '/cart', label: 'Cart' },
                                    ].map((item) => (
                                        <SheetClose asChild key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="mh-card-hover rounded-2xl border border-[#2b1710]/10 bg-white/58 px-4 py-3 shadow-sm backdrop-blur-xl hover:bg-white"
                                            >
                                                {item.label}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </nav>

                                <div className="rounded-2xl border border-[#2b1710]/10 bg-[#2b1710]/90 p-4 text-white shadow-lg">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">
                                        Mithila haat
                                    </p>
                                    <p className="mt-2 text-sm font-semibold leading-6 text-stone-200">
                                        Paintings, handloom, decor aur handmade pieces phone se bhi easily explore karein.
                                    </p>
                                </div>

                                {!isLoggedIn && (
                                    <SheetClose asChild>
                                        <Link href="/login">
                                            <Button className="mh-press mh-shine h-12 w-full rounded-2xl font-black">
                                                Login
                                            </Button>
                                        </Link>
                                    </SheetClose>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
