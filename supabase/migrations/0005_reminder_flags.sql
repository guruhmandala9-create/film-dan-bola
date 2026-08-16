-- Tandai reminder yang sudah terkirim per item watchlist, supaya cron job
-- tidak mengirim email dobel untuk jadwal yang sama.
alter table public.watchlist add column if not exists reminded_h1 boolean not null default false;
alter table public.watchlist add column if not exists reminded_1h boolean not null default false;
