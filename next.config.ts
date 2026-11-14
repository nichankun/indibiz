import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel membangun dan mengemas output Next.js sendiri. Pada Next 16.3,
  // `standalone` + adapter Vercel dapat memicu ENOENT next-server.js.nft.json.
  // Docker tetap memakai standalone melalui build lokal/non-Vercel.
  output: process.env.VERCEL ? undefined : "standalone",
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
