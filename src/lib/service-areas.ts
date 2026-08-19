export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
  areas: string;
};

/**
 * Hanya tambahkan area yang benar-benar dapat ditangani oleh tim sales.
 * Daftar ini men-generate halaman statis /indibiz/[city] (SSG, lihat
 * generateStaticParams) sekaligus entri sitemap.xml — jadi menambah kota
 * di sini otomatis menambah satu halaman terindeks baru dengan H1, meta,
 * dan Schema.org Service per kota.
 */
export const SERVICE_AREAS: ServiceArea[] = [
  // Jabodetabek
  {
    slug: "jakarta",
    name: "Jakarta",
    region: "DKI Jakarta",
    areas: "Jakarta Pusat, Jakarta Barat, Jakarta Selatan, Jakarta Timur, dan Jakarta Utara",
  },
  {
    slug: "bogor",
    name: "Bogor",
    region: "Jawa Barat",
    areas: "Kota Bogor, Kabupaten Bogor, dan area sekitarnya",
  },
  {
    slug: "depok",
    name: "Depok",
    region: "Jawa Barat",
    areas: "seluruh wilayah Kota Depok dan area sekitarnya",
  },
  {
    slug: "tangerang",
    name: "Tangerang",
    region: "Banten",
    areas: "Kota Tangerang, Tangerang Selatan, Kabupaten Tangerang, dan area sekitarnya",
  },
  {
    slug: "bekasi",
    name: "Bekasi",
    region: "Jawa Barat",
    areas: "Kota Bekasi, Kabupaten Bekasi, dan area sekitarnya",
  },
  // Jawa
  {
    slug: "bandung",
    name: "Bandung",
    region: "Jawa Barat",
    areas: "Kota Bandung, Kabupaten Bandung, dan area sekitarnya",
  },
  {
    slug: "semarang",
    name: "Semarang",
    region: "Jawa Tengah",
    areas: "Kota Semarang dan area sekitarnya",
  },
  {
    slug: "solo",
    name: "Solo",
    region: "Jawa Tengah",
    areas: "Kota Surakarta (Solo) dan area sekitarnya",
  },
  {
    slug: "yogyakarta",
    name: "Yogyakarta",
    region: "DI Yogyakarta",
    areas: "Kota Yogyakarta, Sleman, Bantul, dan area sekitarnya",
  },
  {
    slug: "surabaya",
    name: "Surabaya",
    region: "Jawa Timur",
    areas: "Kota Surabaya dan area sekitarnya",
  },
  {
    slug: "malang",
    name: "Malang",
    region: "Jawa Timur",
    areas: "Kota Malang, Kabupaten Malang, dan area sekitarnya",
  },
  {
    slug: "serang",
    name: "Serang",
    region: "Banten",
    areas: "Kota Serang, Cilegon, dan area sekitarnya",
  },
  // Sumatra
  {
    slug: "medan",
    name: "Medan",
    region: "Sumatera Utara",
    areas: "Kota Medan dan area sekitarnya",
  },
  {
    slug: "palembang",
    name: "Palembang",
    region: "Sumatera Selatan",
    areas: "Kota Palembang dan area sekitarnya",
  },
  {
    slug: "pekanbaru",
    name: "Pekanbaru",
    region: "Riau",
    areas: "Kota Pekanbaru dan area sekitarnya",
  },
  {
    slug: "padang",
    name: "Padang",
    region: "Sumatera Barat",
    areas: "Kota Padang dan area sekitarnya",
  },
  {
    slug: "batam",
    name: "Batam",
    region: "Kepulauan Riau",
    areas: "Kota Batam dan area sekitarnya",
  },
  {
    slug: "lampung",
    name: "Lampung",
    region: "Lampung",
    areas: "Kota Bandar Lampung dan area sekitarnya",
  },
  // Kalimantan
  {
    slug: "balikpapan",
    name: "Balikpapan",
    region: "Kalimantan Timur",
    areas: "Kota Balikpapan dan area sekitarnya",
  },
  {
    slug: "banjarmasin",
    name: "Banjarmasin",
    region: "Kalimantan Selatan",
    areas: "Kota Banjarmasin dan area sekitarnya",
  },
  {
    slug: "pontianak",
    name: "Pontianak",
    region: "Kalimantan Barat",
    areas: "Kota Pontianak dan area sekitarnya",
  },
  {
    slug: "samarinda",
    name: "Samarinda",
    region: "Kalimantan Timur",
    areas: "Kota Samarinda dan area sekitarnya",
  },
  // Sulawesi
  {
    slug: "makassar",
    name: "Makassar",
    region: "Sulawesi Selatan",
    areas: "Kota Makassar dan area sekitarnya",
  },
  {
    slug: "manado",
    name: "Manado",
    region: "Sulawesi Utara",
    areas: "Kota Manado dan area sekitarnya",
  },
  {
    slug: "kendari",
    name: "Kendari",
    region: "Sulawesi Tenggara",
    areas: "Kota Kendari dan area sekitarnya",
  },
  {
    slug: "palu",
    name: "Palu",
    region: "Sulawesi Tengah",
    areas: "Kota Palu dan area sekitarnya",
  },
  // Bali & Nusa Tenggara
  {
    slug: "denpasar",
    name: "Denpasar",
    region: "Bali",
    areas: "Kota Denpasar, Badung, dan area sekitarnya",
  },
  {
    slug: "mataram",
    name: "Mataram",
    region: "Nusa Tenggara Barat",
    areas: "Kota Mataram dan area sekitarnya",
  },
  // Maluku & Papua
  {
    slug: "ambon",
    name: "Ambon",
    region: "Maluku",
    areas: "Kota Ambon dan area sekitarnya",
  },
  {
    slug: "jayapura",
    name: "Jayapura",
    region: "Papua",
    areas: "Kota Jayapura dan area sekitarnya",
  },
];

export function getServiceArea(slug: string) {
  return SERVICE_AREAS.find((area) => area.slug === slug);
}
