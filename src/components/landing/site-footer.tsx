import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { SERVICE_AREAS } from "@/lib/service-areas";
import { createSalesWhatsAppUrl } from "@/lib/whatsapp-link";

export function SiteFooter() {
  const serviceAreaNames = SERVICE_AREAS.map((area) => area.name).join(", ");

  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between lg:gap-12">
          <div>
            <p className="font-semibold text-white">{siteConfig.name}</p>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-400 lg:text-sm lg:leading-6">
              Informasi paket Indibiz untuk usaha di DIY Yogyakarta. Tim kami membantu
              konsultasi dan pendaftaran di {serviceAreaNames}.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a
                className="inline-flex w-fit items-center gap-2 hover:text-white"
                href={`tel:${siteConfig.salesPhone}`}
              >
                <Phone aria-hidden="true" className="size-4" />
                {siteConfig.salesPhone}
              </a>
              <a
                className="inline-flex w-fit items-center gap-2 text-emerald-300 hover:text-emerald-200"
                href={createSalesWhatsAppUrl(
                  "Halo, saya ingin konsultasi paket Indibiz untuk wilayah DIY Yogyakarta.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                WhatsApp sales
              </a>
            </div>
          </div>
          <nav aria-label="Tautan informasi" className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2 lg:gap-x-7 lg:text-base">
            <Link className="hover:text-white" href="/#paket">Paket</Link>
            <Link className="hover:text-white" href="/#jangkauan">Wilayah</Link>
            <Link className="hover:text-white" href="/#hubungi-sales">Hubungi admin</Link>
            <Link className="hover:text-white" href="/privacy">Kebijakan privasi</Link>
          </nav>
        </div>
        <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-slate-400 lg:mt-8">
          <p className="inline-flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            Area layanan: {serviceAreaNames}. Ketersediaan jaringan bergantung pada
            alamat pemasangan.
          </p>
          <p className="mt-3">
            Website ini dikelola oleh Mitra/Sales Resmi Indibiz area DIY Yogyakarta
            untuk membantu proses pendaftaran dan informasi layanan. Website ini
            bukan website utama PT Telkom Indonesia (Persero) Tbk.
          </p>
        </div>
      </div>
    </footer>
  );
}
