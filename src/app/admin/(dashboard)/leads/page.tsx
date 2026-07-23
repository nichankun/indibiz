import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from "@/lib/utils";

type SearchParams = {
  q?: string;
  status?: string;
};

async function getLeads(searchParams: SearchParams) {
  const conditions = [];

  if (searchParams.status) {
    conditions.push(eq(leads.status, searchParams.status as typeof leads.$inferSelect.status));
  }

  if (searchParams.q) {
    conditions.push(or(ilike(leads.name, `%${searchParams.q}%`), ilike(leads.whatsapp, `%${searchParams.q}%`)));
  }

  return db.query.leads.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: { package: true, assignedSales: true },
    orderBy: desc(leads.createdAt),
    limit: 100,
  });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const leadList = await getLeads(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Manajemen Lead</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{leadList.length} lead ditampilkan</p>
        </div>
        <Button variant="outline" asChild>
          <a href={`/api/leads/export${params.status ? `?status=${params.status}` : ""}`}>Export CSV</a>
        </Button>
      </div>

      <Card className="p-4">
        <form className="flex flex-wrap items-center gap-3" method="get">
          <Input name="q" placeholder="Cari nama atau WhatsApp..." defaultValue={params.q} className="max-w-xs" />
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="h-10 rounded-lg border border-[var(--border)] bg-white px-3 text-sm"
          >
            <option value="">Semua Status</option>
            {LEAD_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Filter
          </Button>
        </form>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Paket</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sumber</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadList.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-[var(--muted-foreground)]">
                Belum ada lead yang cocok dengan filter ini.
              </TableCell>
            </TableRow>
          )}
          {leadList.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Link href={`/admin/leads/${lead.id}`} className="font-medium text-[var(--primary)] hover:underline">
                  {lead.name}
                </Link>
                <div className="text-xs text-[var(--muted-foreground)]">{lead.leadCode}</div>
              </TableCell>
              <TableCell className="text-sm">
                {lead.whatsapp}
                <div className="text-xs text-[var(--muted-foreground)]">{lead.city}</div>
              </TableCell>
              <TableCell className="text-sm">{lead.package?.name ?? "-"}</TableCell>
              <TableCell className="text-sm">{lead.assignedSales?.name ?? "Belum ditugaskan"}</TableCell>
              <TableCell>
                <LeadStatusSelect leadId={lead.id} status={lead.status} />
              </TableCell>
              <TableCell className="text-xs capitalize text-[var(--muted-foreground)]">
                {(lead.source ?? "-").replace(/_/g, " ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
