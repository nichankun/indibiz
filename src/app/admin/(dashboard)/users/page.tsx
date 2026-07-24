import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/database/schema";
import { getSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { UserActiveToggle } from "@/components/admin/user-active-toggle";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || (session.role !== "super_admin" && session.role !== "admin")) {
    redirect("/admin");
  }

  const isSuperAdmin = session.role === "super_admin";

  const allUsers = await db.query.users.findMany({ orderBy: desc(users.createdAt) });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Akun Tim</h1>
          <p className="text-sm text-muted-foreground">
            Kelola akses admin, sales, dan viewer.
            {!isSuperAdmin && " Hanya Super Admin yang dapat mengubah role/status."}
          </p>
        </div>
        {isSuperAdmin && <CreateUserDialog />}
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              {isSuperAdmin && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                  {user.id === session?.userId && (
                    <Badge variant="outline" className="ml-2 text-[10px]">
                      Anda
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell>
                  <UserRoleSelect userId={user.id} role={user.role} disabled={!isSuperAdmin || user.id === session?.userId} />
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "secondary" : "outline"}>
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                {isSuperAdmin && (
                  <TableCell className="text-right">
                    <UserActiveToggle userId={user.id} isActive={user.isActive} disabled={user.id === session?.userId} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
