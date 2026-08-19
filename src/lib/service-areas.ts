export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
  areas: string;
};

/** Hanya tambahkan area yang benar-benar dapat ditangani oleh tim sales. */
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
];

export function getServiceArea(slug: string) {
  return SERVICE_AREAS.find((area) => area.slug === slug);
}
