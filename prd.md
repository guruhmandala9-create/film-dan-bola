# PRODUCT REQUIREMENTS DOCUMENT
## Agregator Jadwal Nonton
### Film Bioskop & Jadwal Sepak Bola dalam Satu Platform

**Versi Dokumen:** 1.0
**Tanggal:** 16 Agustus 2026
**Status:** Draft — Perencanaan MVP

---

## 1. Ringkasan Produk

Agregator Jadwal Nonton adalah platform web yang menyatukan dua kebutuhan hiburan yang selama ini tersebar di banyak sumber: jadwal tayang film bioskop dan jadwal pertandingan sepak bola. Produk ini menjawab masalah sehari-hari pengguna yang harus membuka beberapa aplikasi/situs berbeda hanya untuk tahu "film apa yang tayang minggu ini" dan "jam berapa tim favorit saya main".

Value proposition utama: **"Jangan sampai ketinggalan nonton — film atau bola."** Produk digabungkan dengan fitur reminder, kalender terpadu, dan ruang interaksi komunitas agar pengguna punya alasan untuk kembali secara rutin, bukan hanya sekali pakai.

### Model Monetisasi (arah jangka menengah)

- **Affiliate** — komisi dari redirect pembelian tiket bioskop
- **Iklan** — brand F&B dan olahraga
- **Membership premium** — bebas iklan dan fitur eksklusif
- **Sponsorship** — kemitraan brand untuk liga prediksi privat dan momen besar

---

## 2. Target Pengguna

### 2.1 Profil Pengguna Utama

Pekerja muda/urban di kota besar Indonesia yang memiliki dua minat hiburan sekaligus: menonton film di bioskop dan mengikuti liga sepak bola (lokal maupun internasional), namun kesulitan memantau jadwal keduanya karena tersebar di berbagai sumber.

### 2.2 Karakteristik

- Terbiasa menonton bioskop di akhir pekan
- Mengikuti minimal satu tim/liga sepak bola secara rutin
- Aktif menggunakan smartphone dan media sosial
- Menyukai interaksi/diskusi seputar hobi dengan sesama penggemar

### 2.3 Kebutuhan yang Dipecahkan

- Tidak mau ketinggalan jadwal tayang film atau pertandingan penting
- Ingin satu tempat rujukan, bukan berpindah-pindah aplikasi
- Ingin ada ruang berdiskusi dengan sesama penggemar film/bola

---

## 3. Daftar Fitur Utama (Versi Pertama / MVP)

Fitur-fitur berikut adalah cakupan wajib untuk versi pertama (V1), disusun berdasarkan prioritas validasi produk.

### 3.1 Jadwal Film

Menampilkan daftar film yang tayang minggu ini dan yang akan datang. Sumber data diambil dari API/scraping bioskop atau input manual di tahap awal. Dilengkapi filter berdasarkan kota/bioskop (mulai dari 1–2 kota besar, misalnya Jakarta), serta informasi dasar berupa judul, genre, jam tayang, dan nama bioskop.

### 3.2 Jadwal Sepak Bola

Menampilkan jadwal pertandingan dari liga-liga populer pilihan (mulai dari 2–3 liga, misalnya Liga 1, English Premier League, dan Liga Champions). Pengguna dapat memfilter berdasarkan tim favorit. Informasi yang ditampilkan meliputi nama tim, jam kick-off, dan saluran siaran (TV/streaming).

### 3.3 Reminder / Notifikasi

Pengguna dapat memilih film atau tim favorit untuk mendapatkan notifikasi otomatis, misalnya H-1 atau satu jam sebelum jadwal dimulai. Fitur ini menjadi inti retensi karena mendorong pengguna kembali membuka aplikasi.

### 3.4 Personalisasi Dasar

Saat onboarding, pengguna memilih tim sepak bola favorit dan genre film favorit. Halaman utama (homepage) kemudian menyesuaikan tampilan berdasarkan preferensi tersebut.

### 3.5 Kalender Gabungan

Tampilan kalender tunggal yang menggabungkan jadwal film dan jadwal pertandingan bola, sehingga pengguna dapat melihat dalam satu pandangan "minggu ini nonton apa saja".

### 3.6 Komentar Sederhana per Jadwal

