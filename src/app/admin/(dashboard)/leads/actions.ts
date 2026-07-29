"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, leadActivities, auditLogs, users } from "@/db/database/schema";
import { getSession, hasPermission, type SessionPayload } from "@/lib/session";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";
import { LEAD_STATUS_ORDER } from "@/lib/utils";

type Lead = typeof leads.$inferSelect;

function assertLeadWriteAccess(session: SessionPayload, lead: Lead) {
  if (hasPermission(session.role, "leads:write")) return;

  if (hasPermission(session.role, "leads:write:assigned") && lead.assignedSalesId === session.userId) {
    return;
  }

  throw new Error("Anda tidak memiliki izin untuk mengubah lead ini");
}

async function getLeadOrThrow(leadId: number) {
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, leadId) });
  if (!lead) throw new Error("Lead tidak ditemukan");
  return lead;
}

export async function updateLeadStatus(leadId: number, newStatus: string, rejectionReason?: string) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  if (!LEAD_STATUS_ORDER.includes(newStatus as (typeof LEAD_STATUS_ORDER)[number])) {
    throw new Error("Status tidak valid");
  }

  const current = await getLeadOrThrow(leadId);
  assertLeadWriteAccess(session, current);

  const trimmedReason = rejectionReason?.trim();
  if (newStatus === "ditolak" && !trimmedReason) {
    throw new Error("Alasan penolakan wajib diisi");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(leads)
      .set({
        status: newStatus as typeof leads.$inferSelect.status,
        rejectionReason: newStatus === "ditolak" ? trimmedReason : null,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, leadId));

    await tx.insert(leadActivities).values({
      leadId,
      userId: session.userId,
      type: "perubahan_status",
      previousStatus: current.status,
      newStatus: newStatus as typeof leads.$inferSelect.status,
      content: newStatus === "ditolak" ? trimmedReason : undefined,
    });

    await tx.insert(auditLogs).values({
      userId: session.userId,
      action: "status_change",
      entityType: "lead",
      entityId: leadId,
      description: `${session.name} mengubah status Lead #${leadId} dari "${current.status}" menjadi "${newStatus}"`,
    });
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function assignSales(leadId: number, salesUserId: number) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  // Menugaskan lead ke sales lain butuh akses penuh, bukan sekadar
  // "leads:write:assigned" — kalau tidak, sales bisa memindahkan lead
  // orang lain ke dirinya sendiri.
  if (!hasPermission(session.role, "leads:write")) {
    throw new Error("Anda tidak memiliki izin untuk menugaskan lead");
  }

  await getLeadOrThrow(leadId);

  const salesUser = await db.query.users.findFirst({ where: eq(users.id, salesUserId) });
  if (!salesUser || !salesUser.isActive) {
    throw new Error("Akun sales tidak ditemukan atau tidak aktif");
  }
  if (salesUser.role !== "sales" && salesUser.role !== "admin" && salesUser.role !== "super_admin") {
    throw new Error("Akun tujuan bukan akun sales");
  }

  await db.transaction(async (tx) => {
    await tx.update(leads).set({ assignedSalesId: salesUserId, updatedAt: new Date() }).where(eq(leads.id, leadId));

    await tx.insert(auditLogs).values({
      userId: session.userId,
      action: "assign",
      entityType: "lead",
      entityId: leadId,
      description: `${session.name} menugaskan Lead #${leadId} ke sales ID ${salesUserId}`,
    });
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addFollowUpNote(leadId: number, content: string, nextFollowUpDate?: string) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  const trimmed = content.trim();
  if (!trimmed) throw new Error("Catatan tidak boleh kosong");

  const lead = await getLeadOrThrow(leadId);
  assertLeadWriteAccess(session, lead);

  let parsedDate: Date | undefined;
  if (nextFollowUpDate) {
    const candidate = new Date(nextFollowUpDate);
    if (Number.isNaN(candidate.getTime())) throw new Error("Tanggal follow-up tidak valid");
    parsedDate = candidate;
  }

  await db.transaction(async (tx) => {
    await tx.insert(leadActivities).values({
      leadId,
      userId: session.userId,
      type: "catatan",
      content: trimmed,
    });

    if (parsedDate) {
      await tx.update(leads).set({ nextFollowUpDate: parsedDate, updatedAt: new Date() }).where(eq(leads.id, leadId));
    }
  });

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function sendLeadWhatsAppTemplate(leadId: number, templateName: string, bodyParams: string[]) {
  const session = await getSession();
  if (!session) throw new Error("Tidak terautentikasi");

  const trimmedTemplate = templateName.trim();
  if (!trimmedTemplate) throw new Error("Nama template wajib diisi");

  const lead = await getLeadOrThrow(leadId);
  assertLeadWriteAccess(session, lead);

  const result = await sendWhatsAppTemplate(lead.whatsapp, trimmedTemplate, "id", bodyParams);

  await db.insert(leadActivities).values({
    leadId,
    userId: session.userId,
    type: "whatsapp",
    content: result.ok
      ? `Template "${trimmedTemplate}" terkirim (message id: ${result.messageId})`
      : `Gagal kirim template "${trimmedTemplate}": ${result.error}`,
  });

  if (!result.ok) throw new Error(result.error);

  revalidatePath(`/admin/leads/${leadId}`);
  return result;
}