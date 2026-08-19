import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceArea, SERVICE_AREAS } from "@/lib/service-areas";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageProps = {
  params: Promise<{ city: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_AREAS.map(({ slug }) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const area = getServiceArea(city);

  if (!area) return {};

  const title = `Pasang Indibiz ${area.name} | Internet Fiber Bisnis`;
  const description = `Cek ketersediaan dan daftar paket Indibiz untuk kantor, toko, dan UMKM di ${area.areas}. Konsultasi dengan tim sales Jabodetabek.`;
  const url = absoluteUrl(`/indibiz/${area.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function ServiceAreaPage({ params }: PageProps) {
  const { city } = await params;
  const area = getServiceArea(city);

  if (!area) notFound();

  const title = `Pasang Indibiz ${area.name} untuk Bisnis`;
  const description = `Pendaftaran dan pengecekan ketersediaan jaringan Indibiz untuk bisnis di ${area.areas}.`;
  const url = absoluteUrl(`/indibiz/${area.slug}`);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    url,
    serviceType: "Internet fiber untuk bisnis",
    areaServed: {
      "@type": "AdministrativeArea",
      name: area.name,
      containedInPlace: area.region,
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.operatorName,
      url: siteConfig.url,
      telephone: siteConfig.salesPhone,
    },
  };

  return (
    <main className="text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <section className="bg-brand-navy-deep px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-sky">
            Pendaftaran Indibiz Jabodetabek
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">
            Internet fiber untuk kantor, toko, dan UMKM di {area.areas}. Cek dulu
            ketersediaan jaringan di alamat pemasangan Anda tanpa biaya.
          </p>
          <Link
            href="/#cek-jangkauan"
            className="mt-8 inline-flex rounded-full bg-brand-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-blue-dark"
          >
            Cek Jangkauan Indibiz {area.name}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy">
          Internet bisnis di {area.name} yang disesuaikan dengan kebutuhan usaha
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h3 className="text-lg font-semibold">Paket untuk operasional usaha</h3>
            <p className="mt-2 text-muted-foreground">
              Pilih kecepatan dan bundling yang sesuai untuk transaksi digital,
              cloud, CCTV, video conference, hingga kebutuhan tim harian.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h3 className="text-lg font-semibold">Pengecekan alamat terlebih dahulu</h3>
            <p className="mt-2 text-muted-foreground">
              Ketersediaan dan jadwal pemasangan tetap dikonfirmasi berdasarkan
              alamat lengkap serta kondisi jaringan di lokasi Anda.
            </p>
          </div>
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          Melayani {area.areas}. Untuk area Jabodetabek lain, lihat daftar area
          layanan di halaman utama atau hubungi tim kami.
        </p>
      </section>
    </main>
  );
}
