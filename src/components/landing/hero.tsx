import Image from "next/image";
import { Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden text-white sm:min-h-[640px]">
      {/* Foto latar belakang */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/hero.png"
          alt="Tim bisnis menggunakan solusi internet IndiBiz"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
      </div>

      {/* Overlay gelap supaya teks tetap terbaca di atas foto */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-5 px-6 py-16 sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] sm:text-5xl">
          IndiBiz
        </h1>

        <p className="max-w-md text-base font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-lg">
          Solusi internet dan digital fleksibel untuk mendukung
          pertumbuhan usaha Anda.
        </p>

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