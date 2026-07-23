"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users, auditLogs } from "@/db/schema";
import { getSession } from "@/lib/session";

function assertSuperAdmin(role: string) {
  if (role !== "super_admin") {
    throw new Error("Hanya Super Admin yang dapat mengelola akun pengguna");
  }
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

  const existing = await db.query.users.findFirst({ where: eq(users.email, data.email) });
  if (existing) throw new Error("Email sudah terdaftar");

  const passwordHash = await bcrypt.hash(data.password, 10);

  const [created] = await db
    .insert(users)
    .values({ name: data.name, email: data.email, passwordHash, role: data.role })
    .returning();

  await db.insert(auditLogs).values({
    userId: session.userId,
    action: "create",
    entityType: "user",
    entityId: created.id,
    description: `${session.name} membuat akun baru: ${data.name} (${data.role})`,
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

  await db.update(users).set({ isActive, updatedAt: new Date() }).where(eq(users.id, userId));

  await db.insert(auditLogs).values({
    userId: session.userId,
    action: isActive ? "activate" : "deactivate",
    entityType: "user",
    entityId: userId,
    description: `${session.name} ${isActive ? "mengaktifkan" : "menonaktifkan"} akun #${userId}`,
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

  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));

  await db.insert(auditLogs).values({
    userId: session.userId,
    action: "update",
    entityType: "user",
    entityId: userId,
    description: `${session.name} mengubah role akun #${userId} menjadi ${role}`,
  });

  revalidatePath("/admin/users");
}