Kolom komentar pada setiap entri jadwal film maupun pertandingan, mirip kolom komentar di bawah unggahan media sosial. Fitur ini dipilih sebagai bentuk interaksi komunitas paling ringan secara teknis (tidak membutuhkan infrastruktur real-time/websocket), namun cukup untuk memvalidasi apakah pengguna benar-benar ingin berinteraksi seputar konten yang sama.

- Reaksi cepat berupa emoji (🔥 😍 😴) sebagai pelengkap opsional
- Fitur report/hide comment untuk moderasi dasar (moderasi manual di tahap awal)

### 3.7 Autentikasi & Akun Pengguna

Pendaftaran dan masuk (sign up/login) menggunakan email atau akun Google. Fitur ini wajib ada karena seluruh fitur inti lain — personalisasi, reminder, watchlist, dan komentar — membutuhkan identitas pengguna agar data preferensi tersimpan dan bisa diakses kembali di sesi berikutnya.

### 3.8 Simpan/Tandai Jadwal (Watchlist)

Tombol "tandai" pada setiap film atau pertandingan agar masuk ke daftar tontonan pribadi pengguna. Fitur ini menjadi dasar dari fitur reminder (sistem hanya bisa mengingatkan jadwal yang sudah ditandai) dan sempat disebutkan dalam alur penggunaan harian, namun perlu ditegaskan sebagai fitur tersendiri karena menjadi penghubung antara jadwal, reminder, dan kalender gabungan.

### 3.9 Pencarian

Kolom pencarian sederhana untuk mencari judul film atau nama tim/liga secara langsung, sebagai pelengkap dari filter kota/liga. Tanpa fitur ini, pengguna yang sudah tahu apa yang dicari harus menelusuri daftar secara manual, yang kurang efisien terutama saat daftar film atau jadwal sudah banyak.

### 3.10 Panel Admin Sederhana (Manajemen Data Jadwal)

Halaman internal (tidak untuk pengguna umum) bagi tim pengelola produk untuk menambah, mengubah, atau menghapus data jadwal film dan pertandingan secara manual. Fitur ini penting di V1 karena sumber data jadwal masih berbasis input manual/semi-manual sebelum ada integrasi API berbayar — tanpa panel ini, pembaruan data akan bergantung sepenuhnya pada akses langsung ke database yang tidak praktis dan berisiko human error.

**Catatan penting:** room diskusi otomatis, live chat real-time, obrolan suara (voice room), dan grup komunitas permanen sengaja TIDAK dimasukkan ke V1 — lihat Bagian 6 untuk penjelasan lengkap.

---

## 4. Alur Pengguna (User Flow)

### 4.1 Alur Onboarding Pengguna Baru

1. Pengguna membuka web dan mendaftar/masuk (sign up / login)
2. Pengguna memilih kota domisili (untuk jadwal film)
3. Pengguna memilih tim sepak bola favorit (satu atau lebih)
4. Pengguna memilih genre film favorit
5. Sistem menampilkan homepage yang telah dipersonalisasi

### 4.2 Alur Penggunaan Harian

1. Pengguna membuka homepage dan melihat kalender gabungan minggu berjalan
2. Pengguna menandai film/pertandingan yang ingin ditonton
3. Sistem mengirim notifikasi reminder mendekati jadwal
4. Pengguna membuka detail jadwal, memberi komentar/reaksi
5. Setelah menonton, pengguna dapat kembali melihat komentar lain di jadwal yang sama

### 4.3 Alur Filter & Pencarian

1. Pengguna membuka halaman Jadwal Film atau Jadwal Bola
2. Pengguna menerapkan filter (kota/bioskop untuk film, liga/tim untuk bola)
3. Sistem menampilkan hasil sesuai filter
4. Pengguna dapat menyimpan filter sebagai preferensi default

---

## 5. Framework dan Database yang Digunakan

### 5.1 Framework: Next.js

Next.js dipilih sebagai framework utama karena beberapa pertimbangan yang relevan dengan kondisi tim (pemula non-IT, berkolaborasi dengan Claude Code):

- Framework berbasis JavaScript/React yang paling populer, sehingga dokumentasi dan referensi solusi sangat banyak tersedia
- Paling dikenali dengan baik oleh Claude Code, sehingga hasil kode cenderung lebih rapi dan minim error
- Mampu menangani tampilan (frontend) dan proses data (backend) dalam satu framework, sehingga tidak perlu mempelajari dua sistem terpisah
- Digunakan secara luas oleh produk-produk komersial berskala besar, sehingga tidak akan jadi hambatan saat produk berkembang

