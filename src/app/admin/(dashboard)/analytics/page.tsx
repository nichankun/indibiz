import { db } from "@/db";
import { leads } from "@/db/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FunnelChart, type ChannelFunnelRow } from "@/components/admin/funnel-chart";

const DIHUBUNGI_STATUSES = new Set([
  "sudah_dihubungi",
  "menunggu_survey",
  "survey_dijadwalkan",
  "area_tercover",
  "tidak_tercover",
  "menunggu_pembayaran",
  "pemasangan_dijadwalkan",
  "berhasil_dipasang",
  "selesai",
]);

const SURVEY_STATUSES = new Set([
  "menunggu_survey",
  "survey_dijadwalkan",
  "area_tercover",
  "menunggu_pembayaran",
  "pemasangan_dijadwalkan",
  "berhasil_dipasang",
  "selesai",
]);

const PEMASANGAN_STATUSES = new Set(["pemasangan_dijadwalkan", "berhasil_dipasang", "selesai"]);

async function getFunnelByChannel(): Promise<ChannelFunnelRow[]> {
  const allLeads = await db.select({ source: leads.source, utmSource: leads.utmSource, status: leads.status }).from(leads);

  const byChannel = new Map<string, ChannelFunnelRow>();

  for (const lead of allLeads) {
    const channel = lead.utmSource || lead.source || "Lainnya";
    const key = channel.replace(/_/g, " ");

    if (!byChannel.has(key)) {
      byChannel.set(key, { channel: key, totalLead: 0, dihubungi: 0, survey: 0, pemasangan: 0 });
    }

    const row = byChannel.get(key)!;
    row.totalLead += 1;
    if (DIHUBUNGI_STATUSES.has(lead.status)) row.dihubungi += 1;
    if (SURVEY_STATUSES.has(lead.status)) row.survey += 1;
    if (PEMASANGAN_STATUSES.has(lead.status)) row.pemasangan += 1;
  }

  return Array.from(byChannel.values()).sort((a, b) => b.totalLead - a.totalLead);
}

export default async function AnalyticsPage() {
  const funnelData = await getFunnelByChannel();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Funnel Konversi per Channel</h1>
        <p className="text-sm text-muted-foreground">
          Membandingkan performa tiap sumber lead (UTM source / channel) di sepanjang pipeline.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelChart data={funnelData} />
        </CardContent>
      </Card>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Total Lead</TableHead>
              <TableHead>Sudah Dihubungi</TableHead>
              <TableHead>Tahap Survey</TableHead>
              <TableHead>Pemasangan/Selesai</TableHead>
              <TableHead>Conversion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funnelData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Belum ada data lead.
                </TableCell>
              </TableRow>
            )}
            {funnelData.map((row) => (
              <TableRow key={row.channel}>
                <TableCell className="font-medium capitalize">{row.channel}</TableCell>
                <TableCell>{row.totalLead}</TableCell>
                <TableCell>{row.dihubungi}</TableCell>
                <TableCell>{row.survey}</TableCell>
                <TableCell>{row.pemasangan}</TableCell>
                <TableCell>
                  {row.totalLead > 0 ? Math.round((row.pemasangan / row.totalLead) * 100) : 0}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
