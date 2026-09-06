import { asc } from "drizzle-orm";
import { db } from "@/db";
import { packages } from "@/db/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageEditDialog } from "@/components/admin/package-edit-dialog";
import { formatRupiah } from "@/lib/utils";
import { getSession } from "@/lib/session";

export default async function PackagesPage() {
  const [allPackages, session] = await Promise.all([
    db.query.packages.findMany({
    orderBy: [asc(packages.category), asc(packages.sortOrder)],
    }),
    getSession(),
  ]);
  const canEdit = session?.role === "admin" || session?.role === "super_admin";

  const basic = allPackages.filter((p) => p.category === "basic");
  const bisnis = allPackages.filter((p) => p.category === "bisnis");

  const sections = [
    { label: "Paket Basic", items: basic },
    { label: "Paket Bisnis", items: bisnis },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Paket &amp; Harga</h1>
        <p className="text-sm text-muted-foreground">
          Kelola harga normal, harga promo, dan visibilitas paket di landing page.
        </p>
      </div>

      {sections.map((section) => (
      
        <Card key={section.label} className="overflow-hidden">
          <CardHeader>
            <CardTitle>{section.label}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kecepatan</TableHead>
                  <TableHead>Harga Normal</TableHead>
                  <TableHead>Harga Promo</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.items.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium text-foreground">{pkg.speedMbps} Mbps</TableCell>
                    <TableCell>{formatRupiah(pkg.normalPrice)}</TableCell>
                    <TableCell>{pkg.promoPrice ? formatRupiah(pkg.promoPrice) : "-"}</TableCell>
                    <TableCell>
                      {pkg.badge ? <Badge variant="default">{pkg.badge}</Badge> : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? "secondary" : "outline"}>
                        {pkg.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {canEdit ? <PackageEditDialog pkg={pkg} /> : <span className="text-xs text-muted-foreground">Read-only</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
