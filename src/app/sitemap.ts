import type { MetadataRoute } from "next";
import { SERVICE_AREAS } from "@/lib/service-areas";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/privacy") },
  ];

  const cityRoutes: MetadataRoute.Sitemap = SERVICE_AREAS.map((area) => ({
    url: absoluteUrl(`/indibiz/${area.slug}`),
  }));

  return [...staticRoutes, ...cityRoutes];
}
