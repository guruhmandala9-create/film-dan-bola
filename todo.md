# TODO — Agregator Jadwal Nonton (Film & Bola)

Diturunkan dari [prd.md](prd.md). Kerjakan berurutan per fase — jangan lompat ke fase berikutnya sebelum diminta.

## Fase 1 — Persiapan & Tampilan Dasar
Status: **Selesai**

**Setup Proyek & Database**
- [x] Install Node.js dan siapkan editor kode
- [x] Buat project baru dengan Next.js (git lokal sudah terinisialisasi otomatis)
- [x] Hubungkan project ke GitHub — https://github.com/guruhmandala9-create/film-dan-bola
- [x] Buat akun Supabase, hubungkan ke Next.js — project `qmmufzjffjfsrjkzjzvj`, client di `src/lib/supabase/` (browser/server/admin), env var terpasang di lokal & Vercel
- [x] Rancang skema tabel awal (profiles, films, matches, watchlist, comments, reactions) — lihat `supabase/schema.sql`
- [x] Jalankan `supabase/schema.sql` di Supabase — 6 tabel terverifikasi live lewat REST API
- [x] Deploy versi kosong/awal proyek ke hosting (Vercel) — live di https://jadwalnonton.vercel.app

**Kerangka Tampilan**
- [x] Buat layout utama (header, navigasi, footer)
- [x] Buat halaman kosong: Beranda, Jadwal Film, Jadwal Bola, Kalender, Profil
- [x] Tentukan warna, font, dan gaya visual dasar (brand sederhana — aksen oranye untuk film, hijau untuk bola)
- [x] Pastikan tampilan responsif (diverifikasi di viewport desktop 1280px dan mobile 375px, termasuk menu hamburger)

## Fase 2 — Autentikasi & Data Inti
Status: **Selesai**

**Autentikasi & Onboarding**
- [x] Buat halaman sign up dan login (email + Google) — `/login`, `/signup`, tombol Google (lihat catatan Login Google di bawah)
- [x] Buat sistem sesi login dan tombol logout — Supabase Auth + `@supabase/ssr`, middleware refresh sesi otomatis
- [x] Buat alur onboarding: kota domisili, tim bola favorit, genre film favorit — `/onboarding`
- [x] Simpan preferensi onboarding ke database — tersimpan ke tabel `profiles`

**Panel Admin Sederhana**
- [x] Buat halaman admin internal (akses terbatas) untuk kelola data film & pertandingan — `/admin`, digerbang oleh `profiles.is_admin`
- [x] Input data awal: film 1–2 kota besar, jadwal 2–3 liga populer — `supabase/migrations/0002_admin_and_seed.sql` sudah dijalankan, data terverifikasi live lewat REST API
- [x] Akun sudah dijadikan admin dan `/admin` terverifikasi bisa diakses

**Halaman Jadwal Film & Bola**
- [x] Daftar film tayang + filter kota/bioskop + detail film — data asli dari Supabase
- [x] Daftar pertandingan + filter tim favorit + detail pertandingan — data asli dari Supabase

**Login Google**
- [x] Setup OAuth Client ID/Secret di Google Cloud Console (project "Default Gemini Project")
- [x] Aktifkan provider Google di Supabase Dashboard > Authentication > Providers
- [x] Diverifikasi live di https://jadwalnonton.vercel.app/login — tombol "Lanjutkan dengan Google" berhasil redirect ke halaman sign-in Google tanpa error

## Fase 3 — Personalisasi & Interaksi Pengguna
Status: **Selesai**

**Watchlist & Kalender**
- [x] Tombol tandai pada setiap film dan pertandingan — kartu daftar & halaman detail
- [x] Halaman "Tontonan Saya" berisi daftar yang sudah ditandai — `/tontonan-saya`
- [x] Tampilan kalender gabungan (film + bola) berdasarkan jadwal yang ditandai — `/kalender`, agenda dikelompokkan per tanggal WIB

**Personalisasi & Reminder**
- [x] Prioritaskan homepage berdasarkan tim dan genre favorit pengguna — bagian "Untukmu" di Beranda
- [x] Sistem notifikasi email untuk jadwal yang ditandai — via Resend, endpoint `/api/cron/reminders`
- [x] Atur pengiriman reminder H-1 atau 1 jam sebelum jadwal — dipicu otomatis tiap 15 menit lewat cron-job.org, diverifikasi terkirim (1 email H-1 sukses saat uji coba)

**Infrastruktur reminder yang dipasang:**
- `supabase/migrations/0005_reminder_flags.sql` — kolom `reminded_h1`/`reminded_1h` di tabel watchlist
- Env var di Vercel: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`
- Cron eksternal di cron-job.org memanggil `https://jadwalnonton.vercel.app/api/cron/reminders` tiap 15 menit dengan header `Authorization: Bearer <CRON_SECRET>`

## Fase 4 — Pencarian & Komunitas Dasar
Status: belum dimulai

**Pencarian**
- [ ] Kolom pencarian judul film dan nama tim/liga

**Komentar Sederhana**
- [ ] Kolom komentar di halaman detail film dan pertandingan
- [ ] Reaksi emoji cepat (opsional)
- [ ] Fitur report/hide comment untuk moderasi dasar

## Fase 5 — Uji Coba & Rilis MVP
Status: belum dimulai

**Pengujian**
- [ ] Uji seluruh alur: onboarding → jadwal → tandai → reminder → komentar
- [ ] Uji tampilan di berbagai ukuran layar (HP, tablet, desktop)
- [ ] Perbaiki bug dan tampilan yang belum rapi

**Rilis**
- [ ] Deploy versi final ke domain produksi
- [ ] Undang sekelompok kecil pengguna awal (beta)
- [ ] Kumpulkan feedback awal sebagai bahan validasi sebelum lanjut ke V2

## Roadmap Setelah MVP (tidak wajib, tunggu instruksi)
- [ ] V2: perluasan kota/liga, room diskusi otomatis, affiliate tiket bioskop, rating & review
- [ ] V3: voice room, liga privat prediksi skor, membership premium, sponsorship
