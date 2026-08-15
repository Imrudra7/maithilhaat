'use client';

import React, { useState, useEffect } from 'react'; // 🔥 useEffect add kiya
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from '@/lib/services/auth-service';
import { useAuth } from "@/context/AuthContext"; // 🔥 useAuth import kiya
import { notify } from "@/lib/notify";
import { Loader2, LogIn } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: "Bhai, sahi email toh daalo!" }),
    password: z.string().min(8, { message: "Password kam se kam 8 chars ka hona chahiye" }),
});

function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        return response?.data?.message || fallback;
    }

    return fallback;
}

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoggedIn, isLoading: authLoading } = useAuth(); // 🔥 Auth states nikali
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔄 Infinite Loop Prevention: Agar logged in ho toh login page mat dikhao
    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            router.replace('/'); 
        }
    }, [isLoggedIn, authLoading, router]);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsSubmitting(true);
        try {
            const response = await authService.login(values);
            
            // 🔥 Context update karo (Isse global state update ho jayegi)
            login(response); 

            notify.success("Swagat hai bhai!", {
                description: response.message || "Login safal raha.",
            });

            // Redirect logic (Safe redirect)
            if (response.roles.includes('ADMIN')) {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/'); 
            }
        } catch (error: unknown) {
            notify.error("Login Fail", {
                description: getErrorMessage(error, "Check your credentials"),
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // 🛡️ Jab tak session check ho raha ho, kuch mat dikhao (loop preventer)
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container relative flex min-h-screen flex-col items-center justify-center lg:px-0">
            <div className="mh-fade-up mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-3xl font-black tracking-tighter">MAITHIL HAAT</h1>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                        Aapne account mein login karein
                    </p>
                </div>

                <div className="mh-card-hover grid gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@example.com" {...field} className="rounded-xl h-12" />
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
                                        <FormLabel className="font-bold">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} className="rounded-xl h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="mh-press mh-shine w-full h-12 rounded-xl font-bold text-lg" disabled={isSubmitting}>
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

                <p className="px-8 text-center text-sm text-slate-500">
                    Account nahi hai?{" "}
                    <Link href="/register" className="underline underline-offset-4 hover:text-primary font-bold">
                        Register Karein
                    </Link>
                </p>
            </div>
        </div>
    );
}
