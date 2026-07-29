"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packages, auditLogs } from "@/db/database/schema";
import { getSession } from "@/lib/session";

export async function updatePackagePricing(
  packageId: number,
  data: { normalPrice: number; promoPrice?: number; isActive: boolean; badge?: string }
) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  if (session.role !== "super_admin" && session.role !== "admin") {
    throw new Error("Anda tidak memiliki izin untuk mengubah harga paket");
  }

  if (!Number.isFinite(data.normalPrice) || data.normalPrice <= 0) {
    throw new Error("Harga normal harus berupa angka positif");
  }

  if (data.promoPrice !== undefined) {
    if (!Number.isFinite(data.promoPrice) || data.promoPrice <= 0) {
      throw new Error("Harga promo harus berupa angka positif");
    }
    if (data.promoPrice >= data.normalPrice) {
      throw new Error("Harga promo harus lebih kecil dari harga normal");
    }
  }

  const existing = await db.query.packages.findFirst({ where: eq(packages.id, packageId) });
  if (!existing) throw new Error("Paket tidak ditemukan");

  await db.transaction(async (tx) => {
    await tx
      .update(packages)
      .set({
        normalPrice: String(data.normalPrice),
        promoPrice: data.promoPrice ? String(data.promoPrice) : null,
        isActive: data.isActive,
        badge: data.badge || null,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, packageId));

    await tx.insert(auditLogs).values({
      userId: session.userId,
      action: "update",
      entityType: "package",
      entityId: packageId,
      description: `${session.name} memperbarui harga paket #${packageId}`,
    });
  });

  revalidatePath("/admin/packages");
  revalidatePath("/");
}