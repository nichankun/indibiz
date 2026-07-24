import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { createSession, createPendingTwoFactorToken } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Email atau kata sandi tidak valid." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });

  // Pesan error digeneralisasi agar tidak membocorkan email mana yang terdaftar
  if (!user || !user.isActive) {
    return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
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

  await db.insert(auditLogs).values({
    userId: user.id,
    action: "login",
    entityType: "user",
    entityId: user.id,
    description: `${user.name} login ke dashboard admin`,
  });

  return NextResponse.json({ ok: true, role: user.role });
}
