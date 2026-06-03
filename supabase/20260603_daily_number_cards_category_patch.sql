-- ============================================================
-- 植本邏輯 PHYTOLOGIC
-- Daily number cards category patch
--
-- Purpose:
--   Change daily_number_cards from one card per day to one card
--   per profile/date/category.
--
-- Execution target:
--   Supabase SQL Editor
--
-- Verification:
--   SELECT category, COUNT(*) FROM daily_number_cards GROUP BY category;
-- ============================================================

alter table public.daily_number_cards
  add column if not exists category text;

update public.daily_number_cards
set category = 'food'
where category is null;

alter table public.daily_number_cards
  alter column category set not null;

alter table public.daily_number_cards
  drop constraint if exists daily_number_cards_profile_id_draw_date_key;

alter table public.daily_number_cards
  drop constraint if exists daily_number_cards_category_check;

alter table public.daily_number_cards
  add constraint daily_number_cards_category_check
  check (category in ('food', 'clothing', 'living', 'movement', 'learning', 'joy'));

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_number_cards_profile_date_category_key'
      and conrelid = 'public.daily_number_cards'::regclass
  ) then
    alter table public.daily_number_cards
      add constraint daily_number_cards_profile_date_category_key
      unique (profile_id, draw_date, category);
  end if;
end $$;

create index if not exists idx_daily_number_cards_profile_date_category
  on public.daily_number_cards (profile_id, draw_date desc, category);
