"use client";

import { CircleHelp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Apa itu Indibiz?",
    answer:
      "Indibiz adalah layanan internet fiber optic dari Telkom Indonesia yang dirancang khusus untuk kebutuhan bisnis — mulai dari UMKM, toko, kantor, sekolah, hingga korporasi. Berbeda dari internet rumahan, Indibiz mengutamakan stabilitas koneksi, prioritas trafik, dan dukungan teknis untuk menunjang operasional usaha.",
  },
  {
    question: "Paket apa saja yang ditawarkan Indibiz?",
    answer:
      "Tersedia dua kategori utama: Paket Basic dengan rasio kecepatan download:upload 1:2, dan Paket Bisnis dengan rasio 1:1 (simetris). Selain itu tersedia juga paket bundling dengan layanan tambahan seperti Netmonk HI, OCA Interaction Lite, Pijar Sekolah, dan OCA Breach Checker sesuai kebutuhan usaha Anda.",
  },
  {
    question: "Berapa kecepatan internet yang tersedia?",
    answer:
      "Kecepatan tersedia mulai dari 50 Mbps hingga 300 Mbps, tergantung paket dan kategori yang dipilih. Semua paket menggunakan jaringan fiber optic tanpa batasan FUP (Fair Usage Policy), sehingga kecepatan tetap stabil meski pemakaian tinggi.",
  },
  {
    question: "Apa bedanya rasio 1:1 dan 1:2?",
    answer:
      "Rasio 1:1 (paket Bisnis) berarti kecepatan upload sama dengan download — cocok untuk usaha yang sering mengunggah data besar, CCTV online, cloud backup, atau video conference. Rasio 1:2 (paket Basic) memiliki kecepatan upload lebih rendah dari download, lebih ekonomis dan cocok untuk kebutuhan browsing serta operasional standar.",
  },
  {
    question: "Dokumen apa saja yang diperlukan untuk pasang Indibiz?",
    answer:
      "Umumnya cukup KTP pemilik/penanggung jawab usaha dan alamat lokasi pemasangan yang jelas. Untuk badan usaha, dokumen legalitas seperti NIB atau SIUP dapat mempercepat proses, namun bukan syarat mutlak untuk pemasangan awal.",
  },
  {
    question: "Apa saja layanan internet bisnis yang tersedia di Indibiz?",
    answer:
      "Selain internet murni (Internet Only), Indibiz menawarkan bundling dengan Netmonk HI (monitoring jaringan), OCA Interaction Lite (solusi komunikasi pelanggan), Pijar Sekolah (platform pembelajaran digital untuk institusi pendidikan), dan OCA Breach Checker (keamanan data digital).",
  },
  {
    question: "Siapa saja yang bisa menggunakan Indibiz?",
    answer:
      "Indibiz terbuka untuk semua jenis usaha — UMKM, toko dan kafe, kantor, sekolah, hotel, RT/RW Net, hingga perusahaan skala besar yang membutuhkan koneksi internet stabil dengan prioritas layanan bisnis.",
  },
  {
    question: "Apa syarat dan ketentuan berlangganan?",
    answer:
      "Biaya pasang baru (PSB) dikenakan di awal saat instalasi, harga paket belum termasuk PPN 11%, dan promo yang berlaku mengikuti periode aktif yang ditentukan. Detail lengkap dapat dilihat pada bagian syarat & ketentuan di halaman paket.",
  },
  {
    question: "Apa keunggulan Indibiz dibandingkan layanan internet biasa?",
    answer:
      "Indibiz didukung jaringan fiber optic nasional Telkom, trafik yang diprioritaskan dibanding pelanggan residensial, opsi rasio kecepatan simetris untuk kebutuhan upload tinggi, serta dukungan teknis yang responsif untuk meminimalkan downtime bisnis.",
  },
  {
    question: "Berapa harga paket Indibiz?",
    answer:
      "Harga bervariasi mulai dari paket 50 Mbps hingga 300 Mbps, tergantung kategori Basic atau Bisnis serta add-on yang dipilih. Lihat rincian harga terbaru dan promo yang sedang berlaku pada bagian Paket & Harga di halaman ini.",
  },
  {
    question: "Apakah ada paket promo Indibiz?",
    answer:
      "Ya, Indibiz secara berkala menghadirkan promo seperti diskon biaya pasang baru hingga 70%. Info promo yang sedang aktif bisa dilihat langsung di bagian Paket & Harga Promo pada halaman ini.",
  },
  {
    question: "Apakah Indibiz menyediakan paket khusus untuk UMKM?",
    answer:
      "Ya. Paket Basic dirancang agar lebih terjangkau untuk usaha mikro dan kecil, sementara paket Bisnis dengan rasio 1:1 lebih cocok untuk UMKM yang mengandalkan upload data seperti live jualan online, sistem kasir cloud, atau CCTV.",
  },
  {
    question: "Bagaimana cara daftar layanan Indibiz?",
    answer:
      "Cukup pilih paket yang sesuai kebutuhan pada bagian Paket & Harga, lalu klik untuk menghubungi kami langsung melalui WhatsApp. Tim kami akan membantu proses pengecekan area dan pendaftaran selanjutnya.",
  },
  {
    question: "Berapa lama proses instalasi Indibiz?",
    answer:
      "Proses instalasi estimasi 1-3 hari kerja setelah pendaftaran dan konfirmasi area tercover, tergantung jadwal teknisi dan kondisi lokasi pemasangan.",
  },
  {
    question: "Apakah Indibiz tersedia di seluruh Indonesia?",
    answer:
      "Indibiz didukung jaringan fiber optic Telkom yang menjangkau berbagai wilayah di Indonesia. Untuk memastikan ketersediaan jaringan di lokasi Anda, gunakan fitur cek cakupan area pada halaman ini.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16 sm:py-24 text-foreground">
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-ice px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-blue">
          <CircleHelp className="h-3.5 w-3.5" />
          Pertanyaan Umum
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          FAQ WiFi Indibiz
        </h2>
        <p className="mt-3 text-muted-foreground">
          Belum ketemu jawabannya? Chat langsung tim sales kami via WhatsApp.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="rounded-xl border border-border/60 bg-muted/30 px-4 data-[state=open]:border-brand-blue/30 data-[state=open]:bg-brand-ice/50"
          >
            <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-base">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}