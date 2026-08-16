-- Skema tabel awal — Agregator Jadwal Nonton (Fase 1)
-- Jalankan di Supabase Dashboard > SQL Editor > New query > Run.
--
-- "users" dari PRD dipetakan ke tabel `profiles` yang mereferensikan
-- auth.users bawaan Supabase (praktik standar Supabase), bukan tabel
-- users terpisah.

-- 1. profiles — preferensi onboarding per pengguna
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  city text,
  favorite_genres text[] not null default '{}',
  favorite_teams text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 2. films — jadwal tayang film bioskop
create table if not exists public.films (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  genre text[] not null default '{}',
  synopsis text,
  poster_url text,
  city text not null,
  cinema_name text not null,
  showtime timestamptz not null,
  created_at timestamptz not null default now()
);

-- 3. matches — jadwal pertandingan sepak bola
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  league text not null,
  home_team text not null,
  away_team text not null,
  kickoff_time timestamptz not null,
  broadcast_channel text,
  created_at timestamptz not null default now()
);

-- 4. watchlist — film/pertandingan yang ditandai pengguna
create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('film', 'match')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

-- 5. comments — komentar per jadwal film/pertandingan
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('film', 'match')),
  item_id uuid not null,
  body text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. reactions — reaksi emoji cepat, terpisah dari komentar teks
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('film', 'match')),
  item_id uuid not null,
  emoji text not null check (emoji in ('🔥', '😍', '😴')),
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.films enable row level security;
alter table public.matches enable row level security;
alter table public.watchlist enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;

-- profiles: pengguna hanya bisa baca/ubah profilnya sendiri
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- films & matches: jadwal bersifat publik untuk dibaca siapa saja;
-- penulisan hanya lewat service_role (panel admin di Fase 2)
create policy "films_public_read" on public.films for select using (true);
create policy "matches_public_read" on public.matches for select using (true);

-- watchlist: privat milik masing-masing pengguna
create policy "watchlist_select_own" on public.watchlist for select using (auth.uid() = user_id);
create policy "watchlist_insert_own" on public.watchlist for insert with check (auth.uid() = user_id);
create policy "watchlist_delete_own" on public.watchlist for delete using (auth.uid() = user_id);

-- comments: publik untuk dibaca (kecuali yang disembunyikan), hanya pemilik yang bisa ubah/hapus
create policy "comments_public_read" on public.comments for select using (is_hidden = false);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on public.comments for update using (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

-- reactions: publik untuk dibaca, hanya pemilik yang bisa ubah/hapus
create policy "reactions_public_read" on public.reactions for select using (true);
create policy "reactions_insert_own" on public.reactions for insert with check (auth.uid() = user_id);
create policy "reactions_delete_own" on public.reactions for delete using (auth.uid() = user_id);
