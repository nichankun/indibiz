"use client";

import { MessageCircle } from "lucide-react";

const SALES_WHATSAPP = process.env.NEXT_PUBLIC_SALES_WHATSAPP ?? "6281234567890";

export function WhatsappFloat() {
  const message = encodeURIComponent(
    "Halo, saya ingin bertanya tentang paket Indibiz."
  );

  return (
    <a
      href={`https://wa.me/${SALES_WHATSAPP}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      // PERBAIKAN: Menghapus shadow berwarna agar lebih bersih di Dark Mode
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" fill="white" />
    </a>
  );
}