import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indibiz — Internet Cepat untuk Rumah & Bisnis Anda",
  description:
    "Pasang Indibiz sekarang. Pilih paket Basic atau Bisnis, cek jangkauan area Anda, dan dapatkan promo terbaru.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
