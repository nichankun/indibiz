import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, leadActivities } from "@/db/schema";
import { generateLeadCode } from "@/lib/utils";

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  whatsapp: z.string().min(8).max(20),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  postalCode: z.string().max(10).optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  packageId: z.number().int().optional(),
  consentPrivacy: z.boolean(),
  consentContact: z.boolean(),
  source: z.string().max(60).optional(),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  landingPageSource: z.string().optional(),
  referral: z.string().max(120).optional(),
});

// Rate limiting sederhana in-memory per IP. Untuk produksi multi-instance,
// ganti dengan Upstash Ratelimit atau layanan serupa.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const timestamps = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Data tidak valid", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  if (!data.consentPrivacy) {
    return NextResponse.json({ error: "Persetujuan kebijakan privasi wajib dicentang." }, { status: 400 });
  }

  const [inserted] = await db
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
      leadCode: "TEMP", // diisi ulang di bawah setelah id tersedia
    })
    .returning();

  const leadCode = generateLeadCode(inserted.id);
  await db.update(leads).set({ leadCode }).where(eq(leads.id, inserted.id));

  await db.insert(leadActivities).values({
    leadId: inserted.id,
    type: "perubahan_status",
    content: `Lead masuk dari ${data.source ?? "landing_page"}`,
    newStatus: "lead_baru",
  });

  return NextResponse.json({ ok: true, leadCode }, { status: 201 });
}
