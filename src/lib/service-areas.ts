export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
  areas: string;
};

/**
 * Halaman layanan yang benar-benar dilayani tim pendaftaran saat ini.
 * Membatasi data ini menjaga sitemap dan internal link tetap fokus pada
 * Jabodetabek, bukan membuat halaman kota berulang untuk seluruh Indonesia.
 */
export const SERVICE_AREAS: ServiceArea[] = [
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
    areas: "Kota Depok dan area sekitarnya",
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
];

/** Kawasan kepulauan untuk penanda cakupan nasional, bukan halaman SEO. */
export const NATIONAL_ISLANDS = [
  { name: "Sumatera", description: "Sumatera dan kepulauan sekitarnya" },
  { name: "Jawa", description: "Jawa, Banten, dan DKI Jakarta" },
  { name: "Kalimantan", description: "Kalimantan Barat hingga Kalimantan Utara" },
  { name: "Sulawesi", description: "Sulawesi Utara hingga Sulawesi Barat" },
  { name: "Bali & Nusa Tenggara", description: "Bali, NTB, dan NTT" },
  { name: "Maluku & Papua", description: "Maluku dan seluruh wilayah Papua" },
] as const;

export function getServiceArea(slug: string) {
  return SERVICE_AREAS.find((area) => area.slug === slug);
}
