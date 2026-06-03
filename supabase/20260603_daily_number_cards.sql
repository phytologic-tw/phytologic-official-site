-- ============================================================
-- 植本邏輯 PHYTOLOGIC
-- Daily number cards migration
--
-- Purpose:
--   Store one random number card per profile per Taiwan calendar date.
--
-- Execution target:
--   Supabase SQL Editor
--
-- Verification after manual execution:
--   SELECT COUNT(*) FROM daily_number_cards;
--   Expected: 0
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.daily_number_cards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  card_number integer not null check (card_number between 1 and 9),
  draw_date date not null,
  ai_interpretation jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (profile_id, draw_date)
);

alter table public.daily_number_cards enable row level security;

drop policy if exists "會員只能讀取自己的每日數字卡" on public.daily_number_cards;
create policy "會員只能讀取自己的每日數字卡"
  on public.daily_number_cards
  for select
  to authenticated
  using (
    profile_id = (
      select id
      from public.profiles
      where line_user_id = auth.uid()::text
      limit 1
    )
  );

drop policy if exists "後端 service role 可寫入每日數字卡" on public.daily_number_cards;
create policy "後端 service role 可寫入每日數字卡"
  on public.daily_number_cards
  for all
  to service_role
  using (true)
  with check (true);

create index if not exists idx_daily_number_cards_profile_date
  on public.daily_number_cards (profile_id, draw_date desc);
