-- Kolom penanda pertandingan yang disinkronkan otomatis dari football-data.org,
-- supaya sinkronisasi berikutnya bisa update (bukan duplikat) baris yang sama.
-- NULL untuk pertandingan yang diinput manual admin (mis. Liga 1 Indonesia).
alter table public.matches add column if not exists external_id text unique;
