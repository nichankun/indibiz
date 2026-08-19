/**
 * Identitas situs publik. Set nilai environment ini saat deployment agar
 * metadata dan structured data mencerminkan identitas bisnis yang benar.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indibizpartner.com";

export const siteConfig = {
  url: configuredSiteUrl.replace(/\/$/, ""),
  name: "Indibiz Indonesia",
  operatorName:
    process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Mitra Pendaftaran Indibiz Indonesia",
  salesPhone: "+6285181680899",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
