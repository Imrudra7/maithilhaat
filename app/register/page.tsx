'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { notify } from "@/lib/notify";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from '@/lib/services/auth-service';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserPlus, UserRound } from 'lucide-react';

const registerSchema = z.object({
    fullName: z.string().min(2, "Pura naam likho bhai"),
    email: z.string().email("Sahi email chahiye"),
    password: z.string().min(8, "Kam se kam 8 chars ka password"),
    termsAccepted: z.boolean().refine(val => val === true, "Terms manzoor karni hogi"),
});

function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        return response?.data?.message || fallback;
    }

    return fallback;
}

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: "", email: "", password: "", termsAccepted: false },
    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        try {
            await authService.register(values);
            notify.success("Badhai ho!", {
                description: "Account ban gaya hai. Ab login karein.",
            });
            router.push('/login');
        } catch (error: unknown) {
            notify.error("Registration Fail", {
                description: getErrorMessage(error, "Kuch toh gadbad hai!"),
            });
        } finally {
            setIsLoading(false);
        }
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
                                Handmade stories, made yours.
                            </h1>
                        </div>
                    </div>
                </section>

                <section className="flex min-h-screen items-start justify-center px-5 py-8 sm:px-8 lg:pt-14 xl:pt-16">
                    <div className="mh-fade-up w-full max-w-[430px]">
                        <div className="mb-5 text-center lg:text-left">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#512f20]"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#512f20] text-base text-white">
                                    MH
                                </span>
                                Maithil Haat
                            </Link>
                            <h1 className="mt-5 text-3xl font-black tracking-normal text-[#261911] sm:text-4xl">
                                Create account
                            </h1>
                            <p className="mt-2 text-sm font-medium text-[#7a685d]">
                                Apna naya account banayein
                            </p>
                        </div>

                        <div
                            className="border border-[#eadfce] bg-white/92 p-5 shadow-[0_24px_70px_rgba(73,45,24,0.16)] backdrop-blur sm:p-6"
                            style={{ borderRadius: 8 }}
                        >
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField control={form.control} name="fullName" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-bold text-[#38261b]">Full Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8172]" />
                                                    <Input
                                                        placeholder="John Doe"
                                                        autoComplete="name"
                                                        {...field}
                                                        className="h-11 rounded-lg border-[#dfd2c2] bg-[#fffbf5] pl-10 font-medium focus-visible:ring-[#7b4a32]"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-bold text-[#38261b]">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8172]" />
                                                    <Input
                                                        placeholder="name@example.com"
                                                        autoComplete="email"
                                                        {...field}
                                                        className="h-11 rounded-lg border-[#dfd2c2] bg-[#fffbf5] pl-10 font-medium focus-visible:ring-[#7b4a32]"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="password" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-bold text-[#38261b]">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8172]" />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        autoComplete="new-password"
                                                        {...field}
                                                        className="h-11 rounded-lg border-[#dfd2c2] bg-[#fffbf5] pl-10 pr-11 font-medium focus-visible:ring-[#7b4a32]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((value) => !value)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7465] transition hover:text-[#512f20]"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="termsAccepted" render={({ field }) => (
                                        <FormItem className="flex items-start space-x-3 space-y-0 rounded-lg border border-[#eadfce] bg-[#fffbf5] p-3.5">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel className="cursor-pointer text-sm font-semibold leading-5 text-[#5b4639]">
                                                Terms and Conditions manzoor hain
                                            </FormLabel>
                                        </FormItem>
                                    )} />

                                    <Button
                                        type="submit"
                                        className="mh-press h-11 w-full rounded-lg bg-[#5c3524] text-base font-black shadow-[0_14px_28px_rgba(92,53,36,0.24)] hover:bg-[#452719]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-5 w-5" />
                                                Register
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>

                        <p className="mt-4 text-center text-sm font-semibold text-[#7a685d]">
                            Pehle se account hai?{" "}
                            <Link href="/login" className="font-black text-[#512f20] underline underline-offset-4">
                                Login
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
