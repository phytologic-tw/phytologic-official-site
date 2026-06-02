-- ============================================================
-- 植本邏輯 PHYTOLOGIC
-- Daily plant card readings migration
--
-- Purpose:
--   Store one daily card draw per profile/date/category.
--
-- Execution target:
--   Supabase SQL Editor
--
-- Verification after manual execution:
--   SELECT COUNT(*) FROM daily_card_readings;
--   Expected: 0
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.daily_card_readings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  category text not null check (category in ('food', 'clothing', 'home', 'travel', 'learning', 'leisure')),
  drawn_number integer not null check (drawn_number between 1 and 9),
  short_advice text,
  full_advice text,
  numerology_ref jsonb,
  ai_generated boolean default false,
  created_at timestamptz default now(),
  unique (profile_id, date, category)
);

alter table public.daily_card_readings enable row level security;

drop policy if exists "會員只能讀取自己的卡牌紀錄" on public.daily_card_readings;
create policy "會員只能讀取自己的卡牌紀錄"
  on public.daily_card_readings
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

drop policy if exists "後端 service role 可寫入" on public.daily_card_readings;
create policy "後端 service role 可寫入"
  on public.daily_card_readings
  for insert
  to service_role
  with check (true);

create index if not exists idx_card_readings_profile_date
  on public.daily_card_readings (profile_id, date);
