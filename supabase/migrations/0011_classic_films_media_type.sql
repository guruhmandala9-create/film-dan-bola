-- Perluas katalog Film Klasik supaya bisa juga menyimpan series/anime,
-- bukan cuma film. media_type dari OMDb: 'movie' atau 'series'.
alter table public.classic_films add column if not exists media_type text not null default 'movie';
