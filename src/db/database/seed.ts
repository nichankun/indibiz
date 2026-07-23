/**
 * Seed data paket berdasarkan price sheet Indibiz Basic & Bisnis.
 * Jalankan: npm run db:seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../index";
import { packages, users } from "./schema";

const basicBenefits = [
  "Gratis instalasi & modem WiFi",
  "Unlimited kuota, tanpa FUP",
  "Bebas biaya berlangganan channel TV",
];

const bisnisBenefits = [
  "Gratis instalasi & perangkat",
  "IP Publik statis",
  "SLA garansi gangguan",
  "Dedicated akses layanan bisnis",
];

const basicPackages = [
  { speedMbps: 50, normalPrice: 360000, promoPrice: 320000 },
  { speedMbps: 75, normalPrice: 412500, promoPrice: 365000 },
  { speedMbps: 100, normalPrice: 500000, promoPrice: 440000, badge: "Paling Populer" },
  { speedMbps: 150, normalPrice: 615000, promoPrice: 540000 },
  { speedMbps: 200, normalPrice: 750000, promoPrice: 675000 },
  { speedMbps: 300, normalPrice: 1020000, promoPrice: 950000 },
];

const bisnisPackages = [
  { speedMbps: 50, normalPrice: 405000, promoPrice: 355000 },
  { speedMbps: 75, normalPrice: 472000, promoPrice: 415000 },
  { speedMbps: 100, normalPrice: 605000, promoPrice: 535000, badge: "Paling Populer" },
  { speedMbps: 150, normalPrice: 705000, promoPrice: 620000 },
  { speedMbps: 200, normalPrice: 890000, promoPrice: 790000 },
  { speedMbps: 300, normalPrice: 1220000, promoPrice: 1130000 },
];

async function seed() {
  console.log("Menghapus data paket lama...");
  await db.delete(packages);

  console.log("Menambahkan paket Basic...");
  for (const [i, pkg] of basicPackages.entries()) {
    await db.insert(packages).values({
      category: "basic",
      name: `Indibiz Basic ${pkg.speedMbps} Mbps`,
      speedMbps: pkg.speedMbps,
      normalPrice: String(pkg.normalPrice),
      promoPrice: String(pkg.promoPrice),
      description: `Internet rumah/usaha kecil hingga ${pkg.speedMbps} Mbps`,
      benefits: basicBenefits,
      badge: pkg.badge ?? null,
      sortOrder: i,
      isActive: true,
    });
  }

  console.log("Menambahkan paket Bisnis...");
  for (const [i, pkg] of bisnisPackages.entries()) {
    await db.insert(packages).values({
      category: "bisnis",
      name: `Indibiz Bisnis ${pkg.speedMbps} Mbps`,
      speedMbps: pkg.speedMbps,
      normalPrice: String(pkg.normalPrice),
      promoPrice: String(pkg.promoPrice),
      description: `Internet dedicated untuk kebutuhan bisnis hingga ${pkg.speedMbps} Mbps`,
      benefits: bisnisBenefits,
      badge: pkg.badge ?? null,
      sortOrder: i,
      isActive: true,
    });
  }

  console.log("Menambahkan akun super admin default...");
  const defaultEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@indibiz.local";
  const defaultPassword = process.env.SEED_ADMIN_PASSWORD ?? "GantiSegera123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  await db
    .insert(users)
    .values({
      name: "Super Admin",
      email: defaultEmail,
      passwordHash,
      role: "super_admin",
    })
    .onConflictDoNothing({ target: users.email });

  console.log(`Akun admin: ${defaultEmail} / ${defaultPassword} — SEGERA GANTI setelah login pertama.`);

  console.log("Seed selesai.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
