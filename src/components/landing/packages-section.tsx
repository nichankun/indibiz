"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { RegistrationDialog } from "./registration-dialog";
import type { Package } from "@/db/database/schema";

type Props = {
  basicPackages: Package[];
  bisnisPackages: Package[];
};

const ADDON_TABS = [
  "Netmonk HI",
  "OCA Interaction Lite",
  "Pijar Sekolah",
  "OCA Breach Checker",
];

export function PackagesSection({ basicPackages, bisnisPackages }: Props) {
  const [activeAddon, setActiveAddon] = useState<string>(ADDON_TABS[0]);
  const [selected, setSelected] = useState<Package | null>(null);

  // Filter paket berdasarkan addon yang sedang aktif
  const filteredBasic = basicPackages.filter((pkg) => pkg.name.includes(activeAddon));
  const filteredBisnis = bisnisPackages.filter((pkg) => pkg.name.includes(activeAddon));

  // Ambil fitur dari salah satu paket untuk ditampilkan di banner bawah
  const addonBenefits = filteredBasic[0]?.benefits ?? [];

  return (
    <section id="paket" className="mx-auto max-w-5xl px-6 py-20 sm:py-28 text-foreground">
      
      {/* Header Utama */}
      <div className="mx-auto max-w-2xl text-center mb-10">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          Paket &amp; Harga Promo
        </span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Pilih Bundling Kebutuhan Anda
        </h2>
        <p className="mt-3 text-muted-foreground">
          Klik pada kotak paket yang Anda inginkan untuk mengisi form pendaftaran.
        </p>
      </div>

      {/* Tab Filter Add-on / Bundling */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {ADDON_TABS.map((addon) => (
          <button
            key={addon}
            onClick={() => setActiveAddon(addon)}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeAddon === addon
                ? "border-primary bg-primary text-primary-foreground shadow-md"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {addon}
          </button>
        ))}
      </div>

      <div className="space-y-12 rounded-3xl border border-border bg-muted/10 p-6 sm:p-10">
        
        {/* --- BAGIAN PAKET BASIC --- */}
        <div>
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 text-primary border border-primary/20 px-6 py-2 rounded-full font-bold text-sm sm:text-base">
              Indibiz Paket Basic + {activeAddon}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredBasic.map((pkg) => (
              <Card
                key={pkg.id}
                onClick={() => setSelected(pkg)}
                className="group relative flex flex-row items-center justify-between gap-2 rounded-2xl p-3 sm:p-4 cursor-pointer border border-white/10 bg-[linear-gradient(135deg,#1e3a8a_0%,#1d4ed8_45%,#2563eb_75%,#3b82f6_100%)] shadow-lg shadow-blue-950/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/50 hover:brightness-110 overflow-hidden"
              >
                {/* Efek pita jika populer */}
                {pkg.badge && (
                  <div className="absolute top-0 right-0 bg-primary px-2.5 py-1 rounded-bl-lg text-[10px] font-black text-primary-foreground uppercase tracking-wide shadow-sm">
                    Terlaris
                  </div>
                )}

                {/* Glossy highlight, top-left glow like the brochure cards */}
                <div className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/10" />

                <div className="relative flex flex-col items-start shrink-0">
                  <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider leading-none mb-1">
                    Up to
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
                      {pkg.speedMbps}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-100 leading-none mt-0.5">Mbps</span>
                </div>

                <div className="relative h-10 w-px bg-white/25 shrink-0" />

                <div className="relative flex flex-col items-end text-right min-w-0">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] font-bold text-blue-100 self-start mt-1">Rp</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white leading-none truncate">
                      {formatRupiah(pkg.promoPrice ?? pkg.normalPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-widest mt-0.5">
                    /Bulan
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* --- BAGIAN PAKET BISNIS --- */}
        <div>
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 text-primary border border-primary/20 px-6 py-2 rounded-full font-bold text-sm sm:text-base">
              Indibiz Paket Bisnis + {activeAddon}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredBisnis.map((pkg) => (
              <Card
                key={pkg.id}
                onClick={() => setSelected(pkg)}
                className="group relative flex flex-row items-center justify-between gap-2 rounded-2xl p-3 sm:p-4 cursor-pointer border border-white/10 bg-[linear-gradient(135deg,#1e3a8a_0%,#1d4ed8_45%,#2563eb_75%,#3b82f6_100%)] shadow-lg shadow-blue-950/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/50 hover:brightness-110 overflow-hidden"
              >
                {pkg.badge && (
                  <div className="absolute top-0 right-0 bg-primary px-2.5 py-1 rounded-bl-lg text-[10px] font-black text-primary-foreground uppercase tracking-wide shadow-sm">
                    Terlaris
                  </div>
                )}

                <div className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/10" />

                <div className="relative flex flex-col items-start shrink-0">
                  <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider leading-none mb-1">
                    Up to
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
                      {pkg.speedMbps}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-100 leading-none mt-0.5">Mbps</span>
                </div>

                <div className="relative h-10 w-px bg-white/25 shrink-0" />

                <div className="relative flex flex-col items-end text-right min-w-0">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[10px] font-bold text-blue-100 self-start mt-1">Rp</span>
                    <span className="text-lg sm:text-xl font-extrabold text-white leading-none truncate">
                      {formatRupiah(pkg.promoPrice ?? pkg.normalPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-widest mt-0.5">
                    /Bulan
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* --- BANNER FITUR ADD-ON (Seperti di brosur) --- */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-slate-900 px-8 py-6 text-white shadow-xl">
          <div className="text-xl md:text-2xl font-black tracking-tight text-center md:text-left whitespace-nowrap">
            {activeAddon}
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
            {addonBenefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-sky-400 shrink-0" />
                <span className="text-sm font-medium text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Syarat dan Ketentuan */}
      <div className="mt-8 rounded-xl border border-border bg-muted/20 p-6 text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground mb-3">Syarat dan Ketentuan Berlangganan:</h4>
        <ol className="list-decimal pl-4 space-y-1.5">
          <li>Biaya Pasang Baru (PSB) Rp150.000 dan dibayarkan di awal saat instalasi pemasangan di lokasi Anda.</li>
          <li>Harga belum termasuk PPN 11%.</li>
          <li>Promo ini berlaku sampai 30 Juni 2026.</li>
        </ol>
      </div>

      {selected && (
        <RegistrationDialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
          packageId={selected.id}
          packageName={selected.name}
        />
      )}
    </section>
  );
}