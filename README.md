# Indibiz Lead System

Landing page pemasaran Indibiz dan dashboard internal untuk mengelola paket,
lead, tindak lanjut, analitik, dan audit log. Aplikasi menggunakan Next.js App
Router, TypeScript, Tailwind CSS v4, komponen shadcn/ui, Drizzle ORM, dan
PostgreSQL.

## Persyaratan

- Node.js 20.9 atau lebih baru
- pnpm
- PostgreSQL

Dependensi proyek sudah dikelola melalui `pnpm-lock.yaml`. Jangan menjalankan
inisialisasi Next.js, shadcn/ui, atau Drizzle dari awal pada proyek ini.

## Konfigurasi

Salin `.env.example` menjadi `.env`, lalu isi nilai yang sesuai. Nilai penting:

- `DATABASE_URL`: koneksi PostgreSQL.
- `AUTH_SECRET`: secret acak minimal 32 karakter.
- `NEXT_PUBLIC_SITE_URL`: origin produksi tanpa path tambahan.
- `NEXT_PUBLIC_BUSINESS_NAME`: nama badan usaha/operator yang benar untuk
  metadata dan structured data.
- `NEXT_PUBLIC_SALES_PHONE`: nomor WhatsApp dalam format internasional.
- `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD`: hanya dibutuhkan saat seed;
  password harus minimal 12 karakter.

Kontak sales di landing page menggunakan tautan WhatsApp langsung dan tidak
membutuhkan WhatsApp Business API token. Pastikan `NEXT_PUBLIC_SALES_PHONE`
berisi nomor WhatsApp admin dalam format internasional.

## Perintah

```bash
pnpm dev          # development server
pnpm lint         # ESLint
pnpm typecheck    # pemeriksaan TypeScript
pnpm check        # lint + typecheck
pnpm build        # production build
pnpm db:generate  # membuat migration dari perubahan schema
pnpm db:migrate   # menjalankan migration
pnpm db:push      # sinkronisasi schema secara langsung setelah review diff
pnpm db:studio    # membuka Drizzle Studio
pnpm db:seed      # upsert paket awal dan akun admin dari environment
```

Untuk database kosong, jalankan `pnpm db:migrate` lalu `pnpm db:seed`.
Migration `drizzle/0000_baseline.sql` berisi schema awal lengkap dan ditujukan
untuk database kosong. Pada database lama yang tabelnya sudah ada, buat backup
dan baseline riwayat migration terlebih dahulu; jangan menjalankan migration
awal itu secara buta. Review perubahan sebelum memakai `pnpm db:push`.

## Route utama

- `/`: landing page, paket aktif, dan konsultasi langsung melalui WhatsApp.
- Homepage menampilkan kawasan nasional dan badge DIY Yogyakarta; konsultasi
  pendaftaran berfokus ke wilayah tersebut. Ketersediaan alamat
  ditanyakan kepada admin melalui WhatsApp, bukan pengecekan otomatis di situs.
- `/indibiz/[city]`: landing page area layanan prioritas DIY Yogyakarta (Kota
  Yogyakarta, Sleman, Bantul, Kulon Progo, dan Gunungkidul).
- `/privacy`: kebijakan privasi untuk kontak melalui WhatsApp.
- `/admin/login`: login dashboard, termasuk langkah verifikasi TOTP bila aktif.
- `/admin`: ringkasan dashboard.
- `/admin/leads`: daftar, detail, status, follow-up, dan ekspor lead.
- `/admin/packages`: pengelolaan harga dan promo paket.
- `/admin/analytics`: analitik sumber dan funnel lead.
- `/admin/audit-log`: riwayat aktivitas administratif.

## Catatan produksi

- Gunakan HTTPS dan pastikan Cloudflare/origin melayani aplikasi dengan sehat.
- Gunakan rate limiter bersama (Redis/layanan sejenis) bila deploy menjalankan
  lebih dari satu instance; limiter bawaan hanya melindungi satu proses.
- Batasi akses database, lakukan backup rutin, dan rotasi secret secara aman.
- Konten halaman kota harus dikembangkan dengan informasi lokal yang nyata dan
  unik; template nama kota saja tidak cukup untuk SEO lokal berkualitas tinggi.
