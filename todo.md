# TODO — Agregator Jadwal Nonton (Film & Bola)

Diturunkan dari [prd.md](prd.md). Kerjakan berurutan per fase — jangan lompat ke fase berikutnya sebelum diminta.

## Fase 1 — Persiapan & Tampilan Dasar
Status: **Sebagian selesai — menunggu kredensial Supabase dari kamu**

**Setup Proyek & Database**
- [x] Install Node.js dan siapkan editor kode
- [x] Buat project baru dengan Next.js (git lokal sudah terinisialisasi otomatis)
- [x] Hubungkan project ke GitHub — https://github.com/guruhmandala9-create/film-dan-bola
- [ ] Buat akun Supabase, hubungkan ke Next.js — menunggu kamu buat project & kirim Project URL + anon key
- [ ] Rancang skema tabel awal (users, films, matches, watchlist, comments)
- [x] Deploy versi kosong/awal proyek ke hosting (Vercel) — live di https://jadwalnonton.vercel.app

**Kerangka Tampilan**
- [x] Buat layout utama (header, navigasi, footer)
- [x] Buat halaman kosong: Beranda, Jadwal Film, Jadwal Bola, Kalender, Profil
- [x] Tentukan warna, font, dan gaya visual dasar (brand sederhana — aksen oranye untuk film, hijau untuk bola)
- [x] Pastikan tampilan responsif (diverifikasi di viewport desktop 1280px dan mobile 375px, termasuk menu hamburger)

## Fase 2 — Autentikasi & Data Inti
Status: belum dimulai

**Autentikasi & Onboarding**
- [ ] Buat halaman sign up dan login (email + Google)
- [ ] Buat sistem sesi login dan tombol logout
- [ ] Buat alur onboarding: kota domisili, tim bola favorit, genre film favorit
- [ ] Simpan preferensi onboarding ke database, terhubung ke akun pengguna

**Panel Admin Sederhana**
- [ ] Buat halaman admin internal (akses terbatas) untuk kelola data film & pertandingan
- [ ] Input data awal: film 1–2 kota besar, jadwal 2–3 liga populer

**Halaman Jadwal Film & Bola**
- [ ] Daftar film tayang + filter kota/bioskop + detail film
- [ ] Daftar pertandingan + filter tim favorit + detail pertandingan

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
