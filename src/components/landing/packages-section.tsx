"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/utils";
import { createSalesWhatsAppUrl } from "@/lib/whatsapp-link";
import type { Package } from "@/db/database/schema";

type Props = {
  basicPackages: Package[];
  bisnisPackages: Package[];
};

type PackageGroupProps = {
  title: string;
  ratio: string;
  packages: Package[];
};

const REGULAR_LABEL = "Internet Only";
const ADDON_LABELS = [
  REGULAR_LABEL,
  "Netmonk HI",
  "OCA Interaction Lite",
  "Pijar Sekolah",
  "OCA Breach Checker",
];

const BASE_BENEFITS = [
  "Internet tanpa batas FUP",
  "Diskon 70% biaya pasang baru",
];

function packagesForAddon(packages: Package[], addon: string) {
  const bundledLabels = ADDON_LABELS.filter((label) => label !== REGULAR_LABEL);

  return addon === REGULAR_LABEL
    ? packages.filter((pkg) => !bundledLabels.some((label) => pkg.name.includes(label)))
    : packages.filter((pkg) => pkg.name.includes(addon));
}

function PackageCard({ pkg }: { pkg: Package }) {
  const hasDiscount =
    pkg.promoPrice !== null && Number(pkg.promoPrice) < Number(pkg.normalPrice);
  const formattedPrice = formatRupiah(pkg.promoPrice ?? pkg.normalPrice);

  return (
    <Card className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-blue-700 bg-gradient-to-br from-brand-blue to-blue-700 p-0 text-white shadow-md transition-shadow hover:shadow-lg sm:rounded-2xl lg:rounded-3xl">
      <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4 lg:p-5">
        <div className="flex min-h-3 items-center justify-between gap-1 sm:min-h-5">
          <span className="text-[9px] font-semibold uppercase tracking-wide text-blue-100 sm:text-[10px]">
            Up to
          </span>
          {pkg.badge && (
            <span className="max-w-[70%] truncate rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-medium leading-none text-white sm:px-2 sm:text-[10px]">
              {pkg.badge}
            </span>
          )}
        </div>

        <div className="mt-1 grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center gap-1.5 sm:mt-2 sm:gap-3">
          <div className="min-w-0">
            <p className="font-display text-2xl font-bold leading-none tracking-tight sm:text-4xl lg:text-5xl">
              {pkg.speedMbps}
            </p>
            <p className="mt-0.5 text-[9px] font-medium text-blue-100 sm:text-xs">
              Mbps
            </p>
          </div>

          <div className="min-w-0 border-l border-white/25 pl-1.5 sm:pl-3">
            {hasDiscount && (
              <p className="truncate text-[9px] leading-tight text-blue-100 line-through sm:text-[10px]">
                {formatRupiah(pkg.normalPrice)}
              </p>
            )}
            <p className="truncate text-xs font-bold leading-tight tracking-tight sm:text-base lg:text-lg">
              {formattedPrice}
            </p>
            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-blue-100 sm:text-[10px]">
              / bulan
            </p>
          </div>
        </div>
      </div>

      <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
        <Button
          asChild
          className="h-10 w-full rounded-lg border border-[#25D366]/70 bg-[#25D366] px-2 text-[11px] font-semibold text-white shadow-sm shadow-[#128C7E]/20 hover:bg-[#128C7E] sm:h-9 sm:rounded-xl sm:text-xs lg:h-11 lg:text-sm"
        >
          <a
            href={createSalesWhatsAppUrl(
              `Halo admin Indibiz, saya tertarik dengan paket ${pkg.name}. Mohon info ketersediaan di wilayah DIY Yogyakarta.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Pilih paket
          </a>
        </Button>
      </div>
    </Card>
  );
}

function PackageGroup({ title, ratio, packages }: PackageGroupProps) {
  if (packages.length === 0) return null;

  const benefits = [
    ...BASE_BENEFITS,
    `Rasio Kecepatan ${ratio}`,
    "PPN 11% untuk pelanggan PKP",
  ];

  return (
    <section aria-label={title} className="mt-8 first:mt-7 sm:mt-14 lg:mt-16">
      <div className="mx-auto mb-4 max-w-4xl text-center sm:mb-7 lg:mb-9">
        <h3 className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-brand-blue sm:px-5 sm:text-base lg:px-6 lg:py-2.5 lg:text-lg">
          {title}
        </h3>

        <ul className="mx-auto mt-3 grid max-w-3xl gap-2 text-left sm:mt-5 sm:grid-cols-2 sm:gap-3 lg:max-w-5xl lg:grid-cols-4">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex min-w-0 items-center gap-2 text-xs leading-5 text-slate-700 sm:text-sm lg:text-base"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand-blue">
                <Check aria-hidden="true" className="h-3 w-3" />
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}

export function PackagesSection({ basicPackages, bisnisPackages }: Props) {
  const addonOptions = ADDON_LABELS.filter(
    (addon) =>
      packagesForAddon(basicPackages, addon).length +
        packagesForAddon(bisnisPackages, addon).length >
      0,
  );
  const [activeAddon, setActiveAddon] = useState(addonOptions[0] ?? REGULAR_LABEL);
  const visibleBasicPackages = packagesForAddon(basicPackages, activeAddon);
  const visibleBisnisPackages = packagesForAddon(bisnisPackages, activeAddon);
  const hasVisiblePackages =
    visibleBasicPackages.length > 0 || visibleBisnisPackages.length > 0;

  return (
    <section id="paket" className="bg-slate-50 px-3 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[1.7rem] leading-[1.22] font-semibold tracking-[-0.025em] text-brand-navy sm:text-4xl">
            Pilih paket yang sesuai untuk usaha Anda
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-6 text-slate-600 sm:text-base sm:leading-7">
            Bandingkan pilihan paket dan layanan tambahan. Admin sales siap membantu
            mengecek ketersediaan.
          </p>
        </div>

        {addonOptions.length > 0 && (
          <div className="mt-7 flex w-full justify-center sm:mt-8">
            <Tabs
              className="w-full sm:w-auto lg:inline-flex lg:w-fit"
              value={activeAddon}
              onValueChange={setActiveAddon}
            >
              <TabsList className="group-data-horizontal/tabs:!h-auto grid w-full max-w-3xl grid-cols-2 items-stretch justify-center gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm sm:group-data-horizontal/tabs:!h-8 sm:flex sm:w-auto sm:max-w-none lg:group-data-horizontal/tabs:!h-11 lg:w-fit lg:max-w-full lg:gap-1.5 lg:rounded-full lg:border lg:border-slate-200 lg:p-1.5">
                {addonOptions.map((addon, index) => (
                  <TabsTrigger
                    key={addon}
                    value={addon}
                    className={`${addonOptions.length % 2 === 1 && index === addonOptions.length - 1 ? "col-span-2" : "col-span-1"} min-h-10 whitespace-normal rounded-xl px-2 py-2 text-center text-xs leading-tight data-[state=active]:bg-brand-blue data-[state=active]:text-white sm:col-span-1 sm:min-h-8 sm:whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm lg:flex-none lg:min-h-8 lg:rounded-full lg:px-5 lg:py-1 lg:text-[0.9375rem] lg:font-medium`}
                  >
                    {addon}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {hasVisiblePackages ? (
          <>
            <PackageGroup
              title="Indibiz Paket Basic"
              ratio="1:2"
              packages={visibleBasicPackages}
            />
            <PackageGroup
              title="Indibiz Paket Bisnis"
              ratio="1:1"
              packages={visibleBisnisPackages}
            />
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <p className="font-medium text-brand-navy">Paket sedang diperbarui.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hubungi admin untuk menanyakan pilihan yang tersedia.
            </p>
            <div className="mt-4">
              <Button
                asChild
                className="rounded-full bg-[#25D366] text-white shadow-sm shadow-[#128C7E]/20 hover:bg-[#128C7E]"
              >
                <a
                  href={createSalesWhatsAppUrl(
                    "Halo admin Indibiz, saya ingin menanyakan paket internet bisnis yang tersedia di DIY Yogyakarta.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanya admin
                </a>
              </Button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          Harga belum termasuk PPN 11% untuk pelanggan berstatus PKP. Harga dan
          promo dapat berubah; konfirmasi biaya akhir serta ketersediaan kepada
          admin sebelum mendaftar.
        </p>
      </div>
    </section>
  );
}
