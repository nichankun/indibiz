"use client";

import { FiberPulse } from "./fiber-pulse";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.1.11-1.78-.11-.41-.13-.94-.31-1.61-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.38c.26-.28.56-.35.75-.35.19 0 .38 0 .54.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.04.93 1.92 1.22 2.2 1.36.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

export function CoverageChecker() {
  return (
    <section id="cek-jangkauan" className="mx-auto max-w-4xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-brand-navy-deep px-6 py-10 sm:px-12 sm:py-14">
        {/* Aksen glow — sky-blue di satu sisi, emerald di sisi lain sebagai penanda WA */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-sky/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative grid gap-6 sm:grid-cols-[1.4fr_1fr] sm:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-sky">
              Cek Jangkauan Area
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              Pastikan lokasi Anda tercover jaringan Indibiz
            </h2>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Kirim alamat lengkap via WhatsApp, tim kami cek ketersediaan
              jaringan di lokasi Anda dalam hitungan menit — gratis, tanpa
              komitmen.
            </p>
          </div>

          <a
            href="https://wa.me/6285179657878"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-colors hover:bg-emerald-600 sm:text-base"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Hubungi Sales Indibiz
          </a>
        </div>

        <div className="relative mt-8 opacity-60">
          <FiberPulse className="h-4 w-full" variant="light" />
        </div>
      </div>
    </section>
  );
}