### 5.2 Database: Supabase

Supabase dipilih sebagai layanan database dan backend pendukung karena:

- Tidak memerlukan setup server sendiri — penting untuk tim non-IT
- Memiliki dashboard visual untuk melihat dan mengedit data secara langsung, tanpa perlu memahami bahasa database
- Tersedia paket gratis untuk tahap awal, dengan skema biaya yang menyesuaikan pertumbuhan pengguna

### 5.3 Model Kerja dengan Claude Code

- Pemilik produk menjelaskan kebutuhan fitur dalam bahasa sehari-hari
- Claude Code menuliskan kode berbasis Next.js
- Pemilik produk berfokus pada pengujian (testing) dan pemberian umpan balik, bukan penulisan kode manual

---

## 6. Batasan dan Hal yang Tidak Termasuk di Versi Pertama

Bagian ini menegaskan apa yang secara sengaja TIDAK dibangun di V1, agar tim fokus memvalidasi konsep inti terlebih dahulu sebelum berinvestasi pada fitur yang lebih kompleks dan mahal secara teknis.

| Fitur/Area | Alasan Ditunda dari V1 |
|---|---|
| Live chat real-time | Membutuhkan infrastruktur websocket dan moderasi real-time yang mahal; baru relevan setelah ada massa pengguna aktif harian yang stabil |
| Obrolan suara (voice room) | Kompleksitas dan biaya infrastruktur (WebRTC/media server) tinggi; berisiko sepi jika dibangun sebelum ada validasi demand dari fitur komentar teks |
| Room diskusi otomatis per topik | Ditunda ke V2 setelah komentar sederhana tervalidasi menunjukkan adanya minat interaksi |
| Grup komunitas permanen / forum | Baru bernilai setelah jumlah pengguna cukup besar untuk membuat grup ramai |
| Pembelian tiket langsung di platform | Cukup redirect/affiliate ke platform bioskop di tahap awal; integrasi pembayaran langsung ditunda ke V2 |
| Rating dan review film/pertandingan | Bukan kebutuhan inti untuk validasi awal; berpotensi menambah kompleksitas onboarding |
| Prediksi skor dan liga privat antar teman | Fitur gamifikasi ditunda ke V3 setelah basis pengguna dan engagement inti terbentuk |
| Cakupan kota dan liga yang luas | V1 fokus 1–2 kota besar dan 2–3 liga populer agar kualitas data terjaga sebelum ekspansi |
| Membership premium dan monetisasi penuh | Monetisasi bertahap; V1 fokus pada validasi retensi dan engagement, bukan pendapatan |
| Login sosial selain Google (Facebook, Apple, dll.) | V1 cukup email dan Google untuk menyederhanakan development; opsi lain ditambah sesuai kebutuhan pengguna |
| Panel admin dengan role/hak akses berjenjang | V1 cukup satu tingkat akses admin sederhana untuk tim internal kecil; pembagian role ditambah saat tim pengelola membesar |

Prinsip yang dipegang: jangan membangun fitur mahal (voice, real-time chat berskala besar) sebelum ada bukti nyata demand pada fitur yang lebih murah dan sederhana (komentar teks). Setiap fitur baru pada versi berikutnya harus didasarkan pada metrik validasi dari versi sebelumnya, bukan sekadar asumsi.

---

## RENCANA FASE PENGERJAAN

Agregator Jadwal Nonton — Film & Sepak Bola

Dokumen ini memecah PRD versi 1.0 menjadi 5 fase pengerjaan berurutan, dari fondasi teknis hingga rilis. Setiap fase dirancang agar bisa diselesaikan dalam waktu yang wajar bagi pemula sebelum lanjut ke fase berikutnya — kerjakan berurutan, jangan lompat.

### FASE 1 — Persiapan & Tampilan Dasar

Tujuan: menyiapkan fondasi teknis dan kerangka tampilan (UI shell) sebelum data sungguhan dimasukkan. Setelah fase ini selesai, proyek sudah berjalan, terhubung ke database, dan punya kerangka halaman yang bisa dinavigasi.

