import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number | string) {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function generateLeadCode(id: number) {
  return `LEAD-${String(id).padStart(6, "0")}`;
}

export const LEAD_STATUS_LABEL: Record<string, string> = {
  lead_baru: "Lead Baru",
  sudah_dihubungi: "Sudah Dihubungi",
  menunggu_survey: "Menunggu Survey",
  survey_dijadwalkan: "Survey Dijadwalkan",
  area_tercover: "Area Tercover",
  tidak_tercover: "Tidak Tercover",
  menunggu_pembayaran: "Menunggu Pembayaran",
  pemasangan_dijadwalkan: "Pemasangan Dijadwalkan",
  berhasil_dipasang: "Berhasil Dipasang",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export const LEAD_STATUS_ORDER = Object.keys(LEAD_STATUS_LABEL);

// PERBAIKAN: Menggunakan opacity (warna/10) untuk background dan modifier dark:text 
// agar warna badge aman dan sangat elegan di Dark Mode maupun Light Mode.
export const LEAD_STATUS_COLOR: Record<string, string> = {
  lead_baru: "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400",
  sudah_dihubungi: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-400",
  menunggu_survey: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  survey_dijadwalkan: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  area_tercover: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  tidak_tercover: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
  menunggu_pembayaran: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  pemasangan_dijadwalkan: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:text-indigo-400",
  berhasil_dipasang: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  selesai: "bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400",
  ditolak: "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400",
};