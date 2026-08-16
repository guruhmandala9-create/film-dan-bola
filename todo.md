# TODO — Agregator Jadwal Nonton (Film & Bola)

Diturunkan dari [prd.md](prd.md). Kerjakan berurutan per fase — jangan lompat ke fase berikutnya sebelum diminta.

## Fase 1 — Persiapan & Tampilan Dasar
Status: **Selesai**

**Setup Proyek & Database**
- [x] Install Node.js dan siapkan editor kode
- [x] Buat project baru dengan Next.js (git lokal sudah terinisialisasi otomatis)
- [x] Hubungkan project ke GitHub — https://github.com/guruhmandala9-create/film-dan-bola
- [x] Buat akun Supabase, hubungkan ke Next.js — project `qmmufzjffjfsrjkzjzvj`, client di `src/lib/supabase/client.ts`, env var terpasang di lokal & Vercel
- [x] Rancang skema tabel awal (profiles, films, matches, watchlist, comments, reactions) — lihat `supabase/schema.sql`
- [x] Jalankan `supabase/schema.sql` di Supabase — 6 tabel terverifikasi live lewat REST API
- [x] Deploy versi kosong/awal proyek ke hosting (Vercel) — live di https://jadwalnonton.vercel.app

**Kerangka Tampilan**
- [x] Buat layout utama (header, navigasi, footer)
- [x] Buat halaman kosong: Beranda, Jadwal Film, Jadwal Bola, Kalender, Profil
- [x] Tentukan warna, font, dan gaya visual dasar (brand sederhana — aksen oranye untuk film, hijau untuk bola)
- [x] Pastikan tampilan responsif (diverifikasi di viewport desktop 1280px dan mobile 375px, termasuk menu hamburger)

## Fase 2 — Autentikasi & Data Inti
Status: **Kode selesai — menunggu 2 langkah manual kamu di Supabase**

**Autentikasi & Onboarding**
- [x] Buat halaman sign up dan login (email + Google) — `/login`, `/signup`, tombol Google (butuh setup provider, lihat catatan di bawah)
- [x] Buat sistem sesi login dan tombol logout — Supabase Auth + `@supabase/ssr`, middleware refresh sesi otomatis
- [x] Buat alur onboarding: kota domisili, tim bola favorit, genre film favorit — `/onboarding`
- [x] Simpan preferensi onboarding ke database — tersimpan ke tabel `profiles`

**Panel Admin Sederhana**
- [x] Buat halaman admin internal (akses terbatas) untuk kelola data film & pertandingan — `/admin`, digerbang oleh `profiles.is_admin`
- [x] Input data awal: film 1–2 kota besar, jadwal 2–3 liga populer — disiapkan sebagai seed SQL di `supabase/migrations/0002_admin_and_seed.sql`
- [ ] **Aksi kamu:** jalankan `supabase/migrations/0002_admin_and_seed.sql` di Supabase SQL Editor (menambah kolom `is_admin`, kebijakan tulis admin, dan data awal film/pertandingan)
- [ ] **Aksi kamu:** setelah punya akun (daftar via `/signup`), jadikan akunmu admin lewat query di akhir file migrasi tadi (ganti dengan emailmu)

**Halaman Jadwal Film & Bola**
- [x] Daftar film tayang + filter kota/bioskop + detail film — data asli dari Supabase
- [x] Daftar pertandingan + filter tim favorit + detail pertandingan — data asli dari Supabase

**Catatan: Login Google**
Tombol "Lanjutkan dengan Google" sudah ada di kode, tapi providernya belum aktif di Supabase — perlu setup Google OAuth Client ID/Secret di Google Cloud Console lalu dimasukkan ke Supabase Dashboard > Authentication > Providers > Google. Ini butuh akses akun Google Cloud kamu, jadi ditunda dulu; login email/password sudah berfungsi penuh sebagai gantinya.

## Fase 3 — Personalisasi & Interaksi Pengguna
Status: belum dimulai

**Watchlist & Kalender**
- [ ] Tombol tandai pada setiap film dan pertandingan
- [ ] Halaman "Tontonan Saya" berisi daftar yang sudah ditandai
- [ ] Tampilan kalender gabungan (film + bola) berdasarkan jadwal yang ditandai

**Personalisasi & Reminder**
- [ ] Prioritaskan homepage berdasarkan tim dan genre favorit pengguna
- [ ] Sistem notifikasi (email/push sederhana) untuk jadwal yang ditandai
- [ ] Atur pengiriman reminder H-1 atau 1 jam sebelum jadwal

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
