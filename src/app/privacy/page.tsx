import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan pengumpulan dan penggunaan data pada layanan pengecekan jangkauan serta pendaftaran Indibiz.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-16 text-foreground sm:py-24">
        <Link className="text-sm font-medium text-brand-blue hover:underline" href="/">
          &larr; Kembali ke beranda
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Kebijakan Privasi
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Terakhir diperbarui: 27 Agustus 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Data yang dikumpulkan</h2>
            <p className="mt-2">
              Saat Anda mengirim pendaftaran atau meminta pengecekan jangkauan, kami dapat
              menerima nama, nomor WhatsApp, email, alamat pemasangan, paket yang diminati,
              serta informasi sumber kunjungan seperti parameter kampanye.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Tujuan penggunaan</h2>
            <p className="mt-2">
              Data digunakan untuk memeriksa ketersediaan jaringan, menindaklanjuti permintaan,
              membantu proses pendaftaran, mencegah penyalahgunaan formulir, dan mengevaluasi
              efektivitas layanan. Data tidak dijual kepada pihak lain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Pihak dan layanan terkait</h2>
            <p className="mt-2">
              Informasi dapat diproses oleh tim yang menangani pendaftaran dan penyedia layanan
              teknis yang diperlukan, termasuk hosting, basis data, atau WhatsApp.
              Masing-masing layanan dapat menerapkan kebijakan privasinya sendiri.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Penyimpanan dan keamanan</h2>
            <p className="mt-2">
              Data disimpan selama masih diperlukan untuk menangani permintaan, memenuhi
              kewajiban operasional, dan menyelesaikan sengketa yang relevan. Kami menggunakan
              pembatasan akses dan perlindungan teknis yang wajar, tetapi tidak ada sistem
              elektronik yang sepenuhnya bebas risiko.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Hak Anda</h2>
            <p className="mt-2">
              Anda dapat meminta koreksi atau penghapusan data yang tidak lagi diperlukan dengan
              menghubungi {siteConfig.operatorName} melalui nomor {siteConfig.salesPhone}.
              Permintaan akan diverifikasi sebelum diproses untuk melindungi pemilik data.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
