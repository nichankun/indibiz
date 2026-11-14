export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
  areas: string;
};

/** Area yang dilayani tim pendaftaran dan dipakai untuk halaman lokasi. */
export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: "yogyakarta",
    name: "Kota Yogyakarta",
    region: "DIY Yogyakarta",
    areas: "Kota Yogyakarta",
  },
  {
    slug: "sleman",
    name: "Sleman",
    region: "DIY Yogyakarta",
    areas: "Kabupaten Sleman",
  },
  {
    slug: "bantul",
    name: "Bantul",
    region: "DIY Yogyakarta",
    areas: "Kabupaten Bantul",
  },
  {
    slug: "kulon-progo",
    name: "Kulon Progo",
    region: "DIY Yogyakarta",
    areas: "Kabupaten Kulon Progo",
  },
  {
    slug: "gunungkidul",
    name: "Gunungkidul",
    region: "DIY Yogyakarta",
    areas: "Kabupaten Gunungkidul",
  },
];

/** Penanda kawasan Indibiz, bukan halaman SEO. */
export const COVERAGE_REGIONS = [
  { name: "Sumatera", description: "Sumatera dan kepulauan sekitarnya" },
  { name: "Jawa", description: "Jawa, Banten, dan DKI Jakarta" },
  {
    name: "DIY Yogyakarta",
    description: "Kota Yogyakarta, Sleman, Bantul, Kulon Progo, dan Gunungkidul",
  },
  { name: "Kalimantan", description: "Kalimantan Barat hingga Kalimantan Utara" },
  { name: "Sulawesi", description: "Sulawesi Utara hingga Sulawesi Barat" },
  { name: "Bali & Nusa Tenggara", description: "Bali, NTB, dan NTT" },
  { name: "Maluku & Papua", description: "Maluku dan seluruh wilayah Papua" },
] as const;

/** Slug lama diarahkan ke beranda agar tidak menampilkan cakupan Jabodetabek yang sudah tidak berlaku. */
export const LEGACY_SERVICE_AREA_SLUGS = [
  "jakarta",
  "bogor",
  "depok",
  "tangerang",
  "bekasi",
] as const;

export function getServiceArea(slug: string) {
  return SERVICE_AREAS.find((area) => area.slug === slug);
}
