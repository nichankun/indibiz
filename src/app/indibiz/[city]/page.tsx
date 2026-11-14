import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ShieldCheck,
  Headphones,
  ArrowRight,
  MapPin,
  Zap,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import {
  getServiceArea,
  LEGACY_SERVICE_AREA_SLUGS,
  SERVICE_AREAS,
} from "@/lib/service-areas";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { CityFaq } from "@/components/landing/faq";
import { SiteFooter } from "@/components/landing/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { FiberPulse } from "@/components/landing/fiber-pulse";

type PageProps = {
  params: Promise<{ city: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...SERVICE_AREAS.map(({ slug }) => ({ city: slug })),
    ...LEGACY_SERVICE_AREA_SLUGS.map((city) => ({ city })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const area = getServiceArea(city);

  if (!area) return {};

  const title = `Pasang Indibiz ${area.name}: Paket & Cek Jangkauan`;
  const description = `Cek paket dan jangkauan Indibiz di ${area.name}. Dapatkan bantuan pengecekan area serta pendaftaran internet bisnis untuk kantor, toko, dan UMKM.`;
  const url = absoluteUrl(`/indibiz/${area.slug}`);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "id_ID",
      type: "website",
      images: [
        {
          url: absoluteUrl("/og-image.png"),
          width: 1200,
          height: 630,
          alt: `Pasang Indibiz ${area.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/og-image.png")],
    },
  };
}

export default async function ServiceAreaPage({ params }: PageProps) {
  const { city } = await params;
  const area = getServiceArea(city);

  if (!area) {
    if (LEGACY_SERVICE_AREA_SLUGS.some((slug) => slug === city)) {
      permanentRedirect("/");
    }
    notFound();
  }

  const title = `Pasang Indibiz ${area.name} untuk Bisnis & Kantor`;
  const description = `Pendaftaran dan pengecekan ketersediaan jaringan Indibiz untuk bisnis di wilayah ${area.areas}.`;
  const url = absoluteUrl(`/indibiz/${area.slug}`);

  // Filter kota terdekat di region yang sama untuk internal linking
  const nearbyAreas = SERVICE_AREAS.filter(
    (a) => a.slug !== area.slug && a.region === area.region
  ).slice(0, 8);

  const cleanPhone = siteConfig.salesPhone.replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Halo Tim Sales Indibiz, saya ingin tanya ketersediaan jaringan & promo pasang baru untuk wilayah ${area.name}.`
  )}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.operatorName,
        url: siteConfig.url,
        logo: absoluteUrl("/logo.png"),
        telephone: siteConfig.salesPhone,
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Pengecekan jangkauan dan pendaftaran Indibiz ${area.name}`,
        serviceType: "Bantuan pendaftaran internet fiber untuk bisnis",
        description,
        url,
        areaServed: {
          "@type": "AdministrativeArea",
          name: area.name,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: area.region,
          },
        },
        provider: {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `Indibiz ${area.name}`,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <main className="text-foreground">
      <JsonLd data={serviceJsonLd} />

      {/* ================= HERO SECTION ================= */}
      <section className="relative isolate overflow-hidden bg-slate-950 px-6 py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-blue/20 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-sky/30 bg-brand-sky/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-sky">
            <Sparkles className="h-3.5 w-3.5" />
            Pengecekan Jangkauan • Area {area.name}
          </span>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Internet fiber optic berkecepatan tinggi tanpa batasan FUP untuk menunjang kelancaran operasional kantor, toko, ruko, dan UMKM di wilayah{" "}
            <span className="font-semibold text-white">{area.name}</span>.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-brand-blue px-7 py-6 text-base font-semibold text-white shadow-lg shadow-brand-blue/30 transition-all hover:bg-brand-blue-dark hover:shadow-xl"
            >
              <Link href="/#cek-jangkauan">
                Cek Jangkauan Alamat Anda
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-[#25D366]/60 bg-[#25D366] px-7 py-6 text-base font-semibold text-white shadow-lg shadow-[#128C7E]/25 transition-all hover:bg-[#128C7E] hover:text-white"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat Sales {area.name}
              </a>
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 h-4 opacity-75">
          <FiberPulse className="h-full w-full" variant="light" />
        </div>
      </section>
      {/* ================= TRUST HIGHLIGHTS BAR ================= */}
      <section className="border-b border-border bg-card py-6">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 sm:grid-cols-3">
          <div className="flex items-center gap-3.5 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-ice text-brand-blue">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Pilihan Rasio 1:1 & 1:2</h4>
              <p className="text-xs text-muted-foreground">Sesuaikan paket dengan kebutuhan usaha</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-ice text-brand-blue">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Tanpa Batas FUP</h4>
              <p className="text-xs text-muted-foreground">Bebas kuota pemakaian harian & bulanan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-border/70 bg-muted/20 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-ice text-brand-blue">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Teknisi Area {area.name}</h4>
              <p className="text-xs text-muted-foreground">Bantuan pengecekan hingga pendaftaran</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ALUR CARA PASANG ================= */}
      <section className="border-b border-border bg-slate-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
              Alur Pemasangan Indibiz di {area.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Tim pendaftaran membantu pengecekan data, lalu instalasi mengikuti proses teknis Telkom.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-2xs">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-ice font-display text-lg font-bold text-brand-blue">
                1
              </span>
              <h3 className="mt-4 font-semibold text-foreground">Cek Jaringan & Alamat</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Kirimkan alamat lengkap lokasi usaha Anda untuk memastikan jarak titik ODP terdekat.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-2xs">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-ice font-display text-lg font-bold text-brand-blue">
                2
              </span>
              <h3 className="mt-4 font-semibold text-foreground">Verifikasi & Pilih Paket</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Pilih kecepatan yang diinginkan dan lengkapi data registrasi sederhana (KTP penanggung jawab).
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-2xs">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-ice font-display text-lg font-bold text-brand-blue">
                3
              </span>
              <h3 className="mt-4 font-semibold text-foreground">Instalasi Teknisi</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Teknisi Telkom datang langsung ke lokasi untuk penarikan kabel fiber dan aktivasi internet.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/#paket"
              className="inline-flex items-center text-sm font-semibold text-brand-blue transition-colors hover:text-brand-blue-dark hover:underline"
            >
              Lihat katalog lengkap pilihan paket & harga di halaman utama &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CAKUPAN WILAYAH & FAQ ================= */}
      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        {/* Box Cakupan Wilayah */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Wilayah Layanan di {area.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Mencakup: <span className="font-medium text-foreground">{area.areas}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Komponen FAQ Kota */}
        <CityFaq cityName={area.name} areas={area.areas} />

        {/* Internal Linking Silo (Kota Sekitar) */}
        {nearbyAreas.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Area Layanan Lainnya di {area.region}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {nearbyAreas.map((nearby) => (
                <Link
                  key={nearby.slug}
                  href={`/indibiz/${nearby.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-brand-blue hover:text-brand-blue"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  Indibiz {nearby.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
