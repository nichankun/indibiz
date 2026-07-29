import type { Metadata } from "next";
import { Sora, Inter, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

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

const SITE_URL = "https://indibizpartner.com"; // ganti dengan domain asli kamu
const SITE_NAME = "Indibiz";
const SITE_TITLE = "Indibiz — Internet Fiber Bisnis Tanpa Batasan FUP | Telkom Group";
const SITE_DESCRIPTION =
  "Pasang Indibiz sekarang. Internet fiber tanpa batasan FUP untuk rumah & bisnis, jaringan nasional Telkom Group. Diskon 70% biaya pasang baru bulan ini.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "indibiz",
    "internet bisnis",
    "internet fiber bisnis",
    "wifi bisnis telkom",
    "internet kantor",
    "internet tanpa FUP",
    "paket internet basic bisnis",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: "Telkom Group",
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
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "oTR3dW74tb8A1SaRJr2LmYco2qDV_ofz4bjRbYEyjto",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  telephone: "+6285181680899",
  parentOrganization: {
    "@type": "Organization",
    name: "Telkom Group",
  },
  areaServed: "ID",
  sameAs: [
    // tambahkan link sosial media resmi kalau ada, misal:
    // "https://www.instagram.com/indibiz",
    // "https://www.facebook.com/indibiz",
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