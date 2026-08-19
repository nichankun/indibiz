export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
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
    question: "Berapa lama proses instalasi Indibiz?",
    answer:
      "Proses instalasi estimasi 1-3 hari kerja setelah pendaftaran dan konfirmasi area tercover, tergantung jadwal teknisi dan kondisi lokasi pemasangan.",
  },
  {
    question: "Bagaimana cara daftar layanan Indibiz?",
    answer:
      "Cukup pilih paket yang sesuai kebutuhan pada bagian Paket & Harga, lalu klik untuk menghubungi kami langsung melalui WhatsApp. Tim kami akan membantu proses pengecekan area dan pendaftaran selanjutnya.",
  },
];

// Helper fungsi untuk FAQ area kota (Local SEO)
export function getCityFaqs(cityName: string, areas: string): FaqItem[] {
  return [
    {
      question: `Berapa lama proses pemasangan Indibiz di ${cityName}?`,
      answer: `Estimasi pemasangan baru Indibiz di ${cityName} adalah 1–3 hari kerja setelah survei lokasi dan konfirmasi titik ODP fiber optic terdekat di alamat usaha Anda.`,
    },
    {
      question: `Apakah Indibiz meng-cover seluruh wilayah ${cityName}?`,
      answer: `Layanan Indibiz mencakup area ${areas}. Untuk memastikan jaringan di alamat spesifik ruko/kantor Anda, silakan hubungi tim sales kami untuk cek ketersediaan port gratis.`,
    },
    ...FAQ_ITEMS.slice(0, 5),
  ];
}