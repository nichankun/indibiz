import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { TwoFactorSetup } from "@/components/admin/two-factor-setup";

export default async function SettingsPage() {
  const session = await getSession();
  const user = session ? await db.query.users.findFirst({ where: eq(users.id, session.userId) }) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Pengaturan Akun</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Kelola kata sandi dan keamanan login Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ganti Kata Sandi</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autentikasi Dua Faktor (2FA)</CardTitle>
        </CardHeader>
        <CardContent>
          <TwoFactorSetup initiallyEnabled={user?.twoFactorEnabled ?? false} />
        </CardContent>
      </Card>
    </div>
  );
}
