"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, leadActivities, auditLogs } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function updateLeadStatus(leadId: number, newStatus: string, rejectionReason?: string) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  const current = await db.query.leads.findFirst({ where: eq(leads.id, leadId) });
  if (!current) throw new Error("Lead tidak ditemukan");

  await db
    .update(leads)
    .set({
      status: newStatus as typeof leads.$inferSelect.status,
      rejectionReason: newStatus === "ditolak" ? rejectionReason : null,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, leadId));

  await db.insert(leadActivities).values({
    leadId,
    userId: session.userId,
    type: "perubahan_status",
    previousStatus: current.status,
    newStatus: newStatus as typeof leads.$inferSelect.status,
    content: rejectionReason,
  });

  await db.insert(auditLogs).values({
    userId: session.userId,
    action: "status_change",
    entityType: "lead",
    entityId: leadId,
    description: `${session.name} mengubah status Lead #${leadId} dari "${current.status}" menjadi "${newStatus}"`,
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function assignSales(leadId: number, salesUserId: number) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  await db.update(leads).set({ assignedSalesId: salesUserId, updatedAt: new Date() }).where(eq(leads.id, leadId));

  await db.insert(auditLogs).values({
    userId: session.userId,
    action: "assign",
    entityType: "lead",
    entityId: leadId,
    description: `${session.name} menugaskan Lead #${leadId} ke sales ID ${salesUserId}`,
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addFollowUpNote(leadId: number, content: string, nextFollowUpDate?: string) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  await db.insert(leadActivities).values({
    leadId,
    userId: session.userId,
    type: "catatan",
    content,
  });

  if (nextFollowUpDate) {
    await db
      .update(leads)
      .set({ nextFollowUpDate: new Date(nextFollowUpDate), updatedAt: new Date() })
      .where(eq(leads.id, leadId));
  }

  revalidatePath(`/admin/leads/${leadId}`);
}
