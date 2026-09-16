import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSalesWhatsAppUrl } from "@/lib/whatsapp-link";

export function WhatsAppContactSection() {
  return (
    <section id="hubungi-sales" className="px-5 py-10 sm:px-6 sm:py-20 lg:py-24">
      <span id="cek-jangkauan" className="scroll-mt-8" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-3xl border border-white/10 bg-brand-navy px-5 py-6 text-white shadow-sm sm:gap-6 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[2rem] lg:px-12 lg:py-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-[1.7rem] leading-[1.22] font-semibold tracking-[-0.025em] text-white sm:text-3xl lg:text-4xl lg:leading-tight">
            Tanyakan langsung kepada admin sales.
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-6 text-slate-200 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            Klik tombol untuk langsung membuka chat WhatsApp admin sales. Tidak perlu isi formulir.
          </p>
        </div>
        <Button asChild size="lg" className="h-12 shrink-0 rounded-full bg-[#25D366] px-6 text-white shadow-sm shadow-[#25D366]/25 hover:bg-[#128C7E] lg:h-14 lg:px-8">
          <a
            href={createSalesWhatsAppUrl("Halo admin Indibiz, saya ingin konsultasi paket internet bisnis.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Hubungi admin
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
