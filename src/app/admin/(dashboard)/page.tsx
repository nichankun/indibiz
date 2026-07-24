import { db } from "@/db";
import { leads } from "@/db/database/schema";
import { count, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadsTrendChart } from "@/components/admin/leads-trend-chart";
import { LEAD_STATUS_LABEL } from "@/lib/utils";

async function getDailyTrend() {
  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const recentLeads = await db
    .select({ createdAt: leads.createdAt })
    .from(leads)
    .where(gte(leads.createdAt, since));

  const buckets = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    buckets.set(key, 0);
  }

  for (const lead of recentLeads) {
    const key = new Date(lead.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

async function getStats() {
  const totalLeads = await db.select({ count: count() }).from(leads);

  const byStatus = await db
    .select({ status: leads.status, count: count() })
    .from(leads)
    .groupBy(leads.status);

  const bySource = await db
    .select({ source: leads.source, count: count() })
    .from(leads)
    .groupBy(leads.source);

  const total = totalLeads[0]?.count ?? 0;
  const installed =
    byStatus
      .filter((s) => s.status === "berhasil_dipasang" || s.status === "selesai")
      .reduce((sum, s) => sum + s.count, 0) ?? 0;

  return {
    total,
    installed,
    conversionRate: total > 0 ? Math.round((installed / total) * 100) : 0,
    byStatus,
    bySource,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const trend = await getDailyTrend();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Ringkasan</h1>
        <p className="text-sm text-muted-foreground">Ikhtisar performa lead dan konversi.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Berhasil Dipasang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-bold">{stats.installed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-3xl font-bold">{stats.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tren Lead 14 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadsTrendChart data={trend} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead per Status Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.byStatus.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada data lead.</p>
            )}
            {stats.byStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-sm">
                <span>{LEAD_STATUS_LABEL[s.status] ?? s.status}</span>
                <span className="font-semibold">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead per Sumber</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.bySource.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada data lead.</p>
            )}
            {stats.bySource.map((s) => (
              <div key={s.source ?? "unknown"} className="flex items-center justify-between text-sm">
                <span className="capitalize">{(s.source ?? "tidak diketahui").replace(/_/g, " ")}</span>
                <span className="font-semibold">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