**Setup Proyek & Database**
- Install Node.js dan siapkan editor kode (VS Code direkomendasikan)
- Buat project baru dengan Next.js dan hubungkan ke GitHub
- Buat akun Supabase, hubungkan ke Next.js, dan rancang skema tabel awal (users, films, matches, watchlist, comments)
- Deploy versi kosong/awal proyek ke hosting (misalnya Vercel) agar alur deployment tervalidasi sejak dini

**Kerangka Tampilan**
- Buat layout utama (header, navigasi, footer) yang dipakai di semua halaman
- Buat halaman kosong untuk: Beranda, Jadwal Film, Jadwal Bola, Kalender, Profil
- Tentukan warna, font, dan gaya visual dasar (brand sederhana)
- Pastikan tampilan responsif (rapi di HP dan desktop)

### FASE 2 — Autentikasi & Data Inti

Tujuan: memungkinkan pengguna mendaftar/masuk, dan menampilkan data jadwal film & bola yang sesungguhnya — dua hal yang jadi fondasi seluruh fitur berikutnya.

**Autentikasi & Onboarding**
- Buat halaman sign up dan login (email + Google)
- Buat sistem sesi login dan tombol logout
- Buat alur onboarding: pilih kota domisili, tim bola favorit, genre film favorit
- Simpan preferensi onboarding ke database, terhubung ke akun pengguna

**Panel Admin Sederhana**
- Buat halaman admin internal (akses terbatas) untuk kelola data film & pertandingan
- Input data awal: film tayang 1–2 kota besar, jadwal 2–3 liga populer

**Halaman Jadwal Film & Bola**
- Tampilkan daftar film tayang + filter kota/bioskop + detail film
- Tampilkan daftar pertandingan + filter tim favorit + detail pertandingan

### FASE 3 — Personalisasi & Interaksi Pengguna

Tujuan: menghubungkan data jadwal dengan preferensi masing-masing pengguna, sehingga produk terasa personal dan mendorong pengguna kembali secara rutin.

**Watchlist & Kalender**
- Tambahkan tombol tandai pada setiap film dan pertandingan
- Buat halaman "Tontonan Saya" berisi daftar yang sudah ditandai
- Buat tampilan kalender gabungan (film + bola) berdasarkan jadwal yang ditandai

**Personalisasi & Reminder**
- Prioritaskan tampilan homepage berdasarkan tim dan genre favorit pengguna
- Buat sistem notifikasi (email/push sederhana) untuk jadwal yang ditandai
- Atur pengiriman reminder H-1 atau 1 jam sebelum jadwal

### FASE 4 — Pencarian & Komunitas Dasar

Tujuan: melengkapi pengalaman pengguna dengan pencarian cepat dan interaksi komunitas ringan, untuk mulai memvalidasi minat interaksi sosial.

**Pencarian**
- Buat kolom pencarian judul film dan nama tim/liga

**Komentar Sederhana**
- Tambahkan kolom komentar di halaman detail film dan pertandingan
- Tambahkan reaksi emoji cepat (opsional)
- Tambahkan fitur report/hide comment untuk moderasi dasar

### FASE 5 — Uji Coba & Rilis MVP

Tujuan: memastikan seluruh fitur wajib V1 berjalan lancar sebelum dirilis ke pengguna nyata.

**Pengujian**
- Uji seluruh alur: onboarding → jadwal → tandai → reminder → komentar
- Uji tampilan di berbagai ukuran layar (HP, tablet, desktop)
- Perbaiki bug dan tampilan yang belum rapi

**Rilis**
- Deploy versi final ke domain produksi
- Undang sekelompok kecil pengguna awal (beta) untuk mencoba
- Kumpulkan feedback awal sebagai bahan validasi sebelum lanjut ke fitur V2

### Setelah MVP: Roadmap Lanjutan (Tidak Wajib di Awal)

Fitur berikut sengaja tidak dijadikan fase wajib — baru dikerjakan setelah MVP tervalidasi dan mendapat feedback positif dari pengguna beta, sesuai PRD Bagian 6.

- **V2:** perluasan kota/liga, room diskusi otomatis, affiliate tiket bioskop, rating & review
- **V3:** voice room, liga privat prediksi skor, membership premium, sponsorship
