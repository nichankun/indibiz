/**
 * Seed data paket berdasarkan price sheet Promo Indibiz Bundling Juni 2026.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../index";
import { packages, users } from "./schema";

// Data lengkap berdasarkan brosur
const BUNDLE_DATA = [
  {
    addon: "Netmonk HI",
    benefits: ["Monitoring Real-Time", "Visibilitas & Kendali Penuh", "Efisiensi Operasional & Keamanan"],
    basic: [
      { speed: 50, price: 376100 }, { speed: 75, price: 421100 }, { speed: 100, price: 496100, badge: "Paling Populer" },
      { speed: 150, price: 596100 }, { speed: 200, price: 731100 }, { speed: 300, price: 1006100 }
    ],
    bisnis: [
      { speed: 50, price: 411100 }, { speed: 75, price: 471100 }, { speed: 100, price: 591100, badge: "Paling Populer" },
      { speed: 150, price: 676100 }, { speed: 200, price: 846100 }, { speed: 300, price: 1186100 }
    ]
  },
  {
    addon: "OCA Interaction Lite",
    benefits: ["Balas pesan otomatis & interaktif", "Kumpulkan data dari pelanggan", "Pantau semua interaksi di satu dashboard"],
    basic: [
      { speed: 50, price: 424000 }, { speed: 75, price: 469000 }, { speed: 100, price: 544000, badge: "Paling Populer" },
      { speed: 150, price: 644000 }, { speed: 200, price: 779000 }, { speed: 300, price: 1054000 }
    ],
    bisnis: [
      { speed: 50, price: 459000 }, { speed: 75, price: 519000 }, { speed: 100, price: 639000, badge: "Paling Populer" },
      { speed: 150, price: 724000 }, { speed: 200, price: 894000 }, { speed: 300, price: 1234000 }
    ]
  },
  {
    addon: "Pijar Sekolah",
    benefits: ["Belajar Interaktif & Modern", "Konektivitas Andal & Terintegrasi", "Manajemen Sekolah Efisien"],
    basic: [
      { speed: 50, price: 875000 }, { speed: 75, price: 920000 }, { speed: 100, price: 995000, badge: "Paling Populer" },
      { speed: 150, price: 1095000 }, { speed: 200, price: 1230000 }, { speed: 300, price: 1505000 }
    ],
    bisnis: [
      { speed: 50, price: 910000 }, { speed: 75, price: 970000 }, { speed: 100, price: 1090000, badge: "Paling Populer" },
      { speed: 150, price: 1175000 }, { speed: 200, price: 1345000 }, { speed: 300, price: 1685000 }
    ]
  },
  {
    addon: "OCA Breach Checker",
    benefits: ["Cek Kebocoran Data Real-time", "Perlindungan Siber Ekstra", "Notifikasi Keamanan Dini"],
    basic: [
      { speed: 50, price: 350500 }, { speed: 75, price: 395500 }, { speed: 100, price: 470500, badge: "Paling Populer" },
      { speed: 150, price: 570500 }, { speed: 200, price: 705500 }, { speed: 300, price: 980500 }
    ],
    bisnis: [
      { speed: 50, price: 385500 }, { speed: 75, price: 445500 }, { speed: 100, price: 565500, badge: "Paling Populer" },
      { speed: 150, price: 650500 }, { speed: 200, price: 820500 }, { speed: 300, price: 1160500 }
    ]
  }
];

async function seed() {
  console.log("Menghapus data paket lama...");
  await db.delete(packages);

  let sortOrder = 0;

  console.log("Menambahkan paket Bundling Baru...");
  for (const bundle of BUNDLE_DATA) {
    // Generate paket Basic
    for (const pkg of bundle.basic) {
      await db.insert(packages).values({
        category: "basic",
        name: `Indibiz Basic ${pkg.speed} Mbps + ${bundle.addon}`,
        speedMbps: pkg.speed,
        normalPrice: String(pkg.price),
        promoPrice: null, // Sesuai brosur, harga pas (tidak ada coret)
        description: `Internet Basic hingga ${pkg.speed} Mbps dilengkapi dengan layanan ${bundle.addon}`,
        benefits: bundle.benefits,
        badge: pkg.badge ?? null,
        sortOrder: sortOrder++,
        isActive: true,
      });
    }

    // Generate paket Bisnis
    for (const pkg of bundle.bisnis) {
      await db.insert(packages).values({
        category: "bisnis",
        name: `Indibiz Bisnis ${pkg.speed} Mbps + ${bundle.addon}`,
        speedMbps: pkg.speed,
        normalPrice: String(pkg.price),
        promoPrice: null,
        description: `Internet Bisnis hingga ${pkg.speed} Mbps dilengkapi dengan layanan ${bundle.addon}`,
        benefits: bundle.benefits,
        badge: pkg.badge ?? null,
        sortOrder: sortOrder++,
        isActive: true,
      });
    }
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

  console.log(`Akun admin: ${defaultEmail} / ${defaultPassword}`);
  console.log("Seed selesai. Silakan refresh halaman.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});