-- Katalog film klasik seluruh dunia, diisi dari OMDb API (data IMDb resmi
-- lewat layanan pihak ketiga yang sah, bukan scraping IMDb langsung).
-- Terpisah dari tabel films (yang khusus jadwal tayang bioskop saat ini).

create table if not exists public.classic_films (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  genre text,
  country text,
  imdb_rating numeric,
  imdb_id text unique,
  poster_url text,
  plot text,
  created_at timestamptz not null default now()
);

alter table public.classic_films enable row level security;

create policy "classic_films_public_read" on public.classic_films for select using (true);

create policy "classic_films_admin_write" on public.classic_films for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

create policy "classic_films_admin_delete" on public.classic_films for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
