"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Settings2,
  Wifi,
  TrendingUp,
  Headphones,
  Building2,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiberPulse } from "./fiber-pulse";
import { SERVICE_AREAS } from "@/lib/service-areas";

// Pengelompokan Wilayah agar rapi & mudah dicari
const REGION_TABS = [
  {
    id: "all",
    label: "Semua Kota",
  },
  {
    id: "jabodetabek",
    label: "Jabodetabek & Banten",
    slugs: ["jakarta", "bogor", "depok", "tangerang", "bekasi", "serang"],
  },
  {
    id: "jawa",
    label: "Jawa & DIY",
    slugs: ["bandung", "semarang", "solo", "yogyakarta", "surabaya", "malang"],
  },
  {
    id: "sumatra",
    label: "Sumatra",
    slugs: ["medan", "palembang", "pekanbaru", "padang", "batam", "lampung"],
  },
  {
    id: "kalimantan",
    label: "Kalimantan",
    slugs: ["balikpapan", "banjarmasin", "pontianak", "samarinda"],
  },
  {
    id: "sulawesi",
    label: "Sulawesi",
    slugs: ["makassar", "manado", "kendari", "palu"],
  },
  {
    id: "timur",
    label: "Bali, NTB & Papua",
    slugs: ["denpasar", "mataram", "ambon", "jayapura"],
  },
];

const WHY_INDIBIZ = [
  {
    icon: Settings2,
    title: "Solusi Digital Terintegrasi",
    description:
      "Bukan cuma internet — Indibiz menghadirkan solusi digital pendukung operasional, keuangan, SDM, hingga pemasaran dalam satu ekosistem yang saling terhubung.",
  },
  {
    icon: Wifi,
    title: "Internet Bisnis Tanpa FUP",
    description:
      "Nikmati koneksi tanpa batasan Fair Usage Policy dengan rasio bandwidth prioritas agar kualitas jaringan bisnis Anda tetap stabil setiap saat.",
  },
  {
    icon: TrendingUp,
    title: "Dorong Produktivitas Usaha",
    description:
      "Koneksi cepat dan simetris menunjang aktivitas transaksi kasir online, cloud collaboration, CCTV streaming, hingga operasional harian.",
  },
  {
    icon: Headphones,
    title: "Dukungan Layanan Dedicated",
    description:
      "Didukung jaminan SLA dan teknisi lokal Telkom yang siap menangani kendala teknis dengan respon cepat untuk meminimalkan downtime usaha.",
  },
  {
    icon: Building2,
    title: "Melayani Beragam Sektor Usaha",
    description:
      "Dari UMKM dan ruko, kafe, kantor, institusi pendidikan, klinik kesehatan, perhotelan, hingga industri manufaktur.",
  },
];

export function TrustSection() {
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredAreas = React.useMemo(() => {
    if (activeTab === "all") return SERVICE_AREAS;
    const tab = REGION_TABS.find((t) => t.id === activeTab);
    if (!tab || !tab.slugs) return SERVICE_AREAS;
    return SERVICE_AREAS.filter((area) => tab.slugs.includes(area.slug));
  }, [activeTab]);

  return (
    <section className="relative overflow-hidden border-y border-border bg-slate-50/50 py-16 text-foreground sm:py-24">
      {/* Header Section */}
      <div className="mx-auto max-w-3xl px-6 text-center">
  

        {/* Gambar Peta dengan Efek Glow */}
        <div className="relative mx-auto mt-6 max-w-lg">
          <div className="absolute inset-0 -z-10 bg-brand-sky/20 blur-3xl rounded-full" />
          <Image
            src="/peta.png"
            alt="Peta Jangkauan Fiber Optic Indibiz Telkom Indonesia"
            width={600}
            height={280}
            className="h-auto w-full object-contain drop-shadow-md"
          />
        </div>

        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Jaringan Fiber Optic untuk Bisnis di Seluruh Indonesia
        </h2>

        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Tersedia di kota-kota bisnis strategis dari Sabang sampai Merauke. Pilih kota Anda untuk cek paket & promo pasang baru.
        </p>
      </div>

      {/* Area Layanan dengan Tab Filter Regional */}
      <div className="mx-auto mt-10 max-w-4xl px-6">
        {/* Tombol Tab Filter Wilayah */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-border/80 pb-4">
          {REGION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
                activeTab === tab.id
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/25"
                  : "bg-white text-muted-foreground hover:bg-slate-200/70 hover:text-foreground border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daftar Kota (Grid Card Elegan) */}
        <nav
          aria-label="Daftar kota layanan Indibiz"
          className="mt-6"
        >
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {filteredAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/indibiz/${area.slug}`}
                  className="group flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-blue hover:bg-brand-ice/40 hover:text-brand-blue hover:shadow-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-blue/10 group-hover:text-brand-blue">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">{area.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Apa itu & Histori Indibiz */}
      <div className="relative z-10 mx-auto mt-16 max-w-5xl px-6 sm:mt-24">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-border/80 bg-white/90 shadow-sm backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">
                Apa itu Indibiz?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Indibiz adalah ekosistem solusi digital dan internet bisnis berbasis fiber optic dari Telkom Indonesia. Dirancang khusus tanpa batasan FUP, koneksi stabil simetris, dan prioritas layanan untuk mendukung pertumbuhan UMKM hingga korporasi.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-white/90 shadow-sm backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="font-display text-xl font-bold tracking-tight text-brand-navy sm:text-2xl">
                  Histori Indibiz
                </CardTitle>
                <Badge className="bg-brand-blue font-semibold text-white">
                  Sejak 8 Juli 2023
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Diluncurkan pada HUT ke-58 Telkom Indonesia sebagai langkah strategis mempercepat digitalisasi bisnis di Tanah Air dengan menghadirkan infrastruktur jaringan fiber handal dan terintegrasi secara nasional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Animasi Fiber Pulse Divider */}
      <div className="mx-auto mt-14 max-w-5xl px-6 opacity-70 sm:mt-18">
        <FiberPulse className="h-3 w-full" variant="dark" />
      </div>

      {/* Kenapa Harus Indibiz */}
      <div className="relative z-10 mx-auto mt-12 max-w-5xl px-6 sm:mt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Kenapa Memilih Indibiz?
          </h3>
          <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
            Kombinasi konektivitas fiber kecepatan tinggi dan platform digital bisnis dalam satu solusi.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_INDIBIZ.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col items-start rounded-2xl border border-border bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-ice text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h4 className="mt-4 font-semibold text-foreground">{title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}