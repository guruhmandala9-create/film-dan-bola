-- Profil publik: username, foto, bio, riwayat tontonan, dan komentar
-- (wall/guestbook) di halaman profil pengguna lain.

-- 1. Kolom baru di profiles
alter table public.profiles add column if not exists username text unique;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;

-- View publik: hanya kolom yang boleh dilihat siapa saja (bukan
-- favorite_genres/favorite_teams/city yang tetap privat lewat RLS
-- profiles_select_own yang sudah ada di schema.sql). View berjalan
-- dengan hak akses pemilik view, jadi tidak terikat RLS tabel profiles.
create or replace view public.public_profiles as
  select id, username, display_name, avatar_url, bio
  from public.profiles
  where username is not null;

grant select on public.public_profiles to anon, authenticated;

-- 2. Riwayat "sudah ditonton" — terpisah dari watchlist (mau ditonton).
-- Hanya untuk film (jadwal saat ini) dan film klasik, bukan pertandingan.
create table if not exists public.watched_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('film', 'classic_film')),
  item_id uuid not null,
  watched_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

alter table public.watched_items enable row level security;

create policy "watched_items_public_read" on public.watched_items for select using (true);
create policy "watched_items_insert_own" on public.watched_items for insert with check (auth.uid() = user_id);
create policy "watched_items_delete_own" on public.watched_items for delete using (auth.uid() = user_id);

-- 3. Komentar di halaman profil (wall/guestbook)
create table if not exists public.profile_comments (
  id uuid primary key default gen_random_uuid(),
  profile_owner_id uuid not null references auth.users (id) on delete cascade,
  author_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profile_comments enable row level security;

create policy "profile_comments_public_read" on public.profile_comments for select using (is_hidden = false);
create policy "profile_comments_insert_own" on public.profile_comments for insert with check (auth.uid() = author_id);
create policy "profile_comments_delete_own" on public.profile_comments for delete using (auth.uid() = author_id);
create policy "profile_comments_admin_update" on public.profile_comments for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

create table if not exists public.profile_comment_reports (
  id uuid primary key default gen_random_uuid(),
  profile_comment_id uuid not null references public.profile_comments (id) on delete cascade,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (profile_comment_id, reporter_id)
);

alter table public.profile_comment_reports enable row level security;

create policy "profile_comment_reports_insert_own" on public.profile_comment_reports for insert with check (auth.uid() = reporter_id);
create policy "profile_comment_reports_admin_read" on public.profile_comment_reports for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 4. Storage bucket untuk foto profil
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatar_public_read" on storage.objects for select using (bucket_id = 'avatars');

create policy "avatar_owner_write" on storage.objects for insert with check (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatar_owner_update" on storage.objects for update using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatar_owner_delete" on storage.objects for delete using (
  bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
);
