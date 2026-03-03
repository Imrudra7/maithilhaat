'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from "sonner"; // 🔥 Sonner use kar rahe hain

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from '@/lib/services/auth-service';
import { Loader2, UserPlus } from 'lucide-react';

const registerSchema = z.object({
    fullName: z.string().min(2, "Pura naam likho bhai"),
    email: z.string().email("Sahi email chahiye"),
    password: z.string().min(8, "Kam se kam 8 chars ka password"),
    termsAccepted: z.boolean().refine(val => val === true, "Terms manzoor karni hogi"),
});

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: "", email: "", password: "", termsAccepted: false },
    });

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        try {
            await authService.register(values);
            toast.success("Badhai ho!", {
                description: "Account ban gaya hai. Ab login karein.",
            });
            router.push('/login');
        } catch (error: any) {
            toast.error("Registration Fail", {
                description: error.response?.data?.message || "Kuch toh gadbad hai!",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl shadow-sm border">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black">Join Maithil Art</h1>
                    <p className="text-slate-500 text-sm">Apna naya account banayein</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Full Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Email</FormLabel>
                                <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="termsAccepted" render={({ field }) => (
                            <FormItem className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="text-sm cursor-pointer font-medium">Terms and Conditions manzoor hain</FormLabel>
                            </FormItem>
                        )} />

                        <Button type="submit" className="w-full h-12 rounded-xl" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <><UserPlus className="mr-2" size={18} /> Register</>}
                        </Button>
                    </form>
                </Form>
                <p className="mt-6 text-center text-sm">
                    Pehle se account hai? <Link href="/login" className="text-blue-600 font-bold underline">Login</Link>
                </p>
            </div>
        </div>
    );
}