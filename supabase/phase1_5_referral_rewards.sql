-- ============================================================
-- 植本邏輯 PHYTOLOGIC
-- Phase 1.5 Referral Reward Log
--
-- Purpose:
--   Record referral CP settlement with anti-abuse guards:
--   - one referred profile can trigger one registration reward only once
--   - self-referral is recorded but not awarded
--   - event/store/partner sources can be recorded for manual settlement
--
-- Notes:
--   - Idempotent: safe to run more than once.
--   - Run after supabase/phase1_migration.sql.
-- ============================================================

alter table public.profiles
  add column if not exists referral_code text;

create unique index if not exists profiles_referral_code_unique_idx
  on public.profiles (referral_code)
  where referral_code is not null;

create table if not exists public.referral_reward_logs (
  id uuid primary key default gen_random_uuid(),
  referrer_profile_id uuid references public.profiles(id) on delete set null,
  referred_profile_id uuid not null references public.profiles(id) on delete cascade,
  promoter_id text not null,
  promoter_type text,
  referral_source text,
  event_id text,
  reward_type text not null default 'registration_completed',
  cp_awarded integer not null default 0,
  status text not null default 'pending',
  reason text,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'referral_reward_logs_referred_reward_key'
      and conrelid = 'public.referral_reward_logs'::regclass
  ) then
    alter table public.referral_reward_logs
      add constraint referral_reward_logs_referred_reward_key
      unique (referred_profile_id, reward_type);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'referral_reward_logs_status_check'
      and conrelid = 'public.referral_reward_logs'::regclass
  ) then
    alter table public.referral_reward_logs
      add constraint referral_reward_logs_status_check
      check (status in ('awarded', 'pending', 'blocked', 'manual_review'))
      not valid;
  end if;
end $$;

create index if not exists referral_reward_logs_promoter_id_idx
  on public.referral_reward_logs (promoter_id);

create index if not exists referral_reward_logs_referrer_idx
  on public.referral_reward_logs (referrer_profile_id);

create index if not exists referral_reward_logs_created_at_idx
  on public.referral_reward_logs (created_at desc);

alter table public.referral_reward_logs enable row level security;

drop policy if exists "Service role full access referral_reward_logs" on public.referral_reward_logs;
create policy "Service role full access referral_reward_logs"
  on public.referral_reward_logs for all
  to service_role
  using (true) with check (true);

