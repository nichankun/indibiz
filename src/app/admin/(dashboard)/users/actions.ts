"use server";

import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, auditLogs } from "@/db/database/schema";
import { getSession } from "@/lib/session";

function assertSuperAdmin(role: string) {
  if (role !== "super_admin") {
    throw new Error("Hanya Super Admin yang dapat mengelola akun pengguna");
  }
}

async function getUserOrThrow(userId: number) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new Error("Akun tidak ditemukan");
  return user;
}

async function hasOtherActiveSuperAdmin(excludeUserId: number) {
  const other = await db.query.users.findFirst({
    where: and(eq(users.role, "super_admin"), eq(users.isActive, true), ne(users.id, excludeUserId)),
  });
  return Boolean(other);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "sales" | "viewer";
}) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");
  assertSuperAdmin(session.role);

  const email = data.email.trim().toLowerCase();

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new Error("Email sudah terdaftar");

  const passwordHash = await bcrypt.hash(data.password, 10);

  await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(users)
      .values({ name: data.name, email, passwordHash, role: data.role })
      .returning();

    await tx.insert(auditLogs).values({
      userId: session.userId,
      action: "create",
      entityType: "user",
      entityId: created.id,
      description: `${session.name} membuat akun baru: ${data.name} (${data.role})`,
    });
  });

  revalidatePath("/admin/users");
}

export async function toggleUserActive(userId: number, isActive: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");
  assertSuperAdmin(session.role);

  if (userId === session.userId) {
    throw new Error("Anda tidak dapat menonaktifkan akun Anda sendiri");
  }

  const target = await getUserOrThrow(userId);

  if (!isActive && target.role === "super_admin" && !(await hasOtherActiveSuperAdmin(userId))) {
    throw new Error("Tidak dapat menonaktifkan Super Admin terakhir yang aktif");
  }

  await db.transaction(async (tx) => {
    await tx.update(users).set({ isActive, updatedAt: new Date() }).where(eq(users.id, userId));

    await tx.insert(auditLogs).values({
      userId: session.userId,
      action: isActive ? "activate" : "deactivate",
      entityType: "user",
      entityId: userId,
      description: `${session.name} ${isActive ? "mengaktifkan" : "menonaktifkan"} akun #${userId}`,
    });
  });

  revalidatePath("/admin/users");
}

export async function changeUserRole(
  userId: number,
  role: "super_admin" | "admin" | "sales" | "viewer"
) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");
  assertSuperAdmin(session.role);

  const target = await getUserOrThrow(userId);

  if (
    target.role === "super_admin" &&
    role !== "super_admin" &&
    target.isActive &&
    !(await hasOtherActiveSuperAdmin(userId))
  ) {
    throw new Error("Tidak dapat menurunkan role Super Admin terakhir yang aktif");
  }

  await db.transaction(async (tx) => {
    await tx.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));

    await tx.insert(auditLogs).values({
      userId: session.userId,
      action: "update",
      entityType: "user",
      entityId: userId,
      description: `${session.name} mengubah role akun #${userId} menjadi ${role}`,
    });
  });

  revalidatePath("/admin/users");
}