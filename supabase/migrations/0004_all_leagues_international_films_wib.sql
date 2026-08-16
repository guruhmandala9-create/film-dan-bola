-- Reset & isi ulang jadwal: 7 liga (Liga 1, Liga Champions, Premier League,
-- La Liga, Serie A, Bundesliga, Ligue 1) dan film dari berbagai negara.
-- Semua jam dihitung sebagai WIB (Asia/Jakarta, UTC+7) lewat helper wib()
-- di bawah, supaya jadwalnya sesuai waktu Indonesia. Menggantikan seed dari
-- migrasi 0002 & 0003. Jalankan di Supabase SQL Editor.

create or replace function public._seed_wib(day_offset int, hour int, minute int default 0)
returns timestamptz language sql stable as $$
  select (
    date_trunc('day', now() at time zone 'Asia/Jakarta')
    + (day_offset || ' day')::interval
    + (hour || ' hour')::interval
    + (minute || ' minute')::interval
  ) at time zone 'Asia/Jakarta';
$$;

delete from public.matches;
delete from public.films;

insert into public.films (title, genre, synopsis, city, cinema_name, showtime) values
  ('Pulang ke Rantau', array['Drama'], 'Kisah perantau yang kembali ke kampung halaman menjelang lebaran.', 'Jakarta', 'CGV Grand Indonesia', public._seed_wib(1, 19, 0)),
  ('Malam Tanpa Bulan', array['Horor'], 'Teror di sebuah desa yang kehilangan cahaya bulan selama tujuh malam.', 'Jakarta', 'Cinepolis Senayan City', public._seed_wib(2, 20, 0)),
  ('Kota Tanpa Nama', array['Thriller', 'Action'], 'Detektif muda mengungkap konspirasi di balik kota yang terhapus dari peta.', 'Jakarta', 'XXI Plaza Senayan', public._seed_wib(3, 21, 0)),
  ('Dongeng Semesta Kecil', array['Animasi'], 'Petualangan seorang anak menjelajahi semesta mainan di kamarnya.', 'Jakarta', 'CGV FX Sudirman', public._seed_wib(4, 16, 0)),
  ('Tawa di Ujung Jalan', array['Komedi'], 'Tiga sahabat mencoba peruntungan bisnis kuliner keliling kota.', 'Bandung', 'CGV Paris Van Java', public._seed_wib(1, 18, 30)),
  ('Rider Senja', array['Action', 'Thriller'], 'Seorang kurir motor terjebak dalam perebutan kekuasaan geng kota.', 'Bandung', 'XXI Braga', public._seed_wib(3, 21, 0)),
  ('Cinta di Musim Kemarau', array['Romantis'], 'Dua sahabat lama dipertemukan kembali saat musim kemarau panjang melanda kota kecil.', 'Bandung', 'Cinepolis 23 Paskal', public._seed_wib(2, 19, 30)),
  ('Legenda Naga Terakhir', array['Fantasi', 'Action'], 'Seorang pendekar muda mencari naga terakhir untuk menyelamatkan kerajaannya.', 'Bandung', 'CGV Miko Mall', public._seed_wib(5, 17, 0)),
  ('Starlight Heist', array['Action', 'Thriller'], 'Film asal Amerika Serikat: sekelompok pencuri profesional merencanakan perampokan terbesar di sebuah stasiun luar angkasa.', 'Jakarta', 'CGV Grand Indonesia', public._seed_wib(2, 21, 0)),
  ('Winter in Seoul', array['Romantis', 'Drama'], 'Film asal Korea Selatan tentang dua sejoli yang dipertemukan kembali di tengah musim dingin Seoul.', 'Jakarta', 'Cinepolis Senayan City', public._seed_wib(3, 18, 0)),
  ('Sang Ksatria Sakura', array['Animasi', 'Fantasi'], 'Anime asal Jepang mengisahkan ksatria muda yang menjaga hutan sakura dari kegelapan.', 'Bandung', 'CGV Paris Van Java', public._seed_wib(2, 16, 30)),
  ('Tarian Cinta Mumbai', array['Romantis', 'Komedi'], 'Musikal asal India yang penuh warna tentang cinta dua keluarga yang bermusuhan.', 'Bandung', 'XXI Braga', public._seed_wib(4, 19, 0)),
  ('Malam Paris yang Sunyi', array['Drama'], 'Drama asal Prancis tentang seorang seniman jalanan yang mencari makna hidup di kota Paris.', 'Jakarta', 'XXI Plaza Senayan', public._seed_wib(5, 20, 0)),
  ('Perang Bintang Terakhir', array['Action', 'Fantasi'], 'Epik luar angkasa asal Amerika Serikat tentang pertempuran terakhir demi menyelamatkan galaksi.', 'Bandung', 'CGV Miko Mall', public._seed_wib(6, 21, 0)),
  ('Hantu Rumah Tua Bangkok', array['Horor'], 'Horor asal Thailand tentang keluarga yang pindah ke rumah tua berhantu di pinggiran Bangkok.', 'Jakarta', 'CGV FX Sudirman', public._seed_wib(6, 20, 30)),
  ('Simfoni Kota London', array['Drama', 'Romantis'], 'Kisah asal Inggris tentang musisi jalanan yang jatuh cinta pada pemilik toko piringan hitam.', 'Bandung', 'Cinepolis 23 Paskal', public._seed_wib(7, 19, 0));

