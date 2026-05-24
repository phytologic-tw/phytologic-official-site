-- ============================================================
-- 植本邏輯 PHYTOLOGIC Digital Spec V2.0
-- Phase 0 / Phase 1 Foundation Migration
--
-- Source of truth:
--   PHYTOLOGIC_DIGITAL_SPEC_V2_0.md
--   Chapter 10: Database Schema Updates
--   Chapter 13: Phase 0 Task List
--
-- Pre-run backup created in:
--   backups/supabase_schema_20260524_phase1_pre_migration/
--
-- Execution target:
--   Supabase SQL Editor
--
-- Notes:
--   - Idempotent: safe to run more than once.
--   - profiles is the canonical LINE member table.
--   - daily_checkins.member_id must reference public.profiles(id), not line_members(id).
--   - Includes compatibility columns currently used by LIFF code.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Required extension
-- ------------------------------------------------------------
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. Ensure profiles can support LINE/LIFF members
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Older admin schema tied profiles.id to auth.users(id). LINE members are not
-- necessarily Supabase Auth users, so the member table must own its IDs.
alter table public.profiles
  drop constraint if exists profiles_id_fkey;

alter table public.profiles
  alter column id set default gen_random_uuid();

-- Existing role check allowed only admin/viewer in older schema, while the
-- LINE member API writes role='user'. Drop it before adding/updating columns;
-- a replacement constraint is added after role is guaranteed to exist.
do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      drop constraint profiles_role_check;
  end if;
end $$;

