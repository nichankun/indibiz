import Image from "next/image";
import { Settings2, Wifi, TrendingUp, Headphones, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WHY_INDIBIZ = [
  {
    icon: Settings2,
    title: "Solusi Digital Terintegrasi",
    description:
      "Bukan cuma internet, Indibiz juga menghadirkan berbagai solusi digital pendukung operasional, keuangan, SDM, hingga pemasaran dalam satu ekosistem yang saling terhubung.",
  },
  {
    icon: Wifi,
    title: "Internet Bisnis Tanpa FUP",
    description:
      "Nikmati koneksi tanpa batasan Fair Usage Policy (FUP). Sebagai gantinya, diterapkan kebijakan anti-penyalahgunaan agar kualitas jaringan tetap terjaga untuk semua pelanggan bisnis.",
  },
  {
    icon: TrendingUp,
    title: "Dorong Produktivitas Usaha",
    description:
      "Koneksi cepat dan stabil dirancang untuk menunjang aktivitas kerja sehari-hari, mulai dari transaksi digital, kolaborasi tim, hingga operasional yang serba online.",
  },
  {
    icon: Headphones,
    title: "Dukungan Layanan Lengkap",
    description:
      "Didukung berbagai layanan tambahan dan kemitraan lintas sektor, mulai dari solusi teknologi hingga akses pembiayaan usaha, untuk membantu bisnis Anda terus bertumbuh.",
  },
  {
    icon: Building2,
    title: "Melayani Beragam Sektor Usaha",
    description:
      "Dari UMKM dan ruko, pendidikan, kesehatan, hotel, manufaktur, hingga logistik — Indibiz hadir dengan solusi yang disesuaikan untuk berbagai jenis dan skala usaha di Indonesia.",
  },
];

export function TrustSection() {
  return (
    <section className="relative border-y border-border bg-background pb-16 pt-12 sm:pb-20 sm:pt-16 text-foreground overflow-hidden">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {/* Ikon peta Indonesia */}
        <Image
          src="/peta.png"
          alt="Peta Indonesia"
          width={700}
          height={320}
          className="relative z-0 mx-auto h-80 w-auto sm:h-90"
          priority
        />

        {/* Judul */}
        <h2 className="relative z-10 -mt-10 text-3xl font-bold leading-tight tracking-tight sm:-mt-16 sm:text-4xl">
          Jaringan Fiber Optic Terluas
          <br />
          Se-Indonesia
        </h2>

        {/* Subjudul */}
        <p className="relative z-10 mt-4 text-base text-muted-foreground sm:text-lg">
          Indibiz menyediakan jaringan internet cepat dan stabil yang
          menjangkau seluruh wilayah Indonesia
        </p>
      </div>

      {/* Apa itu & Histori IndiBiz */}
      <div className="relative z-10 mx-auto mt-16 max-w-5xl px-6 sm:mt-20">
        <div className="grid gap-8 sm:grid-cols-2">
          <Card className="border-border/60 bg-muted/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Apa itu Indibiz?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground sm:text-lg">
                Indibiz adalah layanan internet bisnis fiber optic dari Telkom
                Indonesia yang dirancang untuk menemani UMKM dan pelaku usaha
                bertransformasi ke era digital. Berbeda dari internet
                rumahan, Indibiz hadir tanpa batasan Fair Usage Policy (FUP)
                dan dilengkapi kebijakan anti-penyalahgunaan agar koneksi
                tetap stabil, sekaligus dilengkapi berbagai solusi digital
                pendukung operasional, keuangan, SDM, dan pemasaran bisnis.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-muted/20">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Histori Indibiz
                </CardTitle>
                <Badge variant="secondary" className="font-semibold">
                  Sejak 8 Juli 2023
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground sm:text-lg">
                Indibiz pertama kali diperkenalkan oleh Telkom Indonesia
                bertepatan dengan hari jadi Telkom yang ke-58, sebagai
                jawaban atas kebutuhan dunia usaha akan konektivitas internet
                yang andal dan aman. Sejak saat itu, Indibiz terus
                berkembang menjadi bagian dari strategi Telkom dalam
                memperluas ekosistem digital bagi pelaku bisnis di seluruh
                Indonesia.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kenapa Harus Indibiz */}
      <div className="relative z-10 mx-auto mt-16 max-w-5xl px-6 sm:mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Kenapa Harus Indibiz?
          </h3>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Menumbuhkan bisnis dan pemasaran Anda lewat layanan, platform, dan
            konektivitas digital dari Telkom.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-3">
          {WHY_INDIBIZ.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col items-center px-6 py-8 text-center transition-colors duration-200 first:pt-0 sm:py-10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rounded-full group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h4 className="mt-5 font-semibold text-foreground">{title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}