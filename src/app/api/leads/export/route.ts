import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/database/schema";
import { getSession } from "@/lib/session";
import { LEAD_STATUS_ORDER } from "@/lib/utils";

const EXPORT_ALLOWED_ROLES = ["super_admin", "admin"];

// Netralkan awalan karakter formula (=, +, -, @) supaya tidak dieksekusi
// sebagai formula saat file dibuka di Excel/Google Sheets (CSV/Formula
// Injection), lalu escape tanda kutip seperti biasa.
function toCsvValue(value: unknown) {
  let str = String(value ?? "");
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  if (!EXPORT_ALLOWED_ROLES.includes(session.role)) {
    return NextResponse.json({ error: "Anda tidak diizinkan mengekspor data lead" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status");

  if (status && !LEAD_STATUS_ORDER.includes(status as (typeof LEAD_STATUS_ORDER)[number])) {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  const rows = await db.query.leads.findMany({
    where: status ? eq(leads.status, status as typeof leads.$inferSelect.status) : undefined,
    with: { package: true, assignedSales: true },
  });

  const header = [
    "Lead Code",
    "Nama",
    "WhatsApp",
    "Email",
    "Kota",
    "Kecamatan",
    "Paket",
    "Status",
    "Sales",
    "Sumber",
    "UTM Source",
    "UTM Campaign",
    "Dibuat",
  ];

  const csvRows = rows.map((lead) =>
    [
      lead.leadCode,
      lead.name,
      lead.whatsapp,
      lead.email ?? "",
      lead.city ?? "",
      lead.district ?? "",
      lead.package?.name ?? "",
      lead.status,
      lead.assignedSales?.name ?? "",
      lead.source ?? "",
      lead.utmSource ?? "",
      lead.utmCampaign ?? "",
      lead.createdAt.toISOString(),
    ]
      .map(toCsvValue)
      .join(",")
  );

  const csv = [header.map(toCsvValue).join(","), ...csvRows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-export-${Date.now()}.csv"`,
    },
  });
}