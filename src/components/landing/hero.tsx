import { Wifi, ShieldCheck, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button"; // PERBAIKAN: Hanya import Button

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      {/* Efek Glow Latar Belakang */}
      <div
        aria-hidden
        className="animate-float-glow pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-muted-foreground/10 blur-[100px]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 sm:py-28">
        
        {/* Badge "Tersedia untuk rumah & bisnis" */}
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium tracking-wide text-secondary-foreground">
          <Wifi className="h-3.5 w-3.5 text-primary" />
          Tersedia untuk rumah &amp; bisnis
        </span>

        {/* Heading Utama */}
        <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          Koneksi yang jalan terus,
          <span className="text-primary"> secepat bisnis Anda.</span>
        </h1>

        {/* Deskripsi */}
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Indibiz menghubungkan rumah dan usaha Anda dengan internet fiber
          stabil mulai 50 Mbps. Cek jangkauan area, pilih paket, tim kami yang
          urus sisanya.
        </p>

        {/* Tombol Aksi - PERBAIKAN DI SINI */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#paket">Daftar Sekarang</a>
          </Button>
          
          <Button size="lg" variant="outline" asChild>
            <a href="#cek-jangkauan">Cek Jangkauan Area</a>
          </Button>
        </div>

        {/* Statistik / Fitur Utama */}
        <dl className="mt-8 grid w-full max-w-xl grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-4 w-4" /> Kecepatan
            </dt>
            <dd className="mt-1 text-xl font-semibold">50–300 Mbps</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" /> Garansi
            </dt>
            <dd className="mt-1 text-xl font-semibold">SLA Bisnis</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <Wifi className="h-4 w-4" /> Instalasi
            </dt>
            <dd className="mt-1 text-xl font-semibold">Gratis</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}