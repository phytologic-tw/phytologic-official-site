-- ============================================================
-- Phytologic Dr. Marvin question engine
-- Generated: 2026-06-02
--
-- Purpose:
--   Make the Dr. Marvin question bank, inflammation alerts,
--   anti-inflammation protocols, and member question history
--   usable by the LIFF assessment flow.
--
-- Safety:
--   - No table drops.
--   - No production data truncation.
--   - Idempotent table / column / index / policy setup.
--   - All member FKs point to public.profiles(id).
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. question_bank
-- ------------------------------------------------------------
create table if not exists public.question_bank (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.question_bank
  add column if not exists system_category text,
  add column if not exists age_groups text[] not null default '{}',
  add column if not exists gender_filter text not null default 'all',
  add column if not exists question_text text,
  add column if not exists question_type text not null default 'frequency',
  add column if not exists options jsonb not null default '[]'::jsonb,
  add column if not exists weight numeric not null default 1,
  add column if not exists priority integer not null default 5,
  add column if not exists is_active boolean not null default true;

update public.question_bank
set
  age_groups = coalesce(age_groups, '{}'),
  gender_filter = coalesce(gender_filter, 'all'),
  question_type = coalesce(question_type, 'frequency'),
  options = coalesce(options, '[]'::jsonb),
  weight = coalesce(weight, 1),
  priority = coalesce(priority, 5),
  is_active = coalesce(is_active, true);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'question_bank_system_category_check'
      and conrelid = 'public.question_bank'::regclass
  ) then
    alter table public.question_bank
      add constraint question_bank_system_category_check
      check (
        system_category in (
          'brain_nerve',
          'digestive',
          'detox_liver',
          'blood_sugar_cardio',
          'endocrine_hormone',
          'muscle_bone',
          'immune',
          'general'
        )
      )
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'question_bank_gender_filter_check'
      and conrelid = 'public.question_bank'::regclass
  ) then
    alter table public.question_bank
      add constraint question_bank_gender_filter_check
      check (gender_filter in ('all', 'female', 'male'))
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'question_bank_question_type_check'
      and conrelid = 'public.question_bank'::regclass
  ) then
    alter table public.question_bank
      add constraint question_bank_question_type_check
      check (question_type in ('frequency', 'scale', 'single_choice'))
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'question_bank_priority_check'
      and conrelid = 'public.question_bank'::regclass
  ) then
    alter table public.question_bank
      add constraint question_bank_priority_check
      check (priority between 1 and 10)
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'question_bank_unique_question'
      and conrelid = 'public.question_bank'::regclass
  ) then
    alter table public.question_bank
      add constraint question_bank_unique_question
      unique (system_category, age_groups, gender_filter, question_text);
  end if;
end $$;

create index if not exists question_bank_system_idx
  on public.question_bank (system_category);

create index if not exists question_bank_gender_idx
  on public.question_bank (gender_filter);

create index if not exists question_bank_age_groups_gin_idx
  on public.question_bank using gin (age_groups);

create index if not exists question_bank_priority_idx
  on public.question_bank (priority desc);

create index if not exists question_bank_active_idx
  on public.question_bank (is_active)
  where is_active = true;

-- ------------------------------------------------------------
-- 2. inflammation_alerts
-- ------------------------------------------------------------
create table if not exists public.inflammation_alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inflammation_alerts
  add column if not exists alert_code text,
  add column if not exists trigger_systems text[] not null default '{}',
  add column if not exists trigger_min_score numeric not null default 8,
  add column if not exists alert_title text,
  add column if not exists alert_body text,
  add column if not exists priority integer not null default 5,
  add column if not exists recommended_action text,
  add column if not exists is_active boolean not null default true;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'inflammation_alerts_alert_code_key'
      and conrelid = 'public.inflammation_alerts'::regclass
  ) then
    alter table public.inflammation_alerts
      add constraint inflammation_alerts_alert_code_key
      unique (alert_code);
  end if;
end $$;

create index if not exists inflammation_alerts_trigger_systems_gin_idx
  on public.inflammation_alerts using gin (trigger_systems);

create index if not exists inflammation_alerts_priority_idx
  on public.inflammation_alerts (priority desc);

create index if not exists inflammation_alerts_active_idx
  on public.inflammation_alerts (is_active)
  where is_active = true;

-- ------------------------------------------------------------
-- 3. anti_inflammation_protocols
-- ------------------------------------------------------------
create table if not exists public.anti_inflammation_protocols (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.anti_inflammation_protocols
  add column if not exists system_category text,
  add column if not exists protocol_code text,
  add column if not exists protocol_type text,
  add column if not exists protocol_title text,
  add column if not exists protocol_body text,
  add column if not exists items jsonb not null default '[]'::jsonb,
  add column if not exists priority integer not null default 5,
  add column if not exists is_active boolean not null default true;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'anti_inflammation_protocols_protocol_code_key'
      and conrelid = 'public.anti_inflammation_protocols'::regclass
  ) then
    alter table public.anti_inflammation_protocols
      add constraint anti_inflammation_protocols_protocol_code_key
      unique (protocol_code);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'anti_inflammation_protocols_protocol_type_check'
      and conrelid = 'public.anti_inflammation_protocols'::regclass
  ) then
    alter table public.anti_inflammation_protocols
      add constraint anti_inflammation_protocols_protocol_type_check
      check (protocol_type in ('nutrition', 'supplement', 'lifestyle'))
      not valid;
  end if;
