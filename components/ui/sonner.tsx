// src/components/ui/sonner.tsx
"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            expand
            visibleToasts={4}
            offset="84px"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:w-[calc(100vw-24px)] group-[.toaster]:max-w-[430px] group-[.toaster]:overflow-hidden group-[.toaster]:rounded-[1.35rem] group-[.toaster]:border group-[.toaster]:border-[#fff2d2]/80 group-[.toaster]:!bg-[#fff8e7] group-[.toaster]:p-4 group-[.toaster]:pl-5 group-[.toaster]:!text-[#25140d] group-[.toaster]:shadow-[0_24px_80px_-48px_rgba(69,32,15,0.82)] group-[.toaster]:backdrop-blur-2xl group-[.toaster]:before:absolute group-[.toaster]:before:inset-y-0 group-[.toaster]:before:left-0 group-[.toaster]:before:w-1.5 group-[.toaster]:before:bg-[#7c2d12] group-[.toaster]:before:content-[''] group-[.toaster]:after:absolute group-[.toaster]:after:inset-x-0 group-[.toaster]:after:top-0 group-[.toaster]:after:h-1 group-[.toaster]:after:bg-[linear-gradient(90deg,#b91c1c,#f59e0b,#0f766e,#4f46e5)] group-[.toaster]:after:content-['']",
                    success: "group-[.toaster]:before:!bg-emerald-700 group-[.toaster]:!border-emerald-200 group-[.toaster]:!bg-[linear-gradient(135deg,#fff8e7,#ecfdf5)]",
                    error: "group-[.toaster]:before:!bg-red-700 group-[.toaster]:!border-red-200 group-[.toaster]:!bg-[linear-gradient(135deg,#fff8e7,#fef2f2)]",
                    warning: "group-[.toaster]:before:!bg-amber-600 group-[.toaster]:!border-amber-200 group-[.toaster]:!bg-[linear-gradient(135deg,#fff8e7,#fffbeb)]",
                    info: "group-[.toaster]:before:!bg-sky-700 group-[.toaster]:!border-sky-200 group-[.toaster]:!bg-[linear-gradient(135deg,#fff8e7,#f0f9ff)]",
                    loading: "group-[.toaster]:before:!bg-primary group-[.toaster]:!border-[#fff2d2] group-[.toaster]:!bg-[#fff8e7]",
                    icon: "group-[.toast]:mr-3 group-[.toast]:flex group-[.toast]:h-9 group-[.toast]:w-9 group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:rounded-2xl group-[.toast]:border group-[.toast]:border-[#2b1710]/10 group-[.toast]:bg-white/70 group-[.toast]:shadow-sm",
                    title: "group-[.toast]:text-sm group-[.toast]:font-black group-[.toast]:tracking-tight group-[.toast]:!text-[#25140d]",
                    description: "group-[.toast]:mt-1 group-[.toast]:text-xs group-[.toast]:font-semibold group-[.toast]:leading-5 group-[.toast]:!text-stone-600",
                    actionButton: "group-[.toast]:rounded-xl group-[.toast]:bg-[#2b1710] group-[.toast]:px-3 group-[.toast]:font-black group-[.toast]:text-white group-[.toast]:shadow-sm",
                    cancelButton: "group-[.toast]:rounded-xl group-[.toast]:bg-[#f4dfbd] group-[.toast]:font-black group-[.toast]:text-[#2b1710]",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
