"use client";

import { MessageCircle } from "lucide-react";

const SALES_WHATSAPP = process.env.NEXT_PUBLIC_SALES_WHATSAPP ?? "6285179657878";

export function WhatsappFloat() {
  const message = encodeURIComponent(
    "Halo, saya ingin bertanya tentang paket Indibiz."
  );

  return (
    <a
      href={`https://wa.me/${SALES_WHATSAPP}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center"
      aria-label="Chat via WhatsApp"
    >
      {/* Ring pulse — menarik perhatian tanpa jadi mengganggu */}
      <span className="absolute inset-0 rounded-full bg-emerald-500/50 motion-safe:animate-ping" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-105">
        <MessageCircle className="h-6 w-6" fill="white" />
      </span>
    </a>
  );
}