"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Wifi, ShieldCheck, Headset, ArrowRight, Sparkles, Router } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FiberPulse } from "./fiber-pulse";

const TRUST_CHIPS = [
  { icon: Wifi, label: "Tanpa Batasan FUP" },
  { icon: ShieldCheck, label: "Jaringan Fiber Nasional Telkom" },
  { icon: Headset, label: "Dukungan Teknis Responsif" },
];

type Slide = {
  image: string;
  imageAlt: string;

  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

// Ganti `image` dengan banner iklan/promo kamu sendiri.
// CATATAN: karena judul & deskripsi tidak lagi dirender sebagai teks HTML di desktop,
// pastikan gambar sudah memuat pesan utamanya sendiri (seperti diskon.png/pantau.png).
// `title` & `description` tetap dipakai untuk versi mobile (panel di bawah foto).
const SLIDES: Slide[] = [
  {
    image: "/hero2.png",
    imageAlt: "Tim bisnis menggunakan solusi internet Indibiz",
 
    ctaLabel: "Lihat Paket & Harga",
    ctaHref: "#paket",
    secondaryLabel: "Cek Jangkauan Area",
    secondaryHref: "#cek-jangkauan",
  },
  {
    image: "/diskon.png",
    imageAlt: "Promo diskon biaya pasang baru Indibiz",
   
   
    ctaLabel: "Klaim Promo Sekarang",
    ctaHref: "#paket",
  },
  {
    image: "/pantau.png",
    imageAlt: "Monitoring jaringan bisnis dengan Netmonk HI",
   
  
    ctaLabel: "Lihat Paket Bundling",
    ctaHref: "#paket",
  },
];

export function Hero() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const autoplay = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const activeSlide = SLIDES[current];

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      {/*
        H1 tersembunyi secara visual (bukan visual gambar carousel di atas)
        agar mesin pencari punya judul utama halaman dalam bentuk teks asli
        yang bisa di-crawl. Tampilan halaman tidak berubah sama sekali —
        `sr-only` cuma menyembunyikan secara visual, tetap terbaca oleh
        Google dan screen reader (bukan teknik cloaking/spam karena isinya
        sesuai konten & metadata halaman yang sebenarnya).
      */}
      <h1 className="sr-only">
        Indibiz — Internet Fiber Bisnis Tanpa Batasan FUP dari Telkom Group
      </h1>

      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="group/hero"
      >
        <CarouselContent className="ml-0">
  {SLIDES.map((slide, i) => {

    return (
      <CarouselItem key={i} className="pl-0">
                {/* ============ MOBILE (< sm): banner foto + panel solid terpisah ============ */}
                <div className="flex flex-col sm:hidden">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-slate-950 to-transparent" />
                    <FiberPulse className="absolute inset-x-0 bottom-0 h-1 w-full" variant="light" />
                  </div>

                  <div className="flex flex-col items-start gap-4 bg-slate-950 px-5 pb-8 pt-5">
                  


                    <div className="flex w-full flex-col gap-2.5 pt-1">
                      <Button
                        size="lg"
                        asChild
                        className="w-full bg-brand-blue text-white shadow-lg shadow-brand-blue/40 hover:bg-brand-blue-dark"
                      >
                        <a href={slide.ctaHref}>
                          {slide.ctaLabel}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>

                      {slide.secondaryLabel && slide.secondaryHref && (
                        <Button
                          size="lg"
                          variant="outline"
                          asChild
                          className="w-full border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                        >
                          <a href={slide.secondaryHref}>
                            <Wifi className="h-4 w-4" />
                            {slide.secondaryLabel}
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {SLIDES.map((_, di) => (
                        <button
                          key={di}
                          type="button"
                          aria-label={`Ke banner ${di + 1}`}
                          onClick={() => api?.scrollTo(di)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            di === current ? "w-6 bg-brand-sky" : "w-1.5 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ============ DESKTOP (sm ke atas): gambar full-bleed, hanya badge di atasnya ============ */}
                <div className="relative hidden items-center sm:flex sm:min-h-140">
                  <div className="absolute inset-0 -z-20">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      priority={i === 0}
                      sizes="100vw"
                      className="object-cover object-right"
                    />
                  </div>

                  {/* Scrim tipis hanya di pojok atas kiri — sekadar bikin badge tetap kebaca, bukan menutupi gambar */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/55 to-transparent" />

                  <div className="relative mx-auto flex w-full max-w-6xl items-start px-6 py-8">
                   
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-4 hidden border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-sm hover:bg-white/20 hover:text-white group-hover/hero:opacity-100 sm:flex" />
        <CarouselNext className="right-4 hidden border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-sm hover:bg-white/20 hover:text-white group-hover/hero:opacity-100 sm:flex" />

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden items-center justify-center gap-2 sm:flex">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ke banner ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-brand-sky" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </Carousel>

      {/* Baris bawah: trust chips (kiri) + tombol CTA slide aktif (kanan, desktop saja) */}
     <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-4 px-6 pb-6 pt-2 sm:pb-8">
  <div className="hidden items-center gap-3 sm:flex">
    <Button
      size="sm"
      asChild
      className="bg-brand-blue text-white shadow-lg shadow-brand-blue/40 hover:bg-brand-blue-dark"
    >
      <a href={activeSlide.ctaHref}>
        {activeSlide.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    </Button>

    {activeSlide.secondaryLabel && activeSlide.secondaryHref && (
      <Button
        size="sm"
        variant="outline"
        asChild
        className="border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white"
      >
        <a href={activeSlide.secondaryHref}>
          <Wifi className="h-4 w-4" />
          {activeSlide.secondaryLabel}
        </a>
      </Button>
    )}
  </div>

  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
    {TRUST_CHIPS.map(({ icon: Icon, label }) => (
      <div key={label} className="flex items-center gap-2 text-sm font-medium text-blue-100/80">
        <Icon className="h-4 w-4 text-brand-sky" />
        {label}
      </div>
    ))}
  </div>
</div>

      <div className="absolute inset-x-0 bottom-0 z-10 hidden h-6 opacity-80 sm:block">
        <FiberPulse className="h-full w-full" variant="light" />
      </div>
    </section>
  );
}