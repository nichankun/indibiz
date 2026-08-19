import { MetadataRoute } from "next";
import { SERVICE_AREAS } from "@/lib/service-areas";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const cityRoutes: MetadataRoute.Sitemap = SERVICE_AREAS.map((area) => ({
    url: absoluteUrl(`/indibiz/${area.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...cityRoutes];
}