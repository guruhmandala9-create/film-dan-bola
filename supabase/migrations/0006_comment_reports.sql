-- Laporan komentar untuk moderasi dasar (manual oleh admin) + izin admin
-- untuk menyembunyikan komentar yang dilaporkan.

create table if not exists public.comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (comment_id, reporter_id)
);

alter table public.comment_reports enable row level security;

create policy "comment_reports_insert_own" on public.comment_reports for insert with check (auth.uid() = reporter_id);

create policy "comment_reports_admin_read" on public.comment_reports for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Admin bisa mengubah (menyembunyikan/menampilkan) komentar siapa pun,
-- melengkapi comments_update_own yang sudah ada dari schema.sql.
create policy "comments_admin_update" on public.comments for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
