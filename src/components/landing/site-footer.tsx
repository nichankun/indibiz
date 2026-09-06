import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">{siteConfig.name}</p>
          <p className="mt-1 text-xs text-slate-400">
            Layanan informasi, pengecekan jangkauan, dan bantuan pendaftaran internet bisnis.
          </p>
        </div>
        <nav aria-label="Tautan informasi" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="hover:text-white" href="/#paket">
            Paket
          </Link>
          <Link className="hover:text-white" href="/#cek-jangkauan">
            Cek jangkauan
          </Link>
          <Link className="hover:text-white" href="/privacy">
            Kebijakan privasi
          </Link>
        </nav>
      </div>
    </footer>
  );
}
