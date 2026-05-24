-- ============================================================
-- Phase 1 hotfix: profiles.level must be text ('L1'/'L2'/'L3'/'L4')
-- 執行環境：Supabase Dashboard > SQL Editor
-- 可重複執行
-- ============================================================

alter table public.profiles
  alter column level drop default;

alter table public.profiles
  alter column level type text
  using case
    when level::text in ('1', '2', '3', '4') then 'L' || level::text
    when level::text in ('L1', 'L2', 'L3', 'L4') then level::text
    else 'L1'
  end;

alter table public.profiles
  alter column level set default 'L1';

update public.profiles
set level = case
  when level in ('1', '2', '3', '4') then 'L' || level
  when level in ('L1', 'L2', 'L3', 'L4') then level
  else 'L1'
end
where level is null or level not in ('L1', 'L2', 'L3', 'L4');

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_level_l_format_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_level_l_format_check
      check (level in ('L1', 'L2', 'L3', 'L4'));
  end if;
end $$;
