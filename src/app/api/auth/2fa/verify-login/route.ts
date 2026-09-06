import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, users } from "@/db/database/schema";
import {
  clearPendingTwoFactorToken,
  createSession,
  getPendingTwoFactorToken,
} from "@/lib/session";
import { verifyTwoFactorCode } from "@/lib/twofactor";
import { getClientIp } from "@/lib/client-ip";
import { consumeRateLimit } from "@/lib/rate-limit";

const verificationSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/),
});

export async function POST(request: NextRequest) {
  const pending = await getPendingTwoFactorToken();
  if (!pending) {
    return NextResponse.json(
      { error: "Sesi verifikasi sudah berakhir. Silakan login kembali." },
      { status: 401 }
    );
  }

  const rateLimit = consumeRateLimit({
    key: `2fa:${pending.userId}:${getClientIp(request)}`,
    limit: 8,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan kode. Silakan login kembali nanti." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = verificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Kode harus terdiri dari 6 angka." }, { status: 400 });
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, pending.userId) });
  if (!user?.isActive || !user.twoFactorEnabled || !user.twoFactorSecret) {
    await clearPendingTwoFactorToken();
    return NextResponse.json({ error: "Konfigurasi 2FA tidak valid." }, { status: 401 });
  }

  if (!verifyTwoFactorCode(user.email, user.twoFactorSecret, parsed.data.code)) {
    return NextResponse.json({ error: "Kode verifikasi salah atau sudah kedaluwarsa." }, { status: 401 });
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  await clearPendingTwoFactorToken();

  await db.insert(auditLogs).values({
    userId: user.id,
    action: "login",
    entityType: "user",
    entityId: user.id,
    description: `${user.name} login ke dashboard admin menggunakan 2FA`,
  });

  return NextResponse.json({ ok: true, role: user.role });
}
