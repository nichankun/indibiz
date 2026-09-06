import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Headphones,
  MapPin,
  Settings2,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiberPulse } from "./fiber-pulse";
import { NATIONAL_ISLANDS, SERVICE_AREAS } from "@/lib/service-areas";

const WHY_INDIBIZ = [
  {
    icon: Settings2,
    title: "Solusi Digital Terintegrasi",
    description:
      "Bukan cuma internet — Indibiz menghadirkan solusi digital pendukung operasional, keuangan, SDM, hingga pemasaran dalam satu ekosistem.",
  },
  {
    icon: Wifi,
    title: "Internet Bisnis Tanpa FUP",
    description:
      "Nikmati koneksi tanpa batasan Fair Usage Policy dengan pilihan layanan yang dapat disesuaikan untuk kebutuhan usaha.",
  },
  {
    icon: TrendingUp,
    title: "Pilihan Rasio Sesuai Kebutuhan",
    description:
      "Tersedia pilihan rasio kecepatan mulai 1:2 hingga 1:1 untuk menyesuaikan kebutuhan unduh dan unggah operasional bisnis.",
  },
  {
    icon: Headphones,
    title: "Dukungan Pelanggan 24/7",
    description:
      "Layanan bantuan pelanggan tersedia untuk mendukung pengecekan dan penanganan kebutuhan konektivitas bisnis.",
  },
  {
    icon: Building2,
    title: "Melayani Beragam Sektor Usaha",
    description:
      "Dari UMKM dan ruko, kafe, kantor, institusi pendidikan, klinik kesehatan, perhotelan, hingga industri manufaktur.",
  },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-slate-50/50 py-16 text-foreground sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="relative mx-auto mt-2 max-w-lg">
          <div className="absolute inset-0 -z-10 rounded-full bg-brand-sky/20 blur-3xl" />
          <Image
            src="/peta.png"
            alt="Peta cakupan jaringan fiber Indibiz di Indonesia"
            width={600}
            height={280}
            className="h-auto w-full object-contain drop-shadow-md"
          />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
          Cakupan nasional, fokus Jabodetabek
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Indibiz untuk bisnis di seluruh Indonesia
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Ekosistem Indibiz tersedia di berbagai wilayah Indonesia. Untuk
          pendaftaran dan pengecekan lokasi yang lebih terarah, tim kami fokus
          membantu bisnis di kawasan Jabodetabek.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-5xl px-6">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
                Penanda cakupan nasional
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
                Cakupan wilayah kepulauan Indonesia
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Enam kawasan ini menunjukkan jangkauan ekosistem Indibiz.
                Ketersediaan paket tetap perlu dikonfirmasi berdasarkan alamat
                usaha dan jaringan di lokasi.
              </p>
            </div>
            <Badge className="w-fit bg-brand-blue font-semibold text-white">
              {NATIONAL_ISLANDS.length} kawasan
            </Badge>
          </div>

          <ul
            aria-label="Kawasan cakupan Indibiz di Indonesia"
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {NATIONAL_ISLANDS.map((island) => (
              <li
                key={island.name}
                className="rounded-xl border border-border/70 bg-slate-50 px-3.5 py-3 text-sm text-slate-700"
              >
                <span className="flex items-center gap-2 font-semibold text-brand-navy">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-blue" />
                  {island.name}
                </span>
                <span className="mt-1 block pl-5 text-xs text-muted-foreground">
                  {island.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl px-6">
        <div className="rounded-2xl bg-brand-navy p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-sky">
                Area layanan prioritas
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Fokus pendaftaran Jabodetabek
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100/80">
                Cek jangkauan, pilih paket, dan konsultasikan kebutuhan internet
                bisnis Anda untuk Jakarta, Bogor, Depok, Tangerang, dan Bekasi.
              </p>
            </div>
            <a
              href="#cek-jangkauan"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-ice"
            >
              Cek lokasi <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <nav aria-label="Area layanan prioritas Jabodetabek" className="mt-6">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SERVICE_AREAS.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/indibiz/${area.slug}`}
                    className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm font-medium text-white transition-colors hover:border-brand-sky/60 hover:bg-white/15"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-brand-sky" />
                    <span>{area.name}</span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

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
                Indibiz adalah ekosistem solusi digital dan internet bisnis
                berbasis fiber optic dari Telkom Indonesia. Layanannya
                menawarkan koneksi tanpa batasan FUP dan pilihan rasio
                kecepatan mulai 1:2 hingga 1:1 untuk mendukung kebutuhan usaha.
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
                Diluncurkan pada HUT ke-58 Telkom Indonesia sebagai langkah
                strategis mempercepat digitalisasi bisnis di Tanah Air dengan
                menghadirkan infrastruktur jaringan fiber yang terintegrasi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-5xl px-6 opacity-70 sm:mt-18">
        <FiberPulse className="h-3 w-full" variant="dark" />
      </div>

      <div className="relative z-10 mx-auto mt-12 max-w-5xl px-6 sm:mt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Kenapa Memilih Indibiz?
          </h3>
          <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
            Kombinasi konektivitas fiber kecepatan tinggi dan platform digital
            bisnis dalam satu solusi.
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
