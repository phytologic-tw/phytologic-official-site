-- ============================================================
-- 植本邏輯 PHYTOLOGIC
-- Phase 1.5 Task Claim Foundation
--
-- Purpose:
--   Store member task rewards so LE / CP can be claimed once per period.
--
-- Notes:
--   - Idempotent: safe to run more than once.
--   - profiles remains the canonical LINE member table.
--   - Run after supabase/phase1_migration.sql.
-- ============================================================

create table if not exists public.member_task_claims (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  task_id text not null,
  task_type text not null default 'daily',
  period_key text not null,
  le_awarded integer not null default 0,
  cp_awarded integer not null default 0,
  claimed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'member_task_claims_profile_task_period_key'
      and conrelid = 'public.member_task_claims'::regclass
  ) then
    alter table public.member_task_claims
      add constraint member_task_claims_profile_task_period_key
      unique (profile_id, task_id, period_key);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'member_task_claims_task_type_check'
      and conrelid = 'public.member_task_claims'::regclass
  ) then
    alter table public.member_task_claims
      add constraint member_task_claims_task_type_check
      check (task_type in ('daily', 'weekly', 'starter', 'milestone'))
      not valid;
  end if;
end $$;

create index if not exists member_task_claims_profile_period_idx
  on public.member_task_claims (profile_id, period_key);

create index if not exists member_task_claims_claimed_at_idx
  on public.member_task_claims (claimed_at desc);

alter table public.member_task_claims enable row level security;

drop policy if exists "Service role full access member_task_claims" on public.member_task_claims;
create policy "Service role full access member_task_claims"
  on public.member_task_claims for all
  to service_role
  using (true) with check (true);

