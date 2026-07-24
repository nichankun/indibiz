import { redirect } from "next/navigation";
import Link from "next/link"; // PERBAIKAN: Gunakan Next.js Link untuk navigasi yang lebih cepat
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs } from "@/db/database/schema";
import { getSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button"; // PERBAIKAN: Impor buttonVariants untuk pagination

// PERBAIKAN: Menghapus variant "accent" yang tidak standar. 
// Menggunakan "destructive" untuk deactivate agar lebih logis secara visual.
const ACTION_BADGE_VARIANT: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  login: "secondary",
  create: "default",
  update: "outline",
  status_change: "default",
  assign: "outline",
  activate: "secondary",
  deactivate: "destructive",
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
        {/* PERBAIKAN: Tipografi standar Shadcn, menghapus font kustom */}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          Riwayat aktivitas internal: login, perubahan status lead, perubahan harga paket, dan manajemen akun.
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
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
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  Belum ada aktivitas tercatat.
                </TableCell>
              </TableRow>
            )}
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">{log.user?.name ?? "Sistem"}</TableCell>
                <TableCell>
                  <Badge variant={ACTION_BADGE_VARIANT[log.action] ?? "outline"} className="text-[10px] capitalize">
                    {log.action.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs capitalize text-muted-foreground">
                  {log.entityType}
                  {log.entityId ? ` #${log.entityId}` : ""}
                </TableCell>
                <TableCell className="text-sm text-foreground">{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* PERBAIKAN: Pagination diubah menggunakan buttonVariants agar terlihat seperti tombol rapi */}
      <div className="flex justify-end gap-2">
        {page > 1 && (
          <Link 
            href={`/admin/audit-log?page=${page - 1}`} 
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            &larr; Sebelumnya
          </Link>
        )}
        {logs.length === pageSize && (
          <Link 
            href={`/admin/audit-log?page=${page + 1}`} 
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Berikutnya &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}