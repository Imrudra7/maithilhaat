'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authService } from '@/lib/services/auth-service';
import { useAuth } from '@/context/AuthContext';
import { notify } from '@/lib/notify';
import { Eye, EyeOff, Loader2, LockKeyhole, LogIn, Mail } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: 'Bhai, sahi email toh daalo!' }),
    password: z.string().min(8, { message: 'Password kam se kam 8 chars ka hona chahiye' }),
});

function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        return response?.data?.message || fallback;
    }

    return fallback;
}

function getSafeRedirectPath() {
    if (typeof window === 'undefined') return null;

    const redirect = new URLSearchParams(window.location.search).get('redirect');

    if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
        return null;
    }

    return redirect;
}

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isLoggedIn, isLoading: authLoading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            router.replace(getSafeRedirectPath() ?? '/');
        }
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        if (authLoading || isLoggedIn || searchParams.get('reason') !== 'cart') {
            return;
        }

        const toastKey = `maithilhaat:login-toast:${searchParams.get('reason')}:${searchParams.get('redirect') ?? ''}`;
        const lastShownAt = Number(sessionStorage.getItem(toastKey) ?? 0);
        const now = Date.now();

        if (now - lastShownAt < 1500) {
            return;
        }

        sessionStorage.setItem(toastKey, String(now));

        notify.info('Please login to view your cart', {
            description: 'Login ke baad aap direct cart page par chale jayenge.',
        });
    }, [authLoading, isLoggedIn, searchParams]);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsSubmitting(true);
        try {
            const response = await authService.login(values);
            login(response);

            notify.success('Swagat hai bhai!', {
                description: response.message || 'Login safal raha.',
            });

            const redirectPath = getSafeRedirectPath();

            if (redirectPath) {
                router.replace(redirectPath);
            } else if (response.roles.includes('ADMIN')) {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/');
            }
        } catch (error: unknown) {
            notify.error('Login Fail', {
                description: getErrorMessage(error, 'Check your credentials'),
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fbf7ef]">
                <Loader2 className="h-8 w-8 animate-spin text-[#512f20]" />
            </div>
        );
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef]">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(67,43,28,0.08),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(30,132,116,0.16),transparent_28%)]" />

            <div className="relative grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
                <section className="hidden min-h-screen p-5 pr-0 lg:block">
                    <div className="relative h-[calc(100vh-40px)] min-h-[560px] overflow-hidden rounded-br-[28px] rounded-tr-[28px] border border-white/40 shadow-[0_30px_90px_rgba(43,23,16,0.28)]">
                        <Image
                            src="/images/maithil-art-gallery-hero.png"
                            alt="Maithil art gallery"
                            fill
                            priority
                            sizes="54vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/48 via-black/20 to-transparent" />
                        <div className="absolute bottom-32 left-10 max-w-[520px] text-white xl:bottom-36 xl:left-12">
                            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
                                Maithil Haat
                            </p>
                            <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal xl:text-5xl">
                                Handmade stories, welcome home.
                            </h1>
                        </div>
                    </div>
                </section>

                <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
                    <div className="mh-fade-up w-full max-w-[430px]">
                        <div className="mb-6 text-center lg:text-left">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#512f20]"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#512f20] text-base text-white">
                                    MH
                                </span>
                                Maithil Haat
                            </Link>
                            <h2 className="mt-7 text-3xl font-black tracking-normal text-[#261911] sm:text-4xl">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-sm font-medium text-[#7a685d]">
                                Apne account mein login karein
                            </p>
                        </div>

                        <div
                            className="border border-[#eadfce] bg-white/92 p-6 shadow-[0_24px_70px_rgba(73,45,24,0.16)] backdrop-blur sm:p-7"
                            style={{ borderRadius: 8 }}
                        >
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-bold text-[#38261b]">
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8172]" />
                                                        <Input
                                                            placeholder="name@example.com"
                                                            autoComplete="email"
                                                            {...field}
                                                            className="h-12 rounded-lg border-[#dfd2c2] bg-[#fffbf5] pl-10 font-medium focus-visible:ring-[#7b4a32]"
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-bold text-[#38261b]">
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8172]" />
                                                        <Input
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="********"
                                                            autoComplete="current-password"
                                                            {...field}
                                                            className="h-12 rounded-lg border-[#dfd2c2] bg-[#fffbf5] px-10 font-medium focus-visible:ring-[#7b4a32]"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword((value) => !value)}
                                                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[#7a685d] transition hover:bg-[#f1e7d9] hover:text-[#38261b]"
                                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        className="mh-press h-12 w-full rounded-lg bg-[#512f20] text-base font-black text-white shadow-lg shadow-[#512f20]/20 hover:bg-[#6a3d29]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Checking...
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="mr-2 h-4 w-4" /> Login
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        <p className="mt-5 text-center text-sm font-medium text-[#7a685d]">
                            Account nahi hai?{' '}
                            <Link
                                href="/register"
                                className="font-black text-[#512f20] underline underline-offset-4 hover:text-[#0f766e]"
                            >
                                Register Karein
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
