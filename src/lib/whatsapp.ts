import "server-only";

const GRAPH_API_VERSION = "v21.0";

type SendResult = { ok: true; messageId: string } | { ok: false; error: string };

function getConfig() {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return null;
  return { token, phoneNumberId };
}

export function isWhatsAppApiConfigured() {
  return getConfig() !== null;
}

/**
 * Normalisasi nomor Indonesia ke format E.164 tanpa "+" (format yang
 * diminta Cloud API), mis. "08123456789" -> "628123456789".
 */
export function normalizeIndonesianPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}

/**
 * Kirim pesan template WhatsApp yang sudah disetujui Meta (wajib untuk
 * memulai percakapan di luar window 24 jam). Nama template & parameter
 * harus sesuai dengan yang sudah didaftarkan di WhatsApp Manager Anda.
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  bodyParams: string[]
): Promise<SendResult> {
  const config = getConfig();
  if (!config) {
    return { ok: false, error: "WHATSAPP_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID belum diatur di .env" };
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizeIndonesianPhone(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components:
          bodyParams.length > 0
            ? [{ type: "body", parameters: bodyParams.map((text) => ({ type: "text", text })) }]
            : undefined,
      },
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return { ok: false, error: data?.error?.message ?? `WhatsApp API error (${res.status})` };
  }

  return { ok: true, messageId: data?.messages?.[0]?.id ?? "unknown" };
}

/**
 * Kirim pesan teks bebas — hanya valid jika ada percakapan aktif dalam
 * 24 jam terakhir (pelanggan pernah membalas). Untuk kontak dingin,
 * gunakan sendWhatsAppTemplate.
 */
export async function sendWhatsAppText(to: string, message: string): Promise<SendResult> {
  const config = getConfig();
  if (!config) {
    return { ok: false, error: "WHATSAPP_API_TOKEN / WHATSAPP_PHONE_NUMBER_ID belum diatur di .env" };
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${config.phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizeIndonesianPhone(to),
      type: "text",
      text: { body: message },
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return { ok: false, error: data?.error?.message ?? `WhatsApp API error (${res.status})` };
  }

  return { ok: true, messageId: data?.messages?.[0]?.id ?? "unknown" };
}
