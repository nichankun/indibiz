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

export const LEAD_STATUS_COLOR: Record<string, string> = {
  lead_baru: "bg-slate-100 text-slate-700 border-slate-200",
  sudah_dihubungi: "bg-sky-50 text-sky-700 border-sky-200",
  menunggu_survey: "bg-amber-50 text-amber-700 border-amber-200",
  survey_dijadwalkan: "bg-amber-50 text-amber-700 border-amber-200",
  area_tercover: "bg-emerald-50 text-emerald-700 border-emerald-200",
  tidak_tercover: "bg-red-50 text-red-700 border-red-200",
  menunggu_pembayaran: "bg-purple-50 text-purple-700 border-purple-200",
  pemasangan_dijadwalkan: "bg-indigo-50 text-indigo-700 border-indigo-200",
  berhasil_dipasang: "bg-emerald-50 text-emerald-700 border-emerald-200",
  selesai: "bg-teal-50 text-teal-700 border-teal-200",
  ditolak: "bg-red-50 text-red-700 border-red-200",
};
