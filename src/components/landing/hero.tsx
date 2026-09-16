"use client";

import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, MessageCircle, Pause, Play } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { createSalesWhatsAppUrl } from "@/lib/whatsapp-link";

const slides = [
  { src: "/hero-slide-cafe.png", alt: "Pemilik kedai mengelola usaha dengan koneksi internet bisnis" },
  { src: "/hero-slide-retail.png", alt: "Pemilik toko memantau pesanan dan operasional usahanya" },
  { src: "/hero-slide-office.png", alt: "Tim bisnis bekerja bersama menggunakan solusi digital" },
] as const;

const salesUrl = createSalesWhatsAppUrl(
  "Halo Admin Indibiz, saya ingin konsultasi paket internet bisnis untuk area Jabodetabek.",
);
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getReducedMotionServerSnapshot() {
  return true;
}

export function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rotationOverride, setRotationOverride] = useState<boolean | null>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const isRotating = rotationOverride ?? !prefersReducedMotion;
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5500,
        playOnInit: false,
        stopOnFocusIn: false,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [],
  );
  const plugins = useMemo(() => [autoplay], [autoplay]);

  const setCarouselApi = useCallback((carouselApi: CarouselApi) => {
    setApi(carouselApi);
  }, []);

  useEffect(() => {
    if (!api) return;

    const updateCurrentSlide = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", updateCurrentSlide);
    api.on("reInit", updateCurrentSlide);

    return () => {
      api.off("select", updateCurrentSlide);
      api.off("reInit", updateCurrentSlide);
    };
  }, [api]);

  useEffect(() => {
    if (isRotating) autoplay.play();
    else autoplay.stop();
  }, [autoplay, isRotating]);

  const resumeRotation = useCallback(() => {
    if (isRotating) autoplay.play();
  }, [autoplay, isRotating]);

  const pauseForKeyboard = useCallback(() => {
    autoplay.stop();
  }, [autoplay]);

  const resumeAfterKeyboard = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
      ) {
        return;
      }
      resumeRotation();
    },
    [resumeRotation],
  );

  return (
    <section className="w-full bg-slate-50 px-3 py-3 sm:px-5 md:py-5" aria-label="Indibiz untuk usaha">
      <div className="mx-auto max-w-[1800px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm sm:rounded-[2rem]">
        <Carousel
          aria-label="Inspirasi usaha Indibiz"
          className="relative"
          opts={{ loop: true, align: "start" }}
          plugins={plugins}
          setApi={setCarouselApi}
          onMouseEnter={() => autoplay.stop()}
          onMouseLeave={resumeRotation}
          onFocusCapture={pauseForKeyboard}
          onBlurCapture={resumeAfterKeyboard}
        >
          <CarouselContent className="ml-0">
            {slides.map((slide, index) => (
              <CarouselItem
                key={slide.src}
                className="relative isolate min-h-[660px] overflow-hidden pl-0 md:aspect-[2/1] md:min-h-[560px] lg:aspect-[2.15/1] lg:min-h-0"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  preload={index === 0}
                  sizes="100vw"
                  className="-z-20 object-cover object-[58%_center] md:object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white/80 via-40% to-transparent to-75% md:bg-gradient-to-r md:from-white md:via-white/95 md:via-40% md:to-white/0 md:to-60%"
                />

                <div className="relative z-10 mx-auto flex h-full min-h-[660px] max-w-6xl flex-col px-5 pb-16 pt-7 sm:px-8 md:min-h-[560px] md:justify-center md:px-12 md:py-12 lg:min-h-0 lg:px-6 lg:py-14">
                  <div className="flex w-fit items-center gap-2.5">
                    <Image src="/logo.png" width={34} height={34} alt="" />
                    <span className="text-2xl font-semibold tracking-[-0.04em] text-brand-navy sm:text-[1.75rem]">
                      indi<span className="text-red-600">biz</span>
                    </span>
                  </div>

                  <div className="mt-9 max-w-[700px] md:mt-10">
                    {currentSlide === index ? (
                      <h1 className="font-sans text-[2.35rem] leading-[1.1] font-semibold tracking-[-0.035em] text-brand-navy sm:text-5xl lg:text-[3.75rem]">
                        <span className="block">Internet fiber</span>
                        <span className="block">
                          untuk <span className="text-red-600">bisnis</span> Anda.
                        </span>
                      </h1>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="font-sans text-[2.35rem] leading-[1.1] font-semibold tracking-[-0.035em] text-brand-navy sm:text-5xl lg:text-[3.75rem]"
                      >
                        <span className="block">Internet fiber</span>
                        <span className="block">
                          untuk <span className="text-red-600">bisnis</span> Anda.
                        </span>
                      </div>
                    )}
                    <p className="mt-4 max-w-[520px] text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                      Koneksi stabil untuk mendukung usaha di area Jabodetabek.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        className="h-11 rounded-full bg-[#25D366] px-4 text-sm text-white shadow-sm shadow-[#25D366]/25 hover:bg-[#128C7E] sm:h-12 sm:px-5 sm:text-base lg:h-14 lg:px-6"
                      >
                        <Link href={salesUrl} target="_blank" rel="noreferrer">
                          <MessageCircle className="size-4" aria-hidden="true" />
                  Konsultasi via WhatsApp
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-full border-slate-300 bg-white/95 px-4 text-sm font-semibold text-brand-navy shadow-sm hover:bg-white hover:text-brand-navy sm:h-12 sm:px-5 sm:text-base lg:h-14 lg:px-6"
                      >
                        <Link href="#paket">
                          Lihat paket <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div role="group" aria-label="Pilih slide" className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Tampilkan slide ${index + 1} dari ${slides.length}`}
                aria-current={currentSlide === index ? "true" : undefined}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-[width,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 ${
                  currentSlide === index ? "w-5 bg-brand-blue" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
            <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-slate-200" />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={isRotating ? "Jeda putar otomatis" : "Mulai putar otomatis"}
              aria-pressed={isRotating}
              onClick={() => setRotationOverride(!isRotating)}
              className="size-7 rounded-full text-brand-navy hover:bg-slate-100"
            >
              {isRotating ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </Button>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