alter table public.profiles
  add column if not exists role text not null default 'user',

  -- LINE identity
  add column if not exists line_user_id text unique,
  add column if not exists line_display_name text,
  add column if not exists line_picture_url text,
  add column if not exists line_status_message text,
  add column if not exists line_linked_at timestamptz,
  add column if not exists joined_at timestamptz,

  -- Basic member profile
  add column if not exists nickname text,
  add column if not exists birth_date date,
  add column if not exists birthdate date,
  add column if not exists blood_type text,
  add column if not exists gender text,
  add column if not exists city text,
  add column if not exists numerology_number integer,
  add column if not exists life_number integer,
  add column if not exists zodiac text,
  add column if not exists zodiac_element text,

  -- Health preferences and current app compatibility
  add column if not exists diet_type text,
  add column if not exists diet_pattern text,
  add column if not exists stress_level text,
  add column if not exists stress_score integer,
  add column if not exists health_concerns text[],
  add column if not exists sleep_hours text,
  add column if not exists sleep_quality text,
  add column if not exists exercise_habit text,
  add column if not exists age_group text,
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric,
  add column if not exists bmi numeric,
  add column if not exists work_type text,

  -- Promoter / attribution tracking
  add column if not exists promoter_id text,
  add column if not exists promoter_type text,
  add column if not exists referral_source text,
  add column if not exists event_id text,
  add column if not exists referral_code text,

  -- AI generated content and latest report state
  add column if not exists daily_insight text,
  add column if not exists daily_insight_updated_at timestamptz,
  add column if not exists recommended_product_id text,
  add column if not exists recommended_product text,
  add column if not exists health_score integer,
  add column if not exists inflammation_level text,
  add column if not exists city_climate jsonb not null default '{}'::jsonb,
  add column if not exists seven_day_plan jsonb not null default '{}'::jsonb,
  add column if not exists last_report_id uuid,

  -- Member economy and growth state
  add column if not exists level text not null default 'L1',
  add column if not exists title text not null default '改變者',
  add column if not exists p_points integer not null default 0,
  add column if not exists cp_points integer not null default 0,
  add column if not exists le_points integer not null default 0,
  add column if not exists streak_days integer not null default 0,
  add column if not exists longest_streak integer not null default 0,
  add column if not exists last_checkin_date date,
  add column if not exists total_checkins integer not null default 0,
  add column if not exists seven_day_bonus_done boolean not null default false,
  add column if not exists seven_day_start_date date,
  add column if not exists registration_completed_at timestamptz,
  add column if not exists badges jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('admin', 'viewer', 'user'))
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_blood_type_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_blood_type_check
      check (blood_type in ('A', 'B', 'AB', 'O') or blood_type is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_gender_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_gender_check
      check (gender in ('male', 'female', 'other') or gender is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_numerology_number_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_numerology_number_check
      check (numerology_number between 1 and 9 or numerology_number is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_life_number_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_life_number_check
      check (life_number between 1 and 9 or life_number is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_stress_score_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_stress_score_check
      check (stress_score between 1 and 5 or stress_score is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_health_score_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_health_score_check
      check (health_score between 0 and 100 or health_score is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_level_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_level_check
      check (level in ('L1', 'L2', 'L3', 'L4'))
      not valid;
  end if;
end $$;

create index if not exists profiles_line_user_id_idx
  on public.profiles (line_user_id);

create index if not exists profiles_promoter_id_idx
  on public.profiles (promoter_id);

create index if not exists profiles_referral_source_idx
  on public.profiles (referral_source);

create index if not exists profiles_level_idx
  on public.profiles (level);

-- ------------------------------------------------------------
-- 2. promoters table
-- ------------------------------------------------------------
create table if not exists public.promoters (
  id text primary key,
  type text not null,
  name text not null,
  region text,
  contact text,
  line_url text,
  qr_code_url text,
  cp_per_referral integer default 0,
  cp_per_first_purchase integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  notes text
);

create index if not exists promoters_type_idx
  on public.promoters (type);

create index if not exists promoters_is_active_idx
  on public.promoters (is_active);

-- ------------------------------------------------------------
-- 3. dr_marvin_reports table
-- ------------------------------------------------------------
create table if not exists public.dr_marvin_reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  report_type text default 'deep',
  answers jsonb not null,
  scores jsonb not null,
  health_score integer,
  recommended_product_id text,
  report_content text,
  le_awarded integer default 0,
  created_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'dr_marvin_reports_report_type_check'
      and conrelid = 'public.dr_marvin_reports'::regclass
  ) then
    alter table public.dr_marvin_reports
      add constraint dr_marvin_reports_report_type_check
      check (report_type in ('quick', 'deep'))
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'dr_marvin_reports_health_score_check'
      and conrelid = 'public.dr_marvin_reports'::regclass
  ) then
    alter table public.dr_marvin_reports
      add constraint dr_marvin_reports_health_score_check
      check (health_score between 0 and 100 or health_score is null)
      not valid;
  end if;
end $$;

create index if not exists dr_marvin_reports_profile_id_idx
  on public.dr_marvin_reports (profile_id);

create index if not exists dr_marvin_reports_created_at_idx
  on public.dr_marvin_reports (created_at desc);

-- ------------------------------------------------------------
-- 4. daily_checkins table and FK repair
-- ------------------------------------------------------------
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null,
  created_at timestamptz not null default now()
);

alter table public.daily_checkins
  drop constraint if exists daily_checkins_member_id_fkey;

alter table public.daily_checkins
  add constraint daily_checkins_member_id_fkey
  foreign key (member_id) references public.profiles(id) on delete cascade
  not valid;

alter table public.daily_checkins
  add column if not exists profile_id uuid references public.profiles(id) on delete set null,
  add column if not exists product_consumed text,
  add column if not exists drink_product text,
  add column if not exists drink_done boolean default false,
  add column if not exists diet_done boolean default false,
  add column if not exists exercise_done boolean default false,
  add column if not exists mood_score integer,
  add column if not exists energy_score integer,
  add column if not exists energy_level integer,
  add column if not exists symptoms jsonb default '[]'::jsonb,
  add column if not exists le_awarded integer default 10,
  add column if not exists le_earned integer default 0,
  add column if not exists plan_day integer,
  add column if not exists notes text,
  add column if not exists note text;

update public.daily_checkins
set profile_id = member_id
where profile_id is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_checkins_member_date_key'
      and conrelid = 'public.daily_checkins'::regclass
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'daily_checkins_member_id_checkin_date_key'
      and conrelid = 'public.daily_checkins'::regclass
  ) then
    alter table public.daily_checkins
      add constraint daily_checkins_member_date_key
      unique (member_id, checkin_date);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_checkins_mood_score_check'
      and conrelid = 'public.daily_checkins'::regclass
  ) then
    alter table public.daily_checkins
      add constraint daily_checkins_mood_score_check
      check (mood_score between 1 and 5 or mood_score is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_checkins_energy_score_check'
      and conrelid = 'public.daily_checkins'::regclass
  ) then
    alter table public.daily_checkins
      add constraint daily_checkins_energy_score_check
      check (energy_score between 1 and 5 or energy_score is null)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_checkins_energy_level_check'
      and conrelid = 'public.daily_checkins'::regclass
  ) then
    alter table public.daily_checkins
      add constraint daily_checkins_energy_level_check
      check (energy_level between 1 and 5 or energy_level is null)
      not valid;
  end if;
