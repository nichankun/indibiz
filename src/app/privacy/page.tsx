import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan penggunaan data untuk permintaan konsultasi dan paket Indibiz.",
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
        <p className="mt-3 text-sm text-muted-foreground">Terakhir diperbarui: 14 September 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Kontak melalui WhatsApp</h2>
            <p className="mt-2">
              Tombol konsultasi di situs ini hanya membuka WhatsApp dengan draf pesan. Situs
              tidak mengirim pesan tersebut secara otomatis dan tidak membuat lead di dashboard
              hanya karena tombol diklik. Informasi baru diterima tim sales jika Anda memilih
              mengirim pesan melalui WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Tujuan penggunaan</h2>
            <p className="mt-2">
              Pesan yang Anda kirim digunakan tim sales untuk menjawab pertanyaan tentang paket,
              ketersediaan jaringan, dan proses pendaftaran. Data tidak dijual kepada pihak lain.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Pihak dan layanan terkait</h2>
            <p className="mt-2">
              Setelah Anda membuka WhatsApp dan mengirim pesan, isi pesan dan nomor telepon
              diproses oleh WhatsApp serta diterima oleh tim sales yang Anda hubungi. Penggunaan
              WhatsApp mengikuti kebijakan privasi dan ketentuan layanan WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Penyimpanan dan keamanan</h2>
            <p className="mt-2">
              Salinan pesan dan informasi yang Anda kirim dapat tersimpan pada akun WhatsApp
              penerima sesuai pengaturan operasionalnya. Situs ini tidak menyimpan isi draf
              WhatsApp sebelum Anda mengirimkannya. Tidak ada sistem elektronik yang sepenuhnya
              bebas risiko.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Hak Anda</h2>
            <p className="mt-2">
              Anda dapat meminta akses, koreksi, atau penghapusan data dengan menghubungi
              {" "}{siteConfig.operatorName} melalui nomor WhatsApp {siteConfig.salesPhone}.
              Permintaan akan diverifikasi sebelum diproses untuk melindungi pemilik data.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
