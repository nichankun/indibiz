import type { Metadata } from "next";
import { Sora, Inter, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SERVICE_AREAS } from "@/lib/service-areas";
import { siteConfig } from "@/lib/site";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = siteConfig.url;
const SITE_NAME = siteConfig.name;
const SITE_TITLE = "Pendaftaran Indibiz Seluruh Indonesia | Internet Fiber untuk Bisnis";
const SITE_DESCRIPTION =
  "Cek ketersediaan dan daftar paket Indibiz untuk bisnis di seluruh Indonesia — Jakarta, Bandung, Surabaya, Medan, Makassar, Bali, dan puluhan kota lainnya. Internet fiber untuk kantor, toko, dan UMKM.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "indibiz",
    "indibiz indonesia",
    "pasang indibiz",
    "pasang indibiz jakarta",
    "pasang indibiz surabaya",
    "pasang indibiz bandung",
    "internet bisnis",
    "internet bisnis indonesia",
    "internet fiber bisnis",
    "internet kantor",
    "wifi bisnis umkm",
  ],
  authors: [{ name: siteConfig.operatorName }],
  creator: siteConfig.operatorName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png", // buat gambar khusus 1200x630, jangan pakai hero.png
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png.png",
  },
  verification: {
    google: "oTR3dW74tb8A1SaRJr2LmYco2qDV_ofz4bjRbYEyjto",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.operatorName,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  telephone: siteConfig.salesPhone,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.salesPhone,
    contactType: "sales",
    availableLanguage: ["id"],
  },
  areaServed: [
    { "@type": "Country", name: "Indonesia" },
    ...SERVICE_AREAS.map((area) => ({
      "@type": "AdministrativeArea",
      name: area.name,
    })),
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn(sora.variable, inter.variable, "font-sans", roboto.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
