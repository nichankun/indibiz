import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, leadActivities, packages } from "@/db/database/schema";
import { generateLeadCode } from "@/lib/utils";
import { getClientIp } from "@/lib/client-ip";
import { consumeRateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  whatsapp: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?[0-9]{8,20}$/, "Nomor WhatsApp tidak valid"),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  postalCode: z.string().max(10).optional(),
  address: z.string().max(1000).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  packageId: z.number().int().positive().optional(),
  consentPrivacy: z.boolean(),
  consentContact: z.boolean(),
  source: z.string().max(60).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  landingPageSource: z.string().max(2048).optional(),
  referral: z.string().max(120).optional(),
  website: z.string().max(0).optional(),
});

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = consumeRateLimit({
    key: `lead:${ip}`,
    limit: MAX_PER_WINDOW,
    windowMs: WINDOW_MS,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot: bot biasanya mengisi field tersembunyi ini.
  if (data.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (!data.consentPrivacy) {
    return NextResponse.json({ error: "Persetujuan kebijakan privasi wajib dicentang." }, { status: 400 });
  }

  if (data.packageId) {
    const selectedPackage = await db.query.packages.findFirst({
      columns: { id: true },
      where: and(eq(packages.id, data.packageId), eq(packages.isActive, true)),
    });

    if (!selectedPackage) {
      return NextResponse.json({ error: "Paket yang dipilih tidak tersedia." }, { status: 400 });
    }
  }

  try {
    const leadCode = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(leads)
        .values({
          name: data.name,
          whatsapp: data.whatsapp,
          email: data.email || undefined,
          city: data.city,
          district: data.district,
          postalCode: data.postalCode,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          packageId: data.packageId,
          consentPrivacy: data.consentPrivacy,
          consentContact: data.consentContact,
          source: data.source ?? "landing_page",
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
          landingPageSource: data.landingPageSource,
          referral: data.referral,
          leadCode: `TMP-${crypto.randomUUID().replaceAll("-", "").slice(0, 16)}`,
        })
        .returning();

      const code = generateLeadCode(inserted.id);
      await tx.update(leads).set({ leadCode: code }).where(eq(leads.id, inserted.id));

      await tx.insert(leadActivities).values({
        leadId: inserted.id,
        type: "perubahan_status",
        content: `Lead masuk dari ${data.source ?? "landing_page"}`,
        newStatus: "lead_baru",
      });

      return code;
    });

    return NextResponse.json({ ok: true, leadCode }, { status: 201 });
  } catch (err) {
    console.error("Gagal menyimpan lead:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan pendaftaran. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
