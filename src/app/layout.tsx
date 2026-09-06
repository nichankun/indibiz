import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const SITE_URL = siteConfig.url;
const SITE_NAME = siteConfig.name;
const SITE_TITLE = "Indibiz untuk Bisnis: Cek Paket & Jangkauan";
const SITE_DESCRIPTION =
  "Cek paket, harga, dan jangkauan Indibiz untuk kantor, toko, dan UMKM. Dapatkan bantuan pengecekan area serta pendaftaran internet bisnis di Indonesia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
        url: "/og-image.png",
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
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "oTR3dW74tb8A1SaRJr2LmYco2qDV_ofz4bjRbYEyjto",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className="font-sans"
    >
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
