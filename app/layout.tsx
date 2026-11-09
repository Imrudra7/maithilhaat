// src/app/layout.tsx
import { Inter, Noto_Sans_Tirhuta } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const tirhuta = Noto_Sans_Tirhuta({
  weight: "400",
  subsets: ["latin", "tirhuta"],
  display: "swap",
  variable: "--font-tirhuta",
  fallback: ["Noto Sans Tirhuta", "Nirmala UI", "sans-serif"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${tirhuta.variable} min-h-screen bg-background`}>
        {/* 🔥 AuthProvider ko sabse upar rakho taaki Navbar ko bhi access mile */}
        <AuthProvider>
          <Navbar />

          <main className="relative flex flex-col min-h-screen">
            <div className="grow flex-1">{children}</div>
          </main>

          <Footer />
          <Toaster position="top-center" />
        </AuthProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
