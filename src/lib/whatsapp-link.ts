import { siteConfig } from "@/lib/site";

export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

export function createWhatsAppUrl(phone: string, message: string) {
  const number = normalizeWhatsAppNumber(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function createSalesWhatsAppUrl(message: string) {
  return createWhatsAppUrl(siteConfig.salesPhone, message);
}
