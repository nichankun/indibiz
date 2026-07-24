import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { getSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ACTION_BADGE_VARIANT: Record<string, "default" | "accent" | "secondary" | "outline"> = {
  login: "secondary",
  create: "accent",
  update: "outline",
  status_change: "default",
  assign: "outline",
  activate: "secondary",
  deactivate: "outline",
};

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "admin")) {
    redirect("/admin");
  }

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = 50;

  const logs = await db.query.auditLogs.findMany({
    with: { user: true },
    orderBy: desc(auditLogs.createdAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Audit Log</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Riwayat aktivitas internal: login, perubahan status lead, perubahan harga paket, dan manajemen akun.
        </p>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Entitas</TableHead>
              <TableHead>Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-[var(--muted-foreground)]">
                  Belum ada aktivitas tercatat.
                </TableCell>
              </TableRow>
            )}
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-xs text-[var(--muted-foreground)]">
                  {new Date(log.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-sm font-medium">{log.user?.name ?? "Sistem"}</TableCell>
                <TableCell>
                  <Badge variant={ACTION_BADGE_VARIANT[log.action] ?? "outline"} className="text-[10px] capitalize">
                    {log.action.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs capitalize text-[var(--muted-foreground)]">
                  {log.entityType}
                  {log.entityId ? ` #${log.entityId}` : ""}
                </TableCell>
                <TableCell className="text-sm">{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex justify-end gap-2 text-sm">
        {page > 1 && (
          <a href={`/admin/audit-log?page=${page - 1}`} className="text-[var(--accent)] hover:underline">
            &larr; Halaman sebelumnya
          </a>
        )}
        {logs.length === pageSize && (
          <a href={`/admin/audit-log?page=${page + 1}`} className="text-[var(--accent)] hover:underline">
            Halaman berikutnya &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
