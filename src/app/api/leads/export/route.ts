import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/database/schema";
import { getSession } from "@/lib/session";

function toCsvValue(value: unknown) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");

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
