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
import { toast } from "sonner"
import { Loader2, LogIn } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: "Bhai, sahi email toh daalo!" }),
    password: z.string().min(8, { message: "Password kam se kam 8 chars ka hona chahiye" }),
});

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

            toast.success("Swagat hai bhai!", {
                description: response.message || "Login safal raha.",
            });

            // Redirect logic (Safe redirect)
            if (response.roles.includes('ADMIN')) {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/'); 
            }
        } catch (error: any) {
            toast.error("Login Fail", {
                description: error.response?.data?.message || "Check your credentials",
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
        <div className="container relative min-h-screen flex flex-col items-center justify-center lg:px-0">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-3xl font-black tracking-tighter">MAITHIL HAAT</h1>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                        Aapne account mein login karein
                    </p>
                </div>

                <div className="grid gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
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
                            <Button type="submit" className="w-full h-12 rounded-xl font-bold text-lg" disabled={isSubmitting}>
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