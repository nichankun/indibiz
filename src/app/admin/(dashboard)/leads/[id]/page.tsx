import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { leads, leadActivities } from "@/db/database/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { FollowUpForm } from "@/components/admin/follow-up-form";
import { WhatsappTemplateDialog } from "@/components/admin/whatsapp-template-dialog";
import { formatRupiah, LEAD_STATUS_LABEL } from "@/lib/utils";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = Number(id);

  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, leadId),
    with: { package: true, assignedSales: true },
  });

  if (!lead) notFound();

  const activities = await db.query.leadActivities.findMany({
    where: eq(leadActivities.leadId, leadId),
    with: { user: true },
    orderBy: desc(leadActivities.createdAt),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          {/* PERBAIKAN: Hapus font-display, gunakan standar tipografi Shadcn */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">{lead.leadCode}</p>
        </div>
        <div className="flex items-center gap-2">
          <WhatsappTemplateDialog leadId={lead.id} leadName={lead.name} />
          <LeadStatusSelect leadId={lead.id} status={lead.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Data Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">WhatsApp</div>
                  {/* Pastikan teks menggunakan text-foreground agar kontras di Dark Mode */}
                  <span className="text-foreground">{lead.whatsapp}</span>
                </div>
              </div>
              {lead.email && (
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <span className="text-foreground">{lead.email}</span>
                  </div>
                </div>
              )}
              <div className="col-span-2 flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Alamat</div>
                  <span className="text-foreground">
                    {lead.address}, {lead.district}, {lead.city} {lead.postalCode}
                  </span>
                  {lead.latitude && lead.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${lead.latitude},${lead.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      // PERBAIKAN: Ganti text-accent dengan text-primary agar berwarna merah (Brand)
                      className="ml-2 text-xs font-medium text-primary hover:underline underline-offset-4"
                    >
                      Lihat pin lokasi
                    </a>
                  )}
                </div>
              </div>
              {lead.nextFollowUpDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Follow-up berikutnya</div>
                    <span className="text-foreground">
                      {new Date(lead.nextFollowUpDate).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tambah Catatan Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <FollowUpForm leadId={lead.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Aktivitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>
              )}
              {activities.map((activity) => (
                <div key={activity.id} className="border-l-2 border-border pl-3 text-sm">
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString("id-ID")} · {activity.user?.name ?? "Sistem"}
                  </div>
                  {/* Memastikan teks isi aktivitas kontras di mode gelap */}
                  <div className="mt-1 text-foreground">
                    {activity.type === "perubahan_status" && activity.newStatus ? (
                      <p>
                        Status diubah{" "}
                        {activity.previousStatus && (
                          <>
                            dari <strong>{LEAD_STATUS_LABEL[activity.previousStatus]}</strong>{" "}
                          </>
                        )}
                        menjadi <strong>{LEAD_STATUS_LABEL[activity.newStatus]}</strong>
                        {activity.content && ` — ${activity.content}`}
                      </p>
                    ) : (
                      <p>{activity.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paket Diminati</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {lead.package ? (
                <>
                  <div className="font-semibold text-foreground">{lead.package.name}</div>
                  <div className="text-muted-foreground">
                    {formatRupiah(lead.package.promoPrice ?? lead.package.normalPrice)}/bulan
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Belum memilih paket (dari coverage checker)</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracking Sumber</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <div>
                <span className="text-muted-foreground">Sumber: </span>
                <span className="text-foreground">{lead.source ?? "-"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">UTM Source: </span>
                <span className="text-foreground">{lead.utmSource ?? "-"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">UTM Campaign: </span>
                <span className="text-foreground">{lead.utmCampaign ?? "-"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Sales: </span>
                <span className="text-foreground">{lead.assignedSales?.name ?? "Belum ditugaskan"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}