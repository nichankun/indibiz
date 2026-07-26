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
  badgeIcon: React.ElementType;
  badgeLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

// Ganti `image` dengan banner iklan/promo kamu sendiri — rasio disarankan 16:9–21:9,
// fokus subjek di sisi kanan supaya tidak tertutup teks di sisi kiri.
const SLIDES: Slide[] = [
  {
    image: "/hero.png",
    imageAlt: "Tim bisnis menggunakan solusi internet Indibiz",
    badgeIcon: ShieldCheck,
    badgeLabel: "Internet Bisnis dari Telkom Group",
    title: "Internet fiber yang bisnis Anda bisa andalkan.",
    description:
      "Koneksi stabil tanpa batasan FUP, prioritas trafik untuk pelanggan bisnis, dan dukungan teknis yang siap membantu — supaya Anda fokus menjalankan usaha, bukan mengurus jaringan.",
    ctaLabel: "Lihat Paket & Harga",
    ctaHref: "#paket",
    secondaryLabel: "Cek Jangkauan Area",
    secondaryHref: "#cek-jangkauan",
  },
  {
    image: "/hero-promo.png",
    imageAlt: "Promo diskon biaya pasang baru Indibiz",
    badgeIcon: Sparkles,
    badgeLabel: "Promo Terbatas",
    title: "Diskon 70% biaya pasang baru, bulan ini saja.",
    description:
      "Daftar sekarang dan nikmati potongan biaya instalasi untuk semua paket Basic maupun Bisnis. Slot promo terbatas setiap bulannya.",
    ctaLabel: "Klaim Promo Sekarang",
    ctaHref: "#paket",
  },
  {
    image: "/hero-addon.png",
    imageAlt: "Monitoring jaringan bisnis dengan Netmonk HI",
    badgeIcon: Router,
    badgeLabel: "Bundling Add-on",
    title: "Pantau kesehatan jaringan bisnis Anda real-time.",
    description:
      "Lengkapi paket internet dengan Netmonk HI — dashboard monitoring jaringan yang membantu Anda tahu lebih dulu sebelum masalah mengganggu operasional.",
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

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy-deep text-white">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay.current]}
        className="group/hero"
      >
        <CarouselContent>
          {SLIDES.map((slide, i) => {
            const BadgeIcon = slide.badgeIcon;
            return (
              <CarouselItem key={i}>
                <div className="relative flex min-h-[600px] items-center sm:min-h-[680px]">
                  {/* Foto latar belakang per slide */}
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

                  {/* Overlay navy korporat */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy-deep via-brand-navy/85 to-brand-navy/25" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy-deep/80 via-transparent to-transparent" />

                  {/* Glow aksen sky-blue, ambient */}
                  <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-72 w-72 rounded-full bg-brand-sky/20 blur-[100px] animate-float-glow" />

                  <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-20 sm:py-28">
                    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-blue-100 backdrop-blur-sm">
                      <BadgeIcon className="h-3.5 w-3.5 text-brand-sky" />
                      {slide.badgeLabel}
                    </div>

                    <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(6,15,40,0.9)] sm:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="max-w-lg text-base font-medium text-blue-100/90 drop-shadow-[0_2px_10px_rgba(6,15,40,0.9)] sm:text-lg">
                      {slide.description}
                    </p>

                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                      <Button
                        size="lg"
                        asChild
                        className="bg-brand-blue text-white shadow-lg shadow-brand-blue/40 hover:bg-brand-blue-dark"
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
                          className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                        >
                          <a href={slide.secondaryHref}>
                            <Wifi className="h-4 w-4" />
                            {slide.secondaryLabel}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Panah navigasi — halus, muncul saat hover di desktop */}
        <CarouselPrevious className="left-4 hidden border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-sm hover:bg-white/20 hover:text-white group-hover/hero:opacity-100 sm:flex" />
        <CarouselNext className="right-4 hidden border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-sm hover:bg-white/20 hover:text-white group-hover/hero:opacity-100 sm:flex" />

        {/* Dot indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-14 z-10 flex items-center justify-center gap-2 sm:bottom-16">
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

      {/* Trust chips — persistent, tidak ikut berganti dengan slide */}
      <div className="relative z-10 mx-auto -mt-1 flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 pb-8 sm:pb-10">
        {TRUST_CHIPS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-blue-100/80">
            <Icon className="h-4 w-4 text-brand-sky" />
            {label}
          </div>
        ))}
      </div>

      {/* Elemen signature: garis fiber pulse menutup dasar hero */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-6 opacity-80">
        <FiberPulse className="h-full w-full" variant="light" />
      </div>
    </section>
  );
}