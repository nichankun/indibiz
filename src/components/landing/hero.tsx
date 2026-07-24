import { Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_120%_100%_at_100%_0%,#0c1f3f_0%,#081428_45%,#040a16_100%)] text-white">
      {/* Bokeh particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-[6%] top-[18%] h-3 w-3 rounded-full bg-sky-300/70 blur-[2px]" />
        <span className="absolute left-[14%] top-[55%] h-6 w-6 rounded-full bg-sky-400/50 blur-xs" />
        <span className="absolute left-[22%] top-[30%] h-10 w-10 rounded-full bg-sky-400/30 blur-[10px]" />
        <span className="absolute left-[9%] top-[75%] h-16 w-16 rounded-full bg-sky-500/25 blur-lg" />
        <span className="absolute left-[28%] top-[70%] h-4 w-4 rounded-full bg-sky-300/60 blur-[3px]" />
        <span className="absolute left-[35%] top-[15%] h-2 w-2 rounded-full bg-sky-200/70 blur-[1px]" />
        <span className="absolute left-[3%] top-[40%] h-2 w-2 rounded-full bg-sky-200/60 blur-[1px]" />
        <span className="absolute left-[18%] top-[8%] h-24 w-24 rounded-full bg-sky-500/15 blur-xl" />
        <span className="absolute left-[40%] top-[60%] h-8 w-8 rounded-full bg-sky-400/25 blur-sm" />
        <span className="absolute left-[47%] top-[25%] h-3 w-3 rounded-full bg-sky-300/50 blur-[2px]" />
      </div>

      {/* Efek Glow Latar Belakang */}
      <div
        aria-hidden
        className="animate-float-glow pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sky-400/20 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-sky-600/15 blur-[110px]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-5 px-6 py-16 sm:py-24">
        {/* Heading Utama */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          IndiBiz
        </h1>

        {/* Deskripsi */}
        <p className="max-w-md text-base font-medium text-blue-50/90 sm:text-lg">
          Solusi internet dan digital fleksibel untuk mendukung
          pertumbuhan usaha Anda.
        </p>

        {/* Tombol Aksi */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#paket">Daftar Sekarang</a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
          >
            <a href="#cek-jangkauan">
              <Wifi className="h-4 w-4" />
              Cek Jangkauan Area
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}