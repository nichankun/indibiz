# Indibiz Lead System

Landing page + mini-CRM manajemen lead untuk penjualan paket Indibiz (Basic & Bisnis).
Dibangun dengan **Next.js 16**, **Tailwind CSS v4**, komponen ala **shadcn/ui**, dan **Drizzle ORM** (PostgreSQL).

## Menjalankan proyek ini

Karena kode ini ditulis di luar environment dengan akses internet, `node_modules`
belum ter-install. Jalankan langkah berikut di komputer/server Anda:

```bash
# 1. Install dependency
npm install

# 2. Siapkan database Postgres (lokal, Supabase, Neon, atau Vercel Postgres)
cp .env.example .env
# isi DATABASE_URL, AUTH_SECRET (openssl rand -base64 32), dan variabel lain di .env

# 3. Push schema ke database
npm run db:push

# 4. Isi data awal (paket harga + akun super admin)
npm run db:seed

# 5. Jalankan development server
npm run dev
```

Buka `http://localhost:3000` untuk landing page, dan `http://localhost:3000/admin/login`
untuk dashboard admin. Kredensial admin default akan ditampilkan di terminal
setelah `npm run db:seed` — **segera ganti password setelah login pertama**
(fitur ganti password belum ada di UI; untuk saat ini update langsung lewat
`npm run db:studio` atau tambahkan halaman "Ubah Password" di `/admin`).

## Struktur proyek

```
src/
  db/
    schema.ts        # Semua tabel: users, packages, leads, lead_activities, audit_logs
    seed.ts           # Data harga paket (dari price sheet Anda) + akun admin default
    index.ts          # Koneksi Drizzle
  lib/
    session.ts        # Auth berbasis JWT (jose) + cookie httpOnly
    utils.ts          # Formatter Rupiah, label status pipeline, dll
  components/
    ui/                # Primitif ala shadcn (Button, Card, Table, Dialog, Select, ...)
    landing/            # Hero, Packages, Coverage Checker, WhatsApp float, dll
    admin/               # Sidebar, status selector, form follow-up, edit paket
  app/
    page.tsx           # Landing page
    api/leads/          # Endpoint publik: submit lead + export CSV
    api/auth/            # Login/logout
    admin/
      login/page.tsx     # Halaman login (di luar proteksi middleware)
      (dashboard)/        # Route group — semua halaman di sini wajib login
        page.tsx           # Ringkasan KPI
        leads/              # Manajemen lead (tabel, filter, detail, follow-up)
        packages/            # Manajemen harga & promo paket
middleware.ts          # Proteksi route /admin/* berbasis JWT
```

## Yang sudah diimplementasikan (dari blueprint 8 area Anda)

- ✅ Landing page dengan sticky CTA, WhatsApp floating button, coverage checker,
  perbandingan paket Basic/Bisnis dengan harga real dari price sheet
- ✅ Form pendaftaran dengan tracking UTM source/medium/campaign + referral +
  consent checkbox (privasi & kontak)
- ✅ Auth berbasis role (super_admin/admin/sales/viewer) via JWT + middleware
- ✅ Pipeline lead 11 status (Lead Baru → ... → Selesai/Ditolak), bukan cuma 3 status
- ✅ Follow-up notes, riwayat aktivitas, reminder tanggal follow-up berikutnya
- ✅ Filter lead by status + search nama/WhatsApp, export CSV
- ✅ Manajemen harga & promo paket tanpa perlu developer (lewat dashboard)
- ✅ Audit log dasar (login, ubah status lead, ubah harga paket)
- ✅ Rate limiting sederhana di endpoint submit lead
- ✅ Manajemen akun tim (`/admin/users`) — Super Admin/Admin dapat menambah akun,
  ubah role, dan aktifkan/nonaktifkan akun (khusus Super Admin)
