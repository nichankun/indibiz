import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { getPendingTwoFactorToken, clearPendingTwoFactorToken, createSession } from "@/lib/session";
import { verifyTwoFactorCode } from "@/lib/twofactor";

const schema = z.object({ code: z.string().min(6).max(6) });

export async function POST(request: NextRequest) {
  const pending = await getPendingTwoFactorToken();
  if (!pending) {
    return NextResponse.json({ error: "Sesi login kedaluwarsa. Silakan login ulang." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Kode 2FA tidak valid." }, { status: 400 });
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, pending.userId) });
  if (!user || !user.isActive || !user.twoFactorSecret) {
    return NextResponse.json({ error: "Akun tidak ditemukan atau 2FA belum aktif." }, { status: 401 });
  }

  const valid = verifyTwoFactorCode(user.email, user.twoFactorSecret, parsed.data.code);
  if (!valid) {
    return NextResponse.json({ error: "Kode 2FA salah atau sudah kedaluwarsa." }, { status: 401 });
  }

  await clearPendingTwoFactorToken();
  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });

  await db.insert(auditLogs).values({
    userId: user.id,
    action: "login",
    entityType: "user",
    entityId: user.id,
    description: `${user.name} login ke dashboard admin (2FA)`,
  });

  return NextResponse.json({ ok: true, role: user.role });
}
