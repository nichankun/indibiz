import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, auditLogs } from "@/db/database/schema";
import {
  clearPendingTwoFactorToken,
  createPendingTwoFactorToken,
  createSession,
} from "@/lib/session";
import { getClientIp } from "@/lib/client-ip";
import { consumeRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
});

const dummyPasswordHash = bcrypt.hash("invalid-login-placeholder", 10);

export async function POST(request: NextRequest) {
  const rateLimit = consumeRateLimit({
    key: `login:${getClientIp(request)}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan login. Silakan coba lagi nanti." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Email atau kata sandi tidak valid." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });

  // Bandingkan juga untuk akun yang tidak ditemukan agar timing respons lebih seragam.
  const validPassword = await bcrypt.compare(
    password,
    user?.passwordHash ?? (await dummyPasswordHash)
  );
  if (!user || !user.isActive || !validPassword) {
    return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
  }

  if (user.twoFactorEnabled) {
    await createPendingTwoFactorToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    return NextResponse.json({ ok: true, requiresTwoFactor: true });
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
    description: `${user.name} login ke dashboard admin`,
  });

  return NextResponse.json({ ok: true, role: user.role });
}
