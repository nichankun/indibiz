import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { COVERAGE_REGIONS, SERVICE_AREAS } from "@/lib/service-areas";

export function TrustSection() {
  return (
    <section id="jangkauan" className="border-b border-border bg-white py-10 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
        <div>
          <h2 className="max-w-2xl font-display text-[1.7rem] leading-[1.22] font-semibold tracking-[-0.025em] text-brand-navy sm:text-3xl lg:text-4xl lg:leading-tight">
            Internet bisnis Indibiz untuk usaha di Indonesia
          </h2>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-6 text-slate-600 sm:text-base sm:leading-7 lg:max-w-xl lg:text-lg lg:leading-8">
            Indibiz tersedia di berbagai wilayah Indonesia. Tim pada halaman ini membantu konsultasi dan pendaftaran untuk area DIY Yogyakarta. Ketersediaan paket tetap bergantung pada jaringan di alamat usaha.
          </p>
          <ul aria-label="Kawasan layanan Indibiz" className="mt-5 flex flex-wrap gap-2">
            {COVERAGE_REGIONS.map((region) => (
              <li key={region.name}>
                <Badge variant="outline" className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 lg:px-4 lg:py-1.5 lg:text-sm">
                  {region.name}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-brand-blue/10 bg-brand-ice/60 p-4 shadow-sm sm:p-6 lg:rounded-3xl lg:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-blue shadow-sm lg:size-11 lg:rounded-2xl">
              <MapPin aria-hidden="true" className="size-4 lg:size-5" />
            </span>
            <h3 className="font-display text-lg leading-snug font-semibold tracking-tight text-brand-navy sm:text-2xl">
              Wilayah layanan DIY Yogyakarta
            </h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
            <span key={area.slug} className="rounded-full border border-white bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm lg:px-4 lg:py-2.5 lg:text-base">
                {area.name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">
            Kirim lokasi usaha melalui WhatsApp agar admin dapat membantu mengecek jaringan.
          </p>
        </div>
      </div>
    </section>
  );
}
