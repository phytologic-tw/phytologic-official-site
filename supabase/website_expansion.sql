create extension if not exists pgcrypto;

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
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  summary text,
  content text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_pinned boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('photo', 'video')),
  category text not null,
  media_url text not null,
  thumbnail_url text,
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_reports (
  id uuid primary key default gen_random_uuid(),
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
  total_score int not null,
  inflammation_level text not null,
  system_scores jsonb not null default '{}'::jsonb,
  primary_systems jsonb not null default '{}'::jsonb,
  recommended_products jsonb not null default '[]'::jsonb,
  ai_analysis text,
  lifestyle_advice text,
  partial_report jsonb not null default '{}'::jsonb,
  full_report jsonb not null default '{}'::jsonb,
  has_joined_line boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.assessment_reports
  add column if not exists age_group text,
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric,
  add column if not exists bmi numeric,
  add column if not exists sleep_hours text,
  add column if not exists sleep_quality text,
  add column if not exists exercise_habit text,
  add column if not exists diet_pattern text,
  add column if not exists stress_level text,
  add column if not exists answers jsonb not null default '[]'::jsonb,
  add column if not exists system_scores jsonb not null default '{}'::jsonb,
  add column if not exists ai_analysis text,
  add column if not exists lifestyle_advice text;

create index if not exists partners_status_created_at_idx on public.partners (status, created_at desc);
create index if not exists announcements_public_order_idx on public.announcements (status, is_pinned desc, published_at desc);
create index if not exists gallery_items_public_order_idx on public.gallery_items (status, published_at desc);
create index if not exists assessment_reports_created_at_idx on public.assessment_reports (created_at desc);

alter table public.partners enable row level security;
alter table public.announcements enable row level security;
alter table public.gallery_items enable row level security;
alter table public.assessment_reports enable row level security;

alter table public.partners force row level security;
alter table public.announcements force row level security;
alter table public.gallery_items force row level security;
alter table public.assessment_reports force row level security;

revoke all on public.partners from anon, authenticated;
revoke all on public.announcements from anon, authenticated;
revoke all on public.gallery_items from anon, authenticated;
revoke all on public.assessment_reports from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select, insert on public.partners to anon, authenticated;
grant select on public.announcements to anon, authenticated;
grant select on public.gallery_items to anon, authenticated;
grant insert on public.assessment_reports to anon, authenticated;

grant insert (
  partner_name,
  city,
  category,
  contact_name,
  phone,
  email,
  facebook_url,
  instagram_url,
  website_url,
  description,
  status
) on public.partners to anon, authenticated;

grant select (
  id,
  partner_name,
  city,
  category,
  description,
  facebook_url,
  instagram_url,
  website_url,
  created_at
) on public.partners to anon, authenticated;

grant select (
  id,
  title,
  category,
  summary,
  content,
  cover_image_url,
  published_at,
  is_pinned,
  created_at
) on public.announcements to anon, authenticated;

grant select (
  id,
  title,
  type,
  category,
  media_url,
  thumbnail_url,
  description,
  published_at,
  created_at
) on public.gallery_items to anon, authenticated;

grant insert (
  id,
  name,
  gender,
  age_group,
  height_cm,
  weight_kg,
  bmi,
  work_type,
  sleep_hours,
  sleep_quality,
  exercise_habit,
  diet_pattern,
  stress_level,
  answers,
  total_score,
  inflammation_level,
  system_scores,
  primary_systems,
  recommended_products,
  ai_analysis,
  lifestyle_advice,
  partial_report,
  full_report,
  has_joined_line,
  created_at
) on public.assessment_reports to anon, authenticated;

drop policy if exists "Public can submit partner applications" on public.partners;
create policy "Public can submit partner applications"
on public.partners for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "Public can read approved partners" on public.partners;
create policy "Public can read approved partners"
on public.partners for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "Public can read published announcements" on public.announcements;
create policy "Public can read published announcements"
on public.announcements for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read published gallery items" on public.gallery_items;
create policy "Public can read published gallery items"
on public.gallery_items for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can create assessment reports" on public.assessment_reports;
create policy "Public can create assessment reports"
on public.assessment_reports for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'gallery',
    'gallery',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
  ),
  (
    'announcements',
    'announcements',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read gallery files" on storage.objects;
create policy "Public can read gallery files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'gallery');

drop policy if exists "Public can read announcement files" on storage.objects;
create policy "Public can read announcement files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'announcements');

drop policy if exists "Authenticated can upload gallery files" on storage.objects;
create policy "Authenticated can upload gallery files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'gallery');

drop policy if exists "Authenticated can upload announcement files" on storage.objects;
create policy "Authenticated can upload announcement files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'announcements');

drop policy if exists "Authenticated can update gallery files" on storage.objects;
create policy "Authenticated can update gallery files"
on storage.objects for update
to authenticated
using (bucket_id = 'gallery')
with check (bucket_id = 'gallery');

drop policy if exists "Authenticated can update announcement files" on storage.objects;
create policy "Authenticated can update announcement files"
on storage.objects for update
to authenticated
using (bucket_id = 'announcements')
with check (bucket_id = 'announcements');

drop policy if exists "Authenticated can delete gallery files" on storage.objects;
create policy "Authenticated can delete gallery files"
on storage.objects for delete
to authenticated
using (bucket_id = 'gallery');

drop policy if exists "Authenticated can delete announcement files" on storage.objects;
create policy "Authenticated can delete announcement files"
on storage.objects for delete
to authenticated
using (bucket_id = 'announcements');

-- ============================================================
-- Phase 1: LINE full report delivery
-- ============================================================

-- assessment_reports 欄位確認存在（原 schema 已有，此為保護性 migration）
alter table public.assessment_reports
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
  add column if not exists system_scores jsonb not null default '{}'::jsonb,
  add column if not exists primary_systems jsonb not null default '{}'::jsonb,
  add column if not exists recommended_products jsonb not null default '[]'::jsonb,
  add column if not exists ai_analysis text,
  add column if not exists lifestyle_advice text,
  add column if not exists partial_report jsonb not null default '{}'::jsonb,
  add column if not exists full_report jsonb not null default '{}'::jsonb;

-- 後台讀取 assessment_reports 使用 service role，不需要額外 RLS policy
-- 前台 anon 無法讀取 assessment_reports（沿用現有設定）

-- ============================================================
-- TODO Phase 2: LINE Messaging API 整合
-- ============================================================
-- 1. 新增 line_user_id 欄位，綁定 LINE userId 與 assessment_id
-- alter table public.assessment_reports
--   add column if not exists line_user_id text;
-- create index if not exists assessment_reports_line_user_id_idx
--   on public.assessment_reports (line_user_id);

-- 2. 新增 line_sent_at 欄位，記錄完整報告推送時間
-- alter table public.assessment_reports
--   add column if not exists line_sent_at timestamptz;

-- 3. 建立 line_members 資料表（LINE userId 與報告對應）
-- create table if not exists public.line_members (
--   id uuid primary key default gen_random_uuid(),
--   line_user_id text not null unique,
--   assessment_id uuid references public.assessment_reports(id),
--   created_at timestamptz not null default now()
-- );
