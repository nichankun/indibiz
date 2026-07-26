"use client";

import { CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/utils";
import { useState } from "react";
import type { Package } from "@/db/database/schema";

type Props = {
  basicPackages: Package[];
  bisnisPackages: Package[];
};

const REGULER_LABEL = "Internet Only";
const WHATSAPP_NUMBER = "6285181680899";

const ADDON_TABS = [
  REGULER_LABEL,
  "Netmonk HI",
  "OCA Interaction Lite",
  "Pijar Sekolah",
  "OCA Breach Checker",
];

const BASIC_HIGHLIGHTS = [
  "Internet tanpa batasan FUP",
  "Diskon 70% biaya pasang baru",
  "Rasio Kecepatan 1:2",
];

const BISNIS_HIGHLIGHTS = [
  "Internet tanpa batasan FUP",
  "Diskon 70% biaya pasang baru",
  "Rasio Kecepatan 1:1",
];

function buildWhatsAppLink(pkg: Package) {
  const price = pkg.promoPrice ?? pkg.normalPrice;
  const message = `Halo, saya tertarik dengan paket *${pkg.name}* seharga ${formatRupiah(
    price
  )}/bulan. Mohon info lebih lanjut untuk pendaftaran.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function PackagesSection({ basicPackages, bisnisPackages }: Props) {
  const [activeAddon, setActiveAddon] = useState<string>(ADDON_TABS[0]);

  const isReguler = activeAddon === REGULER_LABEL;
  const addonKeywords = ADDON_TABS.filter((addon) => addon !== REGULER_LABEL);

  const filteredBasic = isReguler
    ? basicPackages.filter((pkg) => !addonKeywords.some((addon) => pkg.name.includes(addon)))
    : basicPackages.filter((pkg) => pkg.name.includes(activeAddon));

  const filteredBisnis = isReguler
    ? bisnisPackages.filter((pkg) => !addonKeywords.some((addon) => pkg.name.includes(addon)))
    : bisnisPackages.filter((pkg) => pkg.name.includes(activeAddon));

  const addonBenefits = filteredBasic[0]?.benefits ?? [];

  const basicHighlights = BASIC_HIGHLIGHTS;
  const bisnisHighlights = BISNIS_HIGHLIGHTS;

  const handleSelect = (pkg: Package) => {
    window.open(buildWhatsAppLink(pkg), "_blank");
  };

  return (
    <section id="paket" className="mx-auto max-w-5xl px-6 py-20 sm:py-28 text-foreground">

      {/* Header Utama */}
      <div className="mx-auto max-w-2xl text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-ice px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-blue">
          <Sparkles className="h-3.5 w-3.5" />
          Paket &amp; Harga Promo
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Pilih paket sesuai kebutuhan bisnis Anda
        </h2>
        <p className="mt-3 text-muted-foreground">
          Tanpa kontrak berbelit. Klik paket yang Anda inginkan, tim sales kami
          langsung merespons via WhatsApp.
        </p>
      </div>

      {/* Tab Filter Add-on / Bundling */}
      <div className="mb-12 -mx-6 px-6 sm:mx-0 sm:px-0">
        <Tabs value={activeAddon} onValueChange={setActiveAddon}>
          <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto rounded-full bg-muted/60 p-1.5 sm:w-fit sm:justify-center sm:mx-auto [&::-webkit-scrollbar]:hidden">
            {ADDON_TABS.map((addon) => (
              <TabsTrigger
                key={addon}
                value={addon}
                className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-brand-blue data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                {addon}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-10">

        {/* --- BAGIAN PAKET BASIC --- */}
        <div>
          <div className="flex justify-center mb-5">
            <div className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-6 py-2 rounded-full font-bold text-sm sm:text-base text-center">
              Indibiz Paket Basic{!isReguler && ` + ${activeAddon}`}
            </div>
          </div>

          <div className="mx-auto mb-8 flex w-fit flex-col gap-3 sm:grid sm:w-full sm:max-w-2xl sm:grid-cols-3 sm:gap-3">
            {basicHighlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2.5 sm:text-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white shadow-sm shadow-brand-blue/30 sm:h-8 sm:w-8">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="text-sm font-semibold text-foreground sm:text-[13px]">
                  {highlight}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {filteredBasic.map((pkg) => (
              <Card
                key={pkg.id}
                onClick={() => handleSelect(pkg)}
                className="group relative flex flex-col gap-2.5 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 cursor-pointer border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy)_0%,var(--brand-blue-dark)_45%,var(--brand-blue)_75%,var(--brand-sky)_130%)] shadow-lg shadow-brand-navy/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/40 hover:brightness-110 overflow-hidden"
              >
                <div className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/10" />

                <div className="relative flex items-baseline gap-1.5 sm:gap-2">
                  <div className="flex flex-col items-start shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-semibold text-blue-100 uppercase tracking-wider leading-none">
                      Up to
                    </span>
                    <span className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-none mt-0.5">
                      {pkg.speedMbps}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-blue-100 leading-none mt-0.5">
                      Mbps
                    </span>
                  </div>

                  <div className="h-9 sm:h-10 w-px bg-white/25 shrink-0 self-center" />

                  <div className="flex flex-col items-start min-w-0">
                    {pkg.normalPrice && pkg.promoPrice && pkg.promoPrice < pkg.normalPrice && (
                      <span className="text-[9px] sm:text-[11px] font-semibold text-blue-200/70 line-through leading-none">
                        {formatRupiah(pkg.normalPrice)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-0.5 flex-wrap mt-0.5">
                      <span className="text-base sm:text-xl font-extrabold text-white leading-none whitespace-nowrap">
                        {formatRupiah(pkg.promoPrice ?? pkg.normalPrice)}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-blue-100 uppercase tracking-widest mt-0.5">
                      /Bulan
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(pkg);
                  }}
                  className="relative w-full rounded-lg bg-white/15 py-1.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  Pilih Paket
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* --- BAGIAN PAKET BISNIS --- */}
        <div>
          <div className="flex justify-center mb-5">
            <div className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-6 py-2 rounded-full font-bold text-sm sm:text-base text-center">
              Indibiz Paket Bisnis{!isReguler && ` + ${activeAddon}`}
            </div>
          </div>

          <div className="mx-auto mb-8 flex w-fit flex-col gap-3 sm:grid sm:w-full sm:max-w-2xl sm:grid-cols-3 sm:gap-3">
            {bisnisHighlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2.5 sm:text-center">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white shadow-sm shadow-brand-blue/30 sm:h-8 sm:w-8">
                  <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
                <span className="text-sm font-semibold text-foreground sm:text-[13px]">
                  {highlight}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {filteredBisnis.map((pkg) => (
              <Card
                key={pkg.id}
                onClick={() => handleSelect(pkg)}
                className="group relative flex flex-col gap-2.5 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 cursor-pointer border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy)_0%,var(--brand-blue-dark)_45%,var(--brand-blue)_75%,var(--brand-sky)_130%)] shadow-lg shadow-brand-navy/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/40 hover:brightness-110 overflow-hidden"
              >
                <div className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/10" />

                <div className="relative flex items-baseline gap-1.5 sm:gap-2">
                  <div className="flex flex-col items-start shrink-0">
                    <span className="text-[9px] sm:text-[10px] font-semibold text-blue-100 uppercase tracking-wider leading-none">
                      Up to
                    </span>
                    <span className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-none mt-0.5">
                      {pkg.speedMbps}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-blue-100 leading-none mt-0.5">
                      Mbps
                    </span>
                  </div>

                  <div className="h-9 sm:h-10 w-px bg-white/25 shrink-0 self-center" />

                  <div className="flex flex-1 flex-col items-start min-w-0">
                    {pkg.normalPrice && pkg.promoPrice && pkg.promoPrice < pkg.normalPrice && (
                      <span className="text-[8px] sm:text-[11px] font-semibold text-blue-200/70 line-through leading-none truncate w-full">
                        {formatRupiah(pkg.normalPrice)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-0.5 mt-0.5 w-full">
                      <span className="text-sm sm:text-lg font-extrabold text-white leading-tight break-all">
                        {formatRupiah(pkg.promoPrice ?? pkg.normalPrice)}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-blue-100 uppercase tracking-widest mt-0.5">
                      /Bulan
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(pkg);
                  }}
                  className="relative w-full rounded-lg bg-white/15 py-1.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                >
                  Pilih Paket
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* --- BANNER FITUR ADD-ON --- */}
        {!isReguler && (
          <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-brand-navy px-5 py-6 text-white shadow-xl md:flex-row md:items-center md:justify-between md:gap-6 md:px-8">
            <div className="text-xl md:text-2xl font-black tracking-tight text-center md:text-left whitespace-nowrap">
              {activeAddon}
            </div>
            <div className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-6 md:gap-y-3">
              {addonBenefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-sky shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-200 leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Syarat dan Ketentuan */}
      <div className="mt-8 rounded-xl border border-border bg-muted/20 p-6 text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground mb-3">Syarat dan Ketentuan Berlangganan:</h4>
        <ol className="list-decimal pl-4 space-y-1.5">
          <li>Biaya Pasang Baru (PSB) Rp150.000 dan dibayarkan di awal saat instalasi pemasangan di lokasi Anda.</li>
          <li>Harga belum termasuk PPN 11%.</li>
          <li>Promo ini berlaku selama periode aktif.</li>
        </ol>
      </div>
    </section>
  );
}