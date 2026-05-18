-- Admin tables and RLS repair migration.
-- Safe to run multiple times in Supabase Dashboard > SQL Editor.
-- This migration contains no passwords or API keys.

create extension if not exists pgcrypto;

-- ============================================================
-- Shared helpers
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists role text not null default 'viewer',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

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
      check (lower(trim(role)) in ('admin', 'viewer'));
  end if;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and lower(trim(role)) = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ============================================================
-- Table schemas
-- ============================================================

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null,
  city text not null,
  category text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  facebook_url text,
  instagram_url text,
  website_url text,
  description text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.partners
  add column if not exists partner_name text,
  add column if not exists city text,
  add column if not exists category text,
  add column if not exists contact_name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists facebook_url text,
  add column if not exists instagram_url text,
  add column if not exists website_url text,
  add column if not exists description text,
  add column if not exists status text not null default 'pending',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  summary text,
  content text,
  cover_image_url text,
  status text not null default 'draft',
  is_pinned boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements
  add column if not exists title text,
  add column if not exists category text,
  add column if not exists summary text,
  add column if not exists content text,
  add column if not exists cover_image_url text,
  add column if not exists status text not null default 'draft',
  add column if not exists is_pinned boolean not null default false,
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'photo',
  category text not null,
  media_url text not null,
  thumbnail_url text,
  description text,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_items
  add column if not exists title text,
  add column if not exists type text not null default 'photo',
  add column if not exists category text,
  add column if not exists media_url text,
  add column if not exists thumbnail_url text,
  add column if not exists description text,
  add column if not exists status text not null default 'draft',
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.assessment_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  gender text,
  age int,
  age_group text,
  height_cm numeric,
  weight_kg numeric,
  bmi numeric,
  work_type text,
  sleep_hours text,
  sleep_quality text,
  exercise_habit text,
  diet_pattern text,
  stress_level text,
  answers jsonb not null default '[]'::jsonb,
  total_score int,
  inflammation_level text,
  system_scores jsonb not null default '{}'::jsonb,
  primary_systems jsonb not null default '{}'::jsonb,
  recommended_products jsonb not null default '[]'::jsonb,
  ai_analysis text,
  lifestyle_advice text,
  partial_report jsonb not null default '{}'::jsonb,
  full_report jsonb not null default '{}'::jsonb,
  has_joined_line boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assessment_reports
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists name text,
  add column if not exists gender text,
  add column if not exists age int,
  add column if not exists age_group text,
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric,
  add column if not exists bmi numeric,
  add column if not exists work_type text,
  add column if not exists sleep_hours text,
  add column if not exists sleep_quality text,
  add column if not exists exercise_habit text,
  add column if not exists diet_pattern text,
  add column if not exists stress_level text,
  add column if not exists answers jsonb not null default '[]'::jsonb,
  add column if not exists total_score int,
  add column if not exists inflammation_level text,
  add column if not exists system_scores jsonb not null default '{}'::jsonb,
  add column if not exists primary_systems jsonb not null default '{}'::jsonb,
  add column if not exists recommended_products jsonb not null default '[]'::jsonb,
  add column if not exists ai_analysis text,
  add column if not exists lifestyle_advice text,
  add column if not exists partial_report jsonb not null default '{}'::jsonb,
  add column if not exists full_report jsonb not null default '{}'::jsonb,
  add column if not exists has_joined_line boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  type text,
  message text,
  status text not null default 'unread',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_submissions
  add column if not exists name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists type text,
  add column if not exists message text,
  add column if not exists status text not null default 'unread',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Add check constraints only if they do not already exist.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'partners_status_check' and conrelid = 'public.partners'::regclass) then
    alter table public.partners add constraint partners_status_check check (status in ('pending', 'approved', 'rejected'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'announcements_status_check' and conrelid = 'public.announcements'::regclass) then
    alter table public.announcements add constraint announcements_status_check check (status in ('draft', 'published', 'archived'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'gallery_items_type_check' and conrelid = 'public.gallery_items'::regclass) then
    alter table public.gallery_items add constraint gallery_items_type_check check (type in ('photo', 'video'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'gallery_items_status_check' and conrelid = 'public.gallery_items'::regclass) then
    alter table public.gallery_items add constraint gallery_items_status_check check (status in ('draft', 'published', 'archived'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'contact_submissions_status_check' and conrelid = 'public.contact_submissions'::regclass) then
    alter table public.contact_submissions add constraint contact_submissions_status_check check (status in ('unread', 'read', 'archived'));
  end if;
end $$;

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists partners_status_created_at_idx on public.partners (status, created_at desc);
create index if not exists partners_email_created_at_idx on public.partners (email, created_at desc);
create index if not exists announcements_public_order_idx on public.announcements (status, is_pinned desc, published_at desc);
create index if not exists announcements_created_at_idx on public.announcements (created_at desc);
create index if not exists gallery_items_public_order_idx on public.gallery_items (status, published_at desc);
create index if not exists gallery_items_created_at_idx on public.gallery_items (created_at desc);
create index if not exists assessment_reports_created_at_idx on public.assessment_reports (created_at desc);
create index if not exists assessment_reports_user_created_at_idx on public.assessment_reports (user_id, created_at desc);
create index if not exists contact_submissions_status_created_at_idx on public.contact_submissions (status, created_at desc);
create index if not exists contact_submissions_email_created_at_idx on public.contact_submissions (email, created_at desc);

-- ============================================================
-- updated_at triggers
-- ============================================================

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists partners_set_updated_at on public.partners;
create trigger partners_set_updated_at
before update on public.partners
for each row execute function public.set_updated_at();

drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists gallery_items_set_updated_at on public.gallery_items;
create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

drop trigger if exists assessment_reports_set_updated_at on public.assessment_reports;
create trigger assessment_reports_set_updated_at
before update on public.assessment_reports
for each row execute function public.set_updated_at();

drop trigger if exists contact_submissions_set_updated_at on public.contact_submissions;
create trigger contact_submissions_set_updated_at
before update on public.contact_submissions
for each row execute function public.set_updated_at();

-- ============================================================
-- Privileges
-- ============================================================

revoke all on public.profiles from anon, authenticated;
revoke all on public.partners from anon, authenticated;
revoke all on public.announcements from anon, authenticated;
revoke all on public.gallery_items from anon, authenticated;
revoke all on public.assessment_reports from anon, authenticated;
revoke all on public.contact_submissions from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on public.profiles to authenticated;

grant select, insert, update, delete on public.partners to authenticated;
grant insert on public.partners to anon;
grant select on public.partners to anon, authenticated;

grant select, insert, update, delete on public.announcements to authenticated;
grant select on public.announcements to anon;

grant select, insert, update, delete on public.gallery_items to authenticated;
grant select on public.gallery_items to anon;

grant select, insert, update, delete on public.assessment_reports to authenticated;
grant insert on public.assessment_reports to anon;

grant select, insert, update, delete on public.contact_submissions to authenticated;
grant insert on public.contact_submissions to anon;

-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.announcements enable row level security;
alter table public.gallery_items enable row level security;
alter table public.assessment_reports enable row level security;
alter table public.contact_submissions enable row level security;

alter table public.profiles force row level security;
alter table public.partners force row level security;
alter table public.announcements force row level security;
alter table public.gallery_items force row level security;
alter table public.assessment_reports force row level security;
alter table public.contact_submissions force row level security;

-- Profiles
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Partners
drop policy if exists "Public can submit partner applications" on public.partners;
create policy "Public can submit partner applications"
on public.partners for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Public can read approved partners" on public.partners;
create policy "Public can read approved partners"
on public.partners for select
to anon, authenticated
using (status = 'approved' or public.is_admin());

drop policy if exists "Admins can manage partners" on public.partners;
create policy "Admins can manage partners"
on public.partners for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Announcements
drop policy if exists "Public can read published announcements" on public.announcements;
create policy "Public can read published announcements"
on public.announcements for select
to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage announcements" on public.announcements;
create policy "Admins can manage announcements"
on public.announcements for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Gallery
drop policy if exists "Public can read published gallery items" on public.gallery_items;
create policy "Public can read published gallery items"
on public.gallery_items for select
to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage gallery items" on public.gallery_items;
create policy "Admins can manage gallery items"
on public.gallery_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Assessment reports
drop policy if exists "Public can create assessment reports" on public.assessment_reports;
create policy "Public can create assessment reports"
on public.assessment_reports for insert
to anon, authenticated
with check (
  auth.uid() is null
  or user_id is null
  or user_id = auth.uid()
);

drop policy if exists "Public can read inserted assessment reports" on public.assessment_reports;

drop policy if exists "Users can read own assessment reports" on public.assessment_reports;
create policy "Users can read own assessment reports"
on public.assessment_reports for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage assessment reports" on public.assessment_reports;
create policy "Admins can manage assessment reports"
on public.assessment_reports for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Contact submissions
drop policy if exists "Public can create contact submissions" on public.contact_submissions;
create policy "Public can create contact submissions"
on public.contact_submissions for insert
to anon, authenticated
with check (status = 'unread');

drop policy if exists "Public can read inserted contact submissions" on public.contact_submissions;

drop policy if exists "Admins can manage contact submissions" on public.contact_submissions;
create policy "Admins can manage contact submissions"
on public.contact_submissions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ============================================================
-- Verification queries
-- ============================================================

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'profiles',
    'partners',
    'announcements',
    'gallery_items',
    'assessment_reports',
    'contact_submissions'
  )
order by tablename, policyname;
