// app/sitemap.ts
import type { MetadataRoute } from "next";
import { SERVICE_AREAS } from "@/lib/service-areas";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SERVICE_AREAS.map((area) => ({
      url: absoluteUrl(`/indibiz/${area.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
