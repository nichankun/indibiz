import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq, gt } from "drizzle-orm";
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

  const headerLine = `${header.map(toCsvValue).join(",")}\n`;
  const statusFilter = status
    ? eq(leads.status, status as typeof leads.$inferSelect.status)
    : undefined;
  const pageSize = 1_000;

  // Stream per batch agar export besar tidak menampung seluruh lead di memory.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      let lastId = 0;

      try {
        controller.enqueue(encoder.encode(headerLine));

        while (true) {
          const cursorFilter = lastId > 0 ? gt(leads.id, lastId) : undefined;
          const where = statusFilter && cursorFilter
            ? and(statusFilter, cursorFilter)
            : statusFilter ?? cursorFilter;
          const rows = await db.query.leads.findMany({
            columns: {
              id: true,
              leadCode: true,
              name: true,
              whatsapp: true,
              email: true,
              city: true,
              district: true,
              status: true,
              source: true,
              utmSource: true,
              utmCampaign: true,
              createdAt: true,
            },
            where,
            orderBy: asc(leads.id),
            limit: pageSize,
            with: {
              package: { columns: { name: true } },
              assignedSales: { columns: { name: true } },
            },
          });

          if (rows.length === 0) break;

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

          controller.enqueue(encoder.encode(`${csvRows.join("\n")}\n`));
          lastId = rows[rows.length - 1].id;

          if (rows.length < pageSize) break;
        }

        controller.close();
      } catch (error) {
        console.error("Gagal mengekspor lead:", error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-export-${Date.now()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
