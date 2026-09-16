import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/database/schema";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from "@/lib/utils";
import { getSession } from "@/lib/session";

type SearchParams = {
  q?: string;
  status?: string;
};

async function getLeads(searchParams: SearchParams) {
  const conditions = [];

  if (searchParams.status && LEAD_STATUS_ORDER.includes(searchParams.status as (typeof LEAD_STATUS_ORDER)[number])) {
    conditions.push(eq(leads.status, searchParams.status as typeof leads.$inferSelect.status));
  }

  if (searchParams.q) {
    conditions.push(or(ilike(leads.name, `%${searchParams.q}%`), ilike(leads.whatsapp, `%${searchParams.q}%`)));
  }

  return db.query.leads.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      package: { columns: { name: true } },
      assignedSales: { columns: { name: true } },
    },
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
  const [leadList, session] = await Promise.all([getLeads(params), getSession()]);
  const canWriteAll = session?.role === "admin" || session?.role === "super_admin";
  const canExport = canWriteAll;
  const selectedStatus = params.status && LEAD_STATUS_ORDER.includes(params.status as (typeof LEAD_STATUS_ORDER)[number])
    ? params.status
    : "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Manajemen Lead</h1>
          <p className="text-sm text-muted-foreground">{leadList.length} lead ditampilkan</p>
        </div>
        
        {canExport && (
          <Button variant="outline" asChild>
            <a href={`/api/leads/export${selectedStatus !== "all" ? `?status=${selectedStatus}` : ""}`}>
              Export CSV
            </a>
          </Button>
        )}
      </div>

      <Card className="p-4">
        <form className="flex flex-wrap items-center gap-3" method="get">
          <Input name="q" placeholder="Cari nama atau WhatsApp..." defaultValue={params.q} className="max-w-xs" />
          
          <Select name="status" defaultValue={selectedStatus}>
            <SelectTrigger
              aria-label="Filter status"
              className="h-10 min-w-44 rounded-md border-input bg-background px-3 py-2 text-foreground ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
            {LEAD_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {LEAD_STATUS_LABEL[s]}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>
          
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
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada lead yang cocok dengan filter ini.
              </TableCell>
            </TableRow>
          )}
          {leadList.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <Link href={`/admin/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                  {lead.name}
                </Link>
                <div className="text-xs text-muted-foreground">{lead.leadCode}</div>
              </TableCell>
              <TableCell className="text-sm">
                {lead.whatsapp}
                <div className="text-xs text-muted-foreground">{lead.city}</div>
              </TableCell>
              <TableCell className="text-sm">{lead.package?.name ?? "-"}</TableCell>
              <TableCell className="text-sm">{lead.assignedSales?.name ?? "Belum ditugaskan"}</TableCell>
              <TableCell>
                {canWriteAll || (session?.role === "sales" && lead.assignedSalesId === session.userId) ? (
                  <LeadStatusSelect leadId={lead.id} status={lead.status} />
                ) : (
                  <Badge variant="outline">{LEAD_STATUS_LABEL[lead.status]}</Badge>
                )}
              </TableCell>
              <TableCell className="text-xs capitalize text-muted-foreground">
                {(lead.source ?? "-").replace(/_/g, " ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