end $$;

create index if not exists anti_inflammation_protocols_system_idx
  on public.anti_inflammation_protocols (system_category);

create index if not exists anti_inflammation_protocols_type_idx
  on public.anti_inflammation_protocols (protocol_type);

create index if not exists anti_inflammation_protocols_active_idx
  on public.anti_inflammation_protocols (is_active)
  where is_active = true;

-- ------------------------------------------------------------
-- 4. member_question_history
-- ------------------------------------------------------------
create table if not exists public.member_question_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  question_id uuid references public.question_bank(id) on delete cascade,
  assessment_session_id uuid,
  shown_at timestamptz not null default now(),
  answered_at timestamptz,
  answer_score numeric,
  answer_payload jsonb not null default '{}'::jsonb
);

alter table public.member_question_history
  add column if not exists profile_id uuid references public.profiles(id) on delete cascade,
  add column if not exists question_id uuid references public.question_bank(id) on delete cascade,
  add column if not exists assessment_session_id uuid,
  add column if not exists shown_at timestamptz not null default now(),
  add column if not exists answered_at timestamptz,
  add column if not exists answer_score numeric,
  add column if not exists answer_payload jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'member_question_history_profile_id_fkey'
      and conrelid = 'public.member_question_history'::regclass
  ) then
    alter table public.member_question_history
      add constraint member_question_history_profile_id_fkey
      foreign key (profile_id) references public.profiles(id) on delete cascade
      not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'member_question_history_question_id_fkey'
      and conrelid = 'public.member_question_history'::regclass
  ) then
    alter table public.member_question_history
      add constraint member_question_history_question_id_fkey
      foreign key (question_id) references public.question_bank(id) on delete cascade
      not valid;
  end if;
end $$;

create index if not exists member_question_history_profile_shown_idx
  on public.member_question_history (profile_id, shown_at desc);

create index if not exists member_question_history_question_idx
  on public.member_question_history (question_id);

create index if not exists member_question_history_session_idx
  on public.member_question_history (assessment_session_id);

-- ------------------------------------------------------------
-- 5. updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists question_bank_updated_at on public.question_bank;
create trigger question_bank_updated_at
  before update on public.question_bank
  for each row execute function public.set_updated_at();

drop trigger if exists inflammation_alerts_updated_at on public.inflammation_alerts;
create trigger inflammation_alerts_updated_at
  before update on public.inflammation_alerts
  for each row execute function public.set_updated_at();

drop trigger if exists anti_inflammation_protocols_updated_at on public.anti_inflammation_protocols;
create trigger anti_inflammation_protocols_updated_at
  before update on public.anti_inflammation_protocols
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 6. RLS
-- ------------------------------------------------------------
alter table public.question_bank enable row level security;
alter table public.inflammation_alerts enable row level security;
alter table public.anti_inflammation_protocols enable row level security;
alter table public.member_question_history enable row level security;

drop policy if exists "Public read active question bank" on public.question_bank;
create policy "Public read active question bank"
  on public.question_bank for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public read active inflammation alerts" on public.inflammation_alerts;
create policy "Public read active inflammation alerts"
  on public.inflammation_alerts for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public read active anti inflammation protocols" on public.anti_inflammation_protocols;
create policy "Public read active anti inflammation protocols"
  on public.anti_inflammation_protocols for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Service role full access question bank" on public.question_bank;
create policy "Service role full access question bank"
  on public.question_bank for all
  to service_role
  using (true) with check (true);

drop policy if exists "Service role full access inflammation alerts" on public.inflammation_alerts;
create policy "Service role full access inflammation alerts"
  on public.inflammation_alerts for all
  to service_role
  using (true) with check (true);

drop policy if exists "Service role full access anti inflammation protocols" on public.anti_inflammation_protocols;
create policy "Service role full access anti inflammation protocols"
  on public.anti_inflammation_protocols for all
  to service_role
  using (true) with check (true);

drop policy if exists "Service role full access member question history" on public.member_question_history;
create policy "Service role full access member question history"
  on public.member_question_history for all
  to service_role
  using (true) with check (true);

-- Optional verification after migration and seed:
-- select count(*) from public.question_bank;
-- select count(*) from public.inflammation_alerts;
-- select count(*) from public.anti_inflammation_protocols;
-- select to_regclass('public.member_question_history');
