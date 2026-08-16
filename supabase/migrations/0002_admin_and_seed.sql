-- Fase 2 — flag admin, kebijakan tulis untuk films/matches, dan data awal.
-- Jalankan di Supabase Dashboard > SQL Editor setelah schema.sql.

alter table public.profiles add column if not exists is_admin boolean not null default false;

-- films & matches: hanya admin (profiles.is_admin = true) yang boleh tulis
create policy "films_admin_write" on public.films for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "films_admin_update" on public.films for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "films_admin_delete" on public.films for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

create policy "matches_admin_write" on public.matches for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "matches_admin_update" on public.matches for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "matches_admin_delete" on public.matches for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Data awal: film 1-2 kota besar, jadwal 2-3 liga populer
insert into public.films (title, genre, synopsis, city, cinema_name, showtime) values
  ('Pulang ke Rantau', array['Drama'], 'Kisah perantau yang kembali ke kampung halaman menjelang lebaran.', 'Jakarta', 'CGV Grand Indonesia', now() + interval '1 day' + interval '19 hour'),
  ('Malam Tanpa Bulan', array['Horor'], 'Teror di sebuah desa yang kehilangan cahaya bulan selama tujuh malam.', 'Jakarta', 'Cinepolis Senayan City', now() + interval '2 day' + interval '20 hour'),
  ('Tawa di Ujung Jalan', array['Komedi'], 'Tiga sahabat mencoba peruntungan bisnis kuliner keliling kota.', 'Bandung', 'CGV Paris Van Java', now() + interval '1 day' + interval '18 hour 30 minute'),
  ('Rider Senja', array['Action', 'Thriller'], 'Seorang kurir motor terjebak dalam perebutan kekuasaan geng kota.', 'Bandung', 'XXI Braga', now() + interval '3 day' + interval '21 hour');

insert into public.matches (league, home_team, away_team, kickoff_time, broadcast_channel) values
  ('Liga 1', 'Persija Jakarta', 'Persib Bandung', now() + interval '1 day' + interval '19 hour', 'Vidio'),
  ('English Premier League', 'Manchester United', 'Liverpool', now() + interval '2 day' + interval '22 hour', 'beIN Sports'),
  ('English Premier League', 'Arsenal', 'Manchester City', now() + interval '4 day' + interval '23 hour', 'beIN Sports'),
  ('Liga Champions', 'Real Madrid', 'Bayern Munich', now() + interval '5 day' + interval '2 hour', 'SCTV');

-- Untuk menjadikan akunmu sendiri sebagai admin, jalankan (ganti email):
-- update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'emailkamu@example.com');