end $$;

create index if not exists daily_checkins_member_date_idx
  on public.daily_checkins (member_id, checkin_date desc);

create index if not exists daily_checkins_profile_date_idx
  on public.daily_checkins (profile_id, checkin_date desc);

-- ------------------------------------------------------------
-- 5. daily_ai_messages FK consistency
-- ------------------------------------------------------------
create table if not exists public.daily_ai_messages (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  sent_date date,
  message_date date,
  message_type text,
  content jsonb not null default '{}'::jsonb,
  sent_at timestamptz not null default now()
);

alter table public.daily_ai_messages
  add column if not exists sent_date date,
  add column if not exists message_date date,
  add column if not exists message_type text,
  add column if not exists content jsonb not null default '{}'::jsonb,
  add column if not exists lucky_color text,
  add column if not exists recommended_action text,
  add column if not exists sent_at timestamptz not null default now();

update public.daily_ai_messages
set sent_date = message_date
where sent_date is null
  and message_date is not null;

update public.daily_ai_messages
set message_date = sent_date
where message_date is null
  and sent_date is not null;

alter table public.daily_ai_messages
  drop constraint if exists daily_ai_messages_member_id_fkey;

alter table public.daily_ai_messages
  add constraint daily_ai_messages_member_id_fkey
  foreign key (member_id) references public.profiles(id) on delete cascade
  not valid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'daily_ai_messages_member_sent_type_key'
      and conrelid = 'public.daily_ai_messages'::regclass
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'daily_ai_messages_member_id_sent_date_message_type_key'
      and conrelid = 'public.daily_ai_messages'::regclass
  ) then
    alter table public.daily_ai_messages
      add constraint daily_ai_messages_member_sent_type_key
      unique (member_id, sent_date, message_type);
  end if;
end $$;

create index if not exists daily_ai_messages_member_date_idx
  on public.daily_ai_messages (member_id, sent_date desc);

-- ------------------------------------------------------------
-- 6. RLS and service_role policies for new/updated tables
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.daily_ai_messages enable row level security;
alter table public.promoters enable row level security;
alter table public.dr_marvin_reports enable row level security;

drop policy if exists "Service role full access profiles" on public.profiles;
create policy "Service role full access profiles"
  on public.profiles for all
  to service_role
  using (true) with check (true);

drop policy if exists "Service role full access daily_checkins" on public.daily_checkins;
create policy "Service role full access daily_checkins"
  on public.daily_checkins for all
  to service_role
  using (true) with check (true);

drop policy if exists "Service role full access daily_ai_messages" on public.daily_ai_messages;
create policy "Service role full access daily_ai_messages"
  on public.daily_ai_messages for all
  to service_role
  using (true) with check (true);

drop policy if exists "Service role full access promoters" on public.promoters;
create policy "Service role full access promoters"
  on public.promoters for all
  to service_role
  using (true) with check (true);

drop policy if exists "Service role full access dr_marvin_reports" on public.dr_marvin_reports;
create policy "Service role full access dr_marvin_reports"
  on public.dr_marvin_reports for all
  to service_role
  using (true) with check (true);

-- ------------------------------------------------------------
-- 7. updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- Migration complete
-- ============================================================
