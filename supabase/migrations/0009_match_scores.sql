-- Skor hasil pertandingan. NULL di keduanya berarti belum ada hasil
-- (pertandingan akan datang); terisi keduanya berarti sudah selesai.
alter table public.matches add column if not exists home_score int;
alter table public.matches add column if not exists away_score int;
