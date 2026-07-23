"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packages, auditLogs } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function updatePackagePricing(
  packageId: number,
  data: { normalPrice: number; promoPrice?: number; isActive: boolean; badge?: string }
) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  // Hanya admin & super_admin yang boleh mengubah harga
  if (session.role !== "super_admin" && session.role !== "admin") {
    throw new Error("Anda tidak memiliki izin untuk mengubah harga paket");
  }

  await db
    .update(packages)
    .set({
      normalPrice: String(data.normalPrice),
      promoPrice: data.promoPrice ? String(data.promoPrice) : null,
      isActive: data.isActive,
      badge: data.badge || null,
      updatedAt: new Date(),
    })
    .where(eq(packages.id, packageId));

  await db.insert(auditLogs).values({
    userId: session.userId,
    action: "update",
    entityType: "package",
    entityId: packageId,
    description: `${session.name} memperbarui harga paket #${packageId}`,
  });

  revalidatePath("/admin/packages");
  revalidatePath("/");
}
