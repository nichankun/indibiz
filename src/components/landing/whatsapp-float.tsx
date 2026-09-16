import { MessageCircle } from "lucide-react";
import { createSalesWhatsAppUrl } from "@/lib/whatsapp-link";

export function WhatsappFloat() {
  return (
    <div className="fixed bottom-7 right-7 z-40 hidden md:block">
      <a
        href={createSalesWhatsAppUrl("Halo admin Indibiz, saya ingin konsultasi paket internet bisnis.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi admin melalui WhatsApp"
        title="Chat admin melalui WhatsApp"
        className="group flex h-14 items-center gap-2.5 rounded-full bg-[#25D366] px-4 text-white shadow-lg shadow-[#128C7E]/25 transition-colors hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="text-sm font-semibold">Chat admin</span>
      </a>
    </div>
  );
}
