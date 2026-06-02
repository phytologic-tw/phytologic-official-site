-- ============================================================
-- Dr. Marvin member_question_history session column hotfix
-- Generated: 2026-06-02
--
-- Purpose:
--   Fix production schema cache/runtime errors where
--   public.member_question_history exists but is missing
--   assessment_session_id and answer backfill columns.
--
-- Safety:
--   - No DROP
--   - No TRUNCATE
--   - No DELETE
--   - Existing rows are preserved
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.member_question_history (
  id uuid primary key default gen_random_uuid()
);

alter table public.member_question_history
  add column if not exists profile_id uuid,
  add column if not exists question_id uuid,
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

  if to_regclass('public.question_bank') is not null
    and not exists (
      select 1
      from pg_constraint
      where conname = 'member_question_history_question_id_fkey'
        and conrelid = 'public.member_question_history'::regclass
    )
  then
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

create index if not exists member_question_history_profile_session_idx
  on public.member_question_history (profile_id, assessment_session_id);

notify pgrst, 'reload schema';

-- Verification:
-- select column_name, data_type
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'member_question_history'
-- order by ordinal_position;
