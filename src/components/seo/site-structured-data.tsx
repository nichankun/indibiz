import { JsonLd } from "@/components/seo/json-ld";
import { SERVICE_AREAS } from "@/lib/service-areas";
import { siteConfig } from "@/lib/site";

const siteDescription =
  "Informasi paket Indibiz dan konsultasi ketersediaan jaringan untuk internet bisnis di DIY Yogyakarta.";

export function SiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.operatorName,
        description: siteDescription,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        telephone: siteConfig.salesPhone,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: siteConfig.salesPhone,
          contactType: "sales",
          availableLanguage: ["id"],
          areaServed: SERVICE_AREAS.map((area) => area.name),
        },
        areaServed: [
          { "@type": "Country", name: "Indonesia" },
          ...SERVICE_AREAS.map((area) => ({
            "@type": "AdministrativeArea",
            name: area.name,
          })),
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteDescription,
        inLanguage: "id-ID",
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
    ],
  };

  return <JsonLd data={data} />;
}
