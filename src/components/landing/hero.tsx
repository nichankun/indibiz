import { Wifi, ShieldCheck, Gauge } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-(--color-navy-950) via-(--color-navy-900) to-(--color-navy-800) text-white">
      <div
        aria-hidden
        className="animate-float-glow pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-(--color-signal-600)/30 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-(--color-navy-600)/40 blur-[100px]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80">
          <Wifi className="h-3.5 w-3.5 text-(--color-signal-400)" />
          Tersedia untuk rumah &amp; bisnis
        </span>

        <h1 className="max-w-2xl font-(family-name:--font-display) text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Koneksi yang jalan terus,
          <span className="text-(--color-signal-400)"> secepat bisnis Anda.</span>
        </h1>

        <p className="max-w-xl text-base text-white/70 sm:text-lg">
          Indibiz menghubungkan rumah dan usaha Anda dengan internet fiber
          stabil mulai 50 Mbps. Cek jangkauan area, pilih paket, tim kami yang
          urus sisanya.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#paket" className={buttonVariants({ size: "lg", variant: "accent" })}>
            Daftar Sekarang
          </a>
          <a
            href="#cek-jangkauan"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "border-white/20 text-white hover:bg-white/10",
            })}
          >
            Cek Jangkauan Area
          </a>
        </div>

        <dl className="mt-8 grid w-full max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-white/60">
              <Gauge className="h-4 w-4" /> Kecepatan
            </dt>
            <dd className="mt-1 font-(family-name:--font-display) text-xl font-semibold">50–300 Mbps</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-white/60">
              <ShieldCheck className="h-4 w-4" /> Garansi
            </dt>
            <dd className="mt-1 font-(family-name:--font-display) text-xl font-semibold">SLA Bisnis</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-white/60">
              <Wifi className="h-4 w-4" /> Instalasi
            </dt>
            <dd className="mt-1 font-(family-name:--font-display) text-xl font-semibold">Gratis</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}