- ✅ Grafik tren lead 14 hari terakhir di halaman ringkasan (pakai Recharts)
- ✅ Halaman ubah kata sandi sendiri (`/admin/settings`)
- ✅ Autentikasi dua faktor / 2FA berbasis TOTP (`/admin/settings`) — kompatibel
  dengan Google Authenticator, Authy, dll. Login jadi 2 langkah kalau aktif
- ✅ Pin lokasi Google Maps di form pendaftaran — pelanggan bisa geser pin atau
  pakai lokasi GPS mereka; koordinat tersimpan di tabel `leads`
- ✅ Funnel konversi per channel (`/admin/analytics`) — membandingkan Total Lead
  → Sudah Dihubungi → Tahap Survey → Pemasangan/Selesai per UTM source
- ✅ Integrasi WhatsApp Business Platform (Meta Cloud API) — kirim template
  resmi ke pelanggan langsung dari halaman detail lead (`src/lib/whatsapp.ts`)
- ✅ Halaman Audit Log (`/admin/audit-log`, khusus Admin/Super Admin) — riwayat
  login, perubahan status lead, perubahan harga, dan manajemen akun

## Catatan setup untuk fitur baru

**Pin lokasi Google Maps** — isi `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` di `.env`
dengan API key yang sudah diaktifkan "Maps JavaScript API"-nya di Google Cloud
Console. Tanpa key ini, form pendaftaran tetap berfungsi normal (field alamat
teks tetap tersimpan), hanya peta pin yang tidak muncul.

**2FA** — tidak perlu setup tambahan, aktifkan langsung dari
`/admin/settings` setelah login. Simpan kode manual (secret) di tempat aman
sebagai cadangan jika ganti HP.

**WhatsApp Business API** — Anda perlu akun WhatsApp Business Platform resmi
(lewat Meta Business Suite atau BSP seperti Twilio/360dialog) dengan nomor
terverifikasi dan minimal satu template pesan yang sudah disetujui Meta. Isi
`WHATSAPP_API_TOKEN` dan `WHATSAPP_PHONE_NUMBER_ID` di `.env`, lalu masukkan
nama template yang sudah disetujui saat mengirim dari halaman detail lead.
Tanpa kredensial ini, tombol "Kirim Template WA" akan menampilkan pesan error
yang jelas alih-alih gagal diam-diam.

## Ide pengembangan lanjutan (opsional, di luar 8 area blueprint awal)

Semua 8 area dari blueprint awal + 5 item roadmap tambahan sudah
diimplementasikan. Beberapa ide lanjutan kalau sistem ini terus berkembang:

1. **Pemisahan Lead → Order → Customer** yang lebih formal sebagai tabel
   terpisah (saat ini status `berhasil_dipasang`/`selesai` masih dalam tabel
   `leads` yang sama — cukup untuk skala saat ini, tapi akan lebih rapi kalau
   volume pelanggan sudah besar)
2. **Backup database otomatis terjadwal** (mis. via cron job `pg_dump` atau
   fitur backup bawaan provider Postgres yang Anda pakai)
3. **CAPTCHA/anti-spam** tambahan di form publik (rate limiting sederhana
   sudah ada, tapi belum ada CAPTCHA)
4. **Webhook WhatsApp masuk** — saat ini sistem hanya mengirim pesan keluar;
   menerima balasan pelanggan otomatis butuh endpoint webhook terpisah dari
   Meta Cloud API

## Keamanan yang sudah diterapkan

- Password di-hash dengan bcrypt
- Session JWT httpOnly, secure di production
- Middleware memverifikasi token sebelum mengizinkan akses `/admin/*`
- Validasi input dengan Zod di semua API route
- Rate limiting dasar per IP di endpoint submit lead
- Role-based check di server actions (mis. hanya admin/super_admin yang bisa
  ubah harga paket)

Untuk produksi, tambahkan juga: HTTPS (biasanya otomatis di Vercel/hosting
modern), CAPTCHA di form publik, backup database terjadwal, dan pertimbangkan
rate limiter terdistribusi (mis. Upstash Ratelimit) jika deploy multi-instance.
