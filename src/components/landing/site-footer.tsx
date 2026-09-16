import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:gap-12 lg:py-10">
        <div>
          <p className="font-semibold text-white">{siteConfig.name}</p>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-400 lg:text-sm lg:leading-6">
            Informasi paket Indibiz yang tersedia di berbagai wilayah Indonesia. Tim kami fokus melayani konsultasi dan pendaftaran wilayah Jabodetabek.
          </p>
        </div>
        <nav aria-label="Tautan informasi" className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2 lg:gap-x-7 lg:text-base">
          <Link className="hover:text-white" href="/#paket">Paket</Link>
          <Link className="hover:text-white" href="/#jangkauan">Wilayah</Link>
          <Link className="hover:text-white" href="/#hubungi-sales">Hubungi admin</Link>
          <Link className="hover:text-white" href="/privacy">Kebijakan privasi</Link>
        </nav>
      </div>
    </footer>
  );
}
