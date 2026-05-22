-- ============================================================
-- 植本邏輯 LINE 會員系統 MVP Migration
-- 執行方式：Supabase Dashboard > SQL Editor > 貼上執行
-- ============================================================

-- 1. 擴充既有 profiles 表，加入 LINE 會員所需欄位
alter table profiles
  add column if not exists line_user_id     text unique,
  add column if not exists display_name     text,
  add column if not exists picture_url      text,
  add column if not exists phone            text,
  add column if not exists gender           text,
  add column if not exists birth_year       int,
  add column if not exists age_group        text,
  add column if not exists health_type      text,
  add column if not exists recommended_drink text,
  add column if not exists lucky_color      text,
  add column if not exists level            int default 1,
  add column if not exists title            text default '改變者',
  add column if not exists le               int default 0,
  add column if not exists cp               int default 0,
  add column if not exists health_score     int default 0,
  add column if not exists streak_days      int default 0,
  add column if not exists last_checkin_date date,
  add column if not exists updated_at       timestamptz default now();

-- 擴充 assessment_reports，加入 LINE 綁定欄位
alter table assessment_reports
  add column if not exists line_user_id  text,
  add column if not exists line_sent_at  timestamptz,
  add column if not exists member_id     uuid references profiles(id);

-- 2. 每日打卡紀錄表
create table if not exists daily_checkins (
  id              uuid primary key default gen_random_uuid(),
  member_id       uuid not null references profiles(id) on delete cascade,
  checkin_date    date not null,
  drink_type      text,
  le_earned       int default 10,
  health_score_earned int default 3,
  note            text,
  created_at      timestamptz default now(),
  unique (member_id, checkin_date)
);

-- 3. 每日 AI 推播訊息表
create table if not exists daily_ai_messages (
  id                  uuid primary key default gen_random_uuid(),
  member_id           uuid not null references profiles(id) on delete cascade,
  message_date        date not null,
  message_type        text,
  content             text,
  lucky_color         text,
  recommended_action  text,
  created_at          timestamptz default now(),
  unique (member_id, message_date)
);

-- 4. Index
create index if not exists idx_profiles_line_user_id on profiles(line_user_id);
create index if not exists idx_daily_checkins_member_date on daily_checkins(member_id, checkin_date desc);
create index if not exists idx_daily_ai_messages_member_date on daily_ai_messages(member_id, message_date desc);
create index if not exists idx_assessment_reports_line_user on assessment_reports(line_user_id);
create index if not exists idx_assessment_reports_member on assessment_reports(member_id);

-- 5. updated_at trigger for profiles
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- 6. RLS
alter table daily_checkins enable row level security;
alter table daily_ai_messages enable row level security;

-- daily_checkins: admin 可讀寫全部，一般用戶只能透過 API 操作
drop policy if exists "admin_all_checkins" on daily_checkins;
create policy "admin_all_checkins" on daily_checkins
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

drop policy if exists "anon_insert_checkin" on daily_checkins;
create policy "anon_insert_checkin" on daily_checkins
  for insert with check (true);

drop policy if exists "anon_select_own_checkin" on daily_checkins;
create policy "anon_select_own_checkin" on daily_checkins
  for select using (true);

-- daily_ai_messages: admin 可讀寫全部
drop policy if exists "admin_all_ai_messages" on daily_ai_messages;
create policy "admin_all_ai_messages" on daily_ai_messages
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

drop policy if exists "anon_select_ai_messages" on daily_ai_messages;
create policy "anon_select_ai_messages" on daily_ai_messages
  for select using (true);

drop policy if exists "anon_insert_ai_messages" on daily_ai_messages;
create policy "anon_insert_ai_messages" on daily_ai_messages
  for insert with check (true);

-- 稱號等級 helper function
create or replace function get_member_title(p_level int)
returns text language plpgsql as $$
begin
  return case p_level
    when 1 then '改變者'
    when 2 then '實踐者'
    when 3 then '教育家'
    when 4 then '實業家'
    else '傳承者'
  end;
end;
$$;
