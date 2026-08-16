-- Perluas data jadwal: semua tim di 3 liga (Liga 1, EPL, Liga Champions)
-- dan daftar film yang lebih lengkap di Jakarta & Bandung.
-- Jalankan di Supabase SQL Editor. Mengganti seed lama dari 0002.

delete from public.matches;
delete from public.films;

insert into public.films (title, genre, synopsis, city, cinema_name, showtime) values
  ('Pulang ke Rantau', array['Drama'], 'Kisah perantau yang kembali ke kampung halaman menjelang lebaran.', 'Jakarta', 'CGV Grand Indonesia', now() + interval '1 day' + interval '19 hour'),
  ('Malam Tanpa Bulan', array['Horor'], 'Teror di sebuah desa yang kehilangan cahaya bulan selama tujuh malam.', 'Jakarta', 'Cinepolis Senayan City', now() + interval '2 day' + interval '20 hour'),
  ('Kota Tanpa Nama', array['Thriller', 'Action'], 'Detektif muda mengungkap konspirasi di balik kota yang terhapus dari peta.', 'Jakarta', 'XXI Plaza Senayan', now() + interval '3 day' + interval '21 hour'),
  ('Dongeng Semesta Kecil', array['Animasi'], 'Petualangan seorang anak menjelajahi semesta mainan di kamarnya.', 'Jakarta', 'CGV FX Sudirman', now() + interval '4 day' + interval '16 hour'),
  ('Tawa di Ujung Jalan', array['Komedi'], 'Tiga sahabat mencoba peruntungan bisnis kuliner keliling kota.', 'Bandung', 'CGV Paris Van Java', now() + interval '1 day' + interval '18 hour 30 minute'),
  ('Rider Senja', array['Action', 'Thriller'], 'Seorang kurir motor terjebak dalam perebutan kekuasaan geng kota.', 'Bandung', 'XXI Braga', now() + interval '3 day' + interval '21 hour'),
  ('Cinta di Musim Kemarau', array['Romantis'], 'Dua sahabat lama dipertemukan kembali saat musim kemarau panjang melanda kota kecil.', 'Bandung', 'Cinepolis 23 Paskal', now() + interval '2 day' + interval '19 hour 30 minute'),
  ('Legenda Naga Terakhir', array['Fantasi', 'Action'], 'Seorang pendekar muda mencari naga terakhir untuk menyelamatkan kerajaannya.', 'Bandung', 'CGV Miko Mall', now() + interval '5 day' + interval '17 hour');

insert into public.matches (league, home_team, away_team, kickoff_time, broadcast_channel) values
  ('Liga 1', 'Persija Jakarta', 'Persib Bandung', now() + interval '1 day' + interval '19 hour', 'Vidio'),
  ('Liga 1', 'Bali United', 'PSM Makassar', now() + interval '2 day' + interval '15 hour 30 minute', 'Vidio'),
  ('Liga 1', 'Persib Bandung', 'Bali United', now() + interval '4 day' + interval '19 hour', 'Vidio'),
  ('Liga 1', 'PSM Makassar', 'Persija Jakarta', now() + interval '6 day' + interval '15 hour 30 minute', 'Vidio'),
  ('English Premier League', 'Manchester United', 'Liverpool', now() + interval '2 day' + interval '22 hour', 'beIN Sports'),
  ('English Premier League', 'Arsenal', 'Manchester City', now() + interval '4 day' + interval '23 hour', 'beIN Sports'),
  ('English Premier League', 'Chelsea', 'Manchester United', now() + interval '5 day' + interval '21 hour', 'beIN Sports'),
  ('English Premier League', 'Liverpool', 'Arsenal', now() + interval '7 day' + interval '22 hour', 'beIN Sports'),
  ('English Premier League', 'Manchester City', 'Chelsea', now() + interval '9 day' + interval '20 hour 30 minute', 'beIN Sports'),
  ('Liga Champions', 'Real Madrid', 'Bayern Munich', now() + interval '5 day' + interval '2 hour', 'SCTV'),
  ('Liga Champions', 'Barcelona', 'Paris Saint-Germain', now() + interval '6 day' + interval '2 hour', 'SCTV'),
  ('Liga Champions', 'Bayern Munich', 'Barcelona', now() + interval '12 day' + interval '2 hour 45 minute', 'SCTV'),
  ('Liga Champions', 'Paris Saint-Germain', 'Real Madrid', now() + interval '13 day' + interval '2 hour 45 minute', 'SCTV');
