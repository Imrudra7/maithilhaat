// src/app/layout.tsx
import { Inter } from "next/font/google";
// @ts-ignore: CSS module declaration not found, handled by Next.js
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        {/* 🔥 AuthProvider ko sabse upar rakho taaki Navbar ko bhi access mile */}
        <AuthProvider>
          <Navbar />

          <main className="relative flex flex-col min-h-screen">
            <div className="grow flex-1">
              {children}
            </div>
          </main>

          <Footer />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}