insert into public.matches (league, home_team, away_team, kickoff_time, broadcast_channel) values
  -- Liga 1 (WIB sore/malam)
  ('Liga 1', 'Persija Jakarta', 'Persib Bandung', public._seed_wib(1, 19, 0), 'Vidio'),
  ('Liga 1', 'Bali United', 'PSM Makassar', public._seed_wib(2, 15, 30), 'Vidio'),
  ('Liga 1', 'Persib Bandung', 'Bali United', public._seed_wib(4, 19, 0), 'Vidio'),
  ('Liga 1', 'PSM Makassar', 'Persija Jakarta', public._seed_wib(6, 15, 30), 'Vidio'),
  -- Liga Champions (dini hari WIB)
  ('Liga Champions', 'Real Madrid', 'Bayern Munich', public._seed_wib(5, 2, 0), 'SCTV'),
  ('Liga Champions', 'Barcelona', 'Paris Saint-Germain', public._seed_wib(6, 2, 0), 'SCTV'),
  ('Liga Champions', 'Bayern Munich', 'Barcelona', public._seed_wib(12, 2, 45), 'SCTV'),
  ('Liga Champions', 'Paris Saint-Germain', 'Real Madrid', public._seed_wib(13, 2, 45), 'SCTV'),
  -- English Premier League (malam/dini hari WIB)
  ('English Premier League', 'Manchester United', 'Liverpool', public._seed_wib(2, 22, 0), 'beIN Sports'),
  ('English Premier League', 'Arsenal', 'Manchester City', public._seed_wib(4, 23, 0), 'beIN Sports'),
  ('English Premier League', 'Chelsea', 'Manchester United', public._seed_wib(5, 21, 0), 'beIN Sports'),
  ('English Premier League', 'Liverpool', 'Arsenal', public._seed_wib(7, 22, 0), 'beIN Sports'),
  -- La Liga (dini hari WIB)
  ('La Liga', 'Real Madrid', 'Sevilla', public._seed_wib(1, 2, 30), 'beIN Sports'),
  ('La Liga', 'Barcelona', 'Atletico Madrid', public._seed_wib(3, 3, 0), 'beIN Sports'),
  ('La Liga', 'Atletico Madrid', 'Real Madrid', public._seed_wib(8, 2, 30), 'beIN Sports'),
  ('La Liga', 'Sevilla', 'Barcelona', public._seed_wib(10, 3, 0), 'beIN Sports'),
  -- Serie A (dini hari WIB)
  ('Serie A', 'Juventus', 'AC Milan', public._seed_wib(2, 2, 45), 'beIN Sports'),
  ('Serie A', 'Inter Milan', 'Napoli', public._seed_wib(4, 2, 45), 'beIN Sports'),
  ('Serie A', 'AC Milan', 'Inter Milan', public._seed_wib(9, 2, 45), 'beIN Sports'),
  ('Serie A', 'Napoli', 'Juventus', public._seed_wib(11, 2, 45), 'beIN Sports'),
  -- Bundesliga (tengah malam WIB)
  ('Bundesliga', 'Bayern Munich', 'Borussia Dortmund', public._seed_wib(1, 0, 30), 'beIN Sports'),
  ('Bundesliga', 'RB Leipzig', 'Bayer Leverkusen', public._seed_wib(3, 0, 30), 'beIN Sports'),
  ('Bundesliga', 'Borussia Dortmund', 'RB Leipzig', public._seed_wib(8, 0, 30), 'beIN Sports'),
  ('Bundesliga', 'Bayer Leverkusen', 'Bayern Munich', public._seed_wib(10, 0, 30), 'beIN Sports'),
  -- Ligue 1 (dini hari WIB)
  ('Ligue 1', 'Paris Saint-Germain', 'Marseille', public._seed_wib(2, 2, 0), 'beIN Sports'),
  ('Ligue 1', 'Monaco', 'Lyon', public._seed_wib(4, 2, 0), 'beIN Sports'),
  ('Ligue 1', 'Marseille', 'Monaco', public._seed_wib(9, 2, 0), 'beIN Sports'),
  ('Ligue 1', 'Lyon', 'Paris Saint-Germain', public._seed_wib(11, 2, 0), 'beIN Sports');

drop function public._seed_wib(int, int, int);
