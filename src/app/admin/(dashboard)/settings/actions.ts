"use server";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, auditLogs } from "@/db/database/schema";
import { getSession } from "@/lib/session";
import { generateTwoFactorSecret, generateQrCodeDataUrl, verifyTwoFactorCode } from "@/lib/twofactor";

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
  if (!user) throw new Error("Akun tidak ditemukan");

  const validCurrent = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validCurrent) throw new Error("Kata sandi saat ini salah");

  if (newPassword.length < 8) throw new Error("Kata sandi baru minimal 8 karakter");

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));

  await db.insert(auditLogs).values({
    userId: user.id,
    action: "update",
    entityType: "user",
    entityId: user.id,
    description: `${user.name} mengganti kata sandi akun sendiri`,
  });
}

export async function startTwoFactorSetup() {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  const secret = generateTwoFactorSecret();
  const qrDataUrl = await generateQrCodeDataUrl(session.email, secret);

  // Simpan secret sementara (belum aktif) — diaktifkan setelah kode pertama dikonfirmasi
  await db.update(users).set({ twoFactorSecret: secret, twoFactorEnabled: false }).where(eq(users.id, session.userId));

  return { secret, qrDataUrl };
}

export async function confirmTwoFactorSetup(code: string) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
  if (!user?.twoFactorSecret) throw new Error("Silakan mulai proses aktivasi 2FA terlebih dahulu");

  const valid = verifyTwoFactorCode(user.email, user.twoFactorSecret, code);
  if (!valid) throw new Error("Kode tidak valid, coba lagi");

  await db.update(users).set({ twoFactorEnabled: true, updatedAt: new Date() }).where(eq(users.id, user.id));

  await db.insert(auditLogs).values({
    userId: user.id,
    action: "update",
    entityType: "user",
    entityId: user.id,
    description: `${user.name} mengaktifkan 2FA pada akunnya`,
  });
}

export async function disableTwoFactor(currentPassword: string) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
  if (!user) throw new Error("Akun tidak ditemukan");

  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validPassword) throw new Error("Kata sandi salah");

  await db
    .update(users)
    .set({ twoFactorEnabled: false, twoFactorSecret: null, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  await db.insert(auditLogs).values({
    userId: user.id,
    action: "update",
    entityType: "user",
    entityId: user.id,
    description: `${user.name} menonaktifkan 2FA pada akunnya`,
  });
}
