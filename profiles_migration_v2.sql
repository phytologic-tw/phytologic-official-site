-- ============================================================
-- 植本邏輯 profiles 資料表 Migration V2.0
-- 對齊會員系統 V7.0 + AI 健康報告完整規格
-- 執行環境：Supabase SQL Editor
-- 執行順序：由上至下，可重複執行（idempotent）
-- ============================================================

-- ------------------------------------------------------------
-- STEP 1：確保 profiles 主表存在
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- STEP 2：LINE 身份欄位
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists line_user_id       text unique,
  add column if not exists line_display_name  text,
  add column if not exists line_picture_url   text;

-- ------------------------------------------------------------
-- STEP 3：會員基本資料（LIFF 建檔填寫，7 項）
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists nickname           text,                    -- 暱稱
  add column if not exists birthdate          date,                    -- 出生年月日
  add column if not exists blood_type         text                     -- 血型：A / B / AB / O
    check (blood_type in ('A','B','AB','O') or blood_type is null),
  add column if not exists city               text,                    -- 居住城市
  add column if not exists sleep_hours        text,                    -- 睡眠時間
  add column if not exists diet_pattern       text,                    -- 飲食習慣
  add column if not exists stress_level       text;                    -- 壓力感受

-- ------------------------------------------------------------
-- STEP 4：由生日自動計算的體質標籤（後端寫入，不由用戶填寫）
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists life_number        integer                  -- 生命靈數 1-9
    check (life_number between 1 and 9 or life_number is null),
  add column if not exists zodiac             text,                    -- 星座（例：天蠍座）
  add column if not exists zodiac_element     text;                    -- 星座元素：火/土/風/水

-- ------------------------------------------------------------
-- STEP 5：身體數據（從快篩同步寫入）
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists gender             text,                    -- 性別
  add column if not exists age_group          text,                    -- 年齡區間
  add column if not exists height_cm          numeric,                 -- 身高
  add column if not exists weight_kg          numeric,                 -- 體重
  add column if not exists bmi                numeric,                 -- BMI（自動計算）
  add column if not exists work_type          text,                    -- 職業型態
  add column if not exists sleep_quality      text,                    -- 睡眠品質
  add column if not exists exercise_habit     text;                    -- 運動習慣

-- ------------------------------------------------------------
-- STEP 6：AI 分析結果（報告生成後寫入）
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists health_score       integer                  -- 綜合健康分數 0-100
    check (health_score between 0 and 100 or health_score is null),
  add column if not exists inflammation_level text,                    -- 最新發炎等級
  add column if not exists recommended_product text,                   -- 最新主推飲品 ID
  add column if not exists city_climate       jsonb                    -- 城市氣候參數（快取）
    default '{}'::jsonb,
  add column if not exists seven_day_plan     jsonb                    -- AI 生成的七天計畫內容
    default '{}'::jsonb,
  add column if not exists last_report_id     uuid;                    -- 最新一份報告的 ID

-- ------------------------------------------------------------
-- STEP 7：會員等級與點數系統
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists level              text not null default 'L1'
    check (level in ('L1','L2','L3','L4')),
  add column if not exists title              text not null default '改變者',
  add column if not exists referral_code      text,                    -- 推薦人編號
  add column if not exists p_points           integer not null default 0,   -- P 點數（可流通）
  add column if not exists cp_points          integer not null default 0,   -- CP 貢獻點
  add column if not exists le_points          integer not null default 0;   -- LE 幸運能量值

-- ------------------------------------------------------------
-- STEP 8：健康養成 / 打卡追蹤
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists streak_days           integer not null default 0,  -- 連續打卡天數
  add column if not exists longest_streak        integer not null default 0,  -- 歷史最長連續天數
  add column if not exists last_checkin_date     date,                        -- 最後打卡日期
  add column if not exists total_checkins        integer not null default 0,  -- 累積打卡總次數
  add column if not exists seven_day_bonus_done  boolean not null default false, -- 七日計畫完成
  add column if not exists seven_day_start_date  date,                        -- 七日計畫開始日期
  add column if not exists badges                jsonb not null default '[]'::jsonb; -- 已解鎖稱號陣列

-- ------------------------------------------------------------
-- STEP 9：assessment_reports 新增對齊欄位
-- ------------------------------------------------------------
alter table public.assessment_reports
  add column if not exists profile_id         uuid,                    -- 關聯 profiles.id（會員才有）
  add column if not exists line_user_id       text,                    -- 關聯 LINE userId
  add column if not exists second_survey      jsonb default '{}'::jsonb, -- LINE 第二次問卷答案
  add column if not exists full_ai_report     jsonb default '{}'::jsonb, -- LINE 完整 AI 報告內容
  add column if not exists seven_day_plan     jsonb default '{}'::jsonb, -- 七天計畫（存快照）
  add column if not exists report_sent_at     timestamptz,             -- LINE 推送時間
  add column if not exists day8_report_sent   boolean not null default false; -- 第 8 天報告是否已推送

-- ------------------------------------------------------------
-- STEP 10：daily_checkins 資料表（打卡紀錄）
-- ------------------------------------------------------------
create table if not exists public.daily_checkins (
  id                uuid primary key default gen_random_uuid(),
  member_id         uuid not null references public.profiles(id) on delete cascade,
  checkin_date      date not null,
  drink_product     text,                    -- 今日飲用的植萃
  drink_done        boolean default false,   -- 今日植萃是否飲用
  diet_done         boolean default false,   -- 今日飲食建議是否完成
  exercise_done     boolean default false,   -- 今日運動是否完成
  mood_score        integer check (mood_score between 1 and 5),
  energy_level      integer check (energy_level between 1 and 5),
  symptoms          jsonb default '[]'::jsonb,
  le_earned         integer default 0,
  plan_day          integer,                 -- 七天計畫第幾天（1-7）
  notes             text,
  created_at        timestamptz not null default now(),
  unique (member_id, checkin_date)           -- 每人每天只能打卡一次
);

-- ------------------------------------------------------------
-- STEP 11：daily_ai_messages（每日 AI 訊息紀錄）
-- ------------------------------------------------------------
create table if not exists public.daily_ai_messages (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references public.profiles(id) on delete cascade,
  sent_date     date not null,
  message_type  text not null               -- welcome / daily / plan_day_N / day8_report / monthly
    check (message_type in ('welcome','daily','plan','day8','monthly','survey')),
  content       jsonb not null default '{}'::jsonb,
  sent_at       timestamptz not null default now(),
  unique (member_id, sent_date, message_type)
);

-- ------------------------------------------------------------
-- STEP 12：索引
-- ------------------------------------------------------------
create index if not exists profiles_line_user_id_idx
  on public.profiles (line_user_id);

create index if not exists profiles_level_idx
  on public.profiles (level);

create index if not exists profiles_city_idx
  on public.profiles (city);

create index if not exists daily_checkins_member_date_idx
  on public.daily_checkins (member_id, checkin_date desc);

create index if not exists daily_checkins_plan_day_idx
  on public.daily_checkins (member_id, plan_day);

create index if not exists assessment_reports_line_user_idx
  on public.assessment_reports (line_user_id);

create index if not exists assessment_reports_profile_idx
  on public.assessment_reports (profile_id);

-- ------------------------------------------------------------
-- STEP 13：updated_at 自動更新 trigger
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

-- ------------------------------------------------------------
-- STEP 14：RLS 啟用
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.daily_checkins enable row level security;
alter table public.daily_checkins force row level security;
alter table public.daily_ai_messages enable row level security;
alter table public.daily_ai_messages force row level security;

-- ------------------------------------------------------------
-- STEP 15：RLS Policies
-- ------------------------------------------------------------

-- profiles：後端 service_role 完整存取，前端 anon 無法直接讀寫
drop policy if exists "Service role full access profiles" on public.profiles;
create policy "Service role full access profiles"
  on public.profiles for all
  to service_role
  using (true) with check (true);

-- assessment_reports：允許匿名 insert（快篩），service_role 完整存取
drop policy if exists "Service role full access assessment_reports" on public.assessment_reports;
create policy "Service role full access assessment_reports"
  on public.assessment_reports for all
  to service_role
  using (true) with check (true);

-- daily_checkins：只有 service_role 存取
drop policy if exists "Service role full access daily_checkins" on public.daily_checkins;
create policy "Service role full access daily_checkins"
  on public.daily_checkins for all
  to service_role
  using (true) with check (true);

-- daily_ai_messages：只有 service_role 存取
drop policy if exists "Service role full access daily_ai_messages" on public.daily_ai_messages;
create policy "Service role full access daily_ai_messages"
  on public.daily_ai_messages for all
  to service_role
  using (true) with check (true);

-- ------------------------------------------------------------
-- STEP 16：城市氣候參數表（靜態參考資料）
-- ------------------------------------------------------------
create table if not exists public.city_climate (
  city            text primary key,
  humidity        text,
  temperature     text,
  climate_type    text,
  health_risks    text[],
  water_advice    text,
  season_note     text
);

insert into public.city_climate (city, humidity, temperature, climate_type, health_risks, water_advice, season_note)
values
  ('台北', '高濕', '四季分明', '副熱帶季風', ARRAY['換季過敏','呼吸道敏感','梅雨濕邪'], '每日 2.0L', '換季前加強免疫支援'),
  ('新北', '高濕', '四季分明', '副熱帶季風', ARRAY['換季過敏','空氣品質波動'], '每日 2.0L', '同台北，山區注意濕冷'),
  ('桃園', '中濕', '溫和略乾', '副熱帶', ARRAY['乾燥型皮膚問題','空汙'], '每日 2.0L', '冬季注意乾燥保濕'),
  ('台中', '中濕', '溫和', '副熱帶', ARRAY['空汙（盆地效應）'], '每日 1.8L', '空品不佳時注意呼吸道'),
  ('台南', '中高濕', '高溫', '熱帶季風', ARRAY['高溫脫水','腸胃感染風險'], '每日 2.2L', '夏季注意中暑與腸胃保護'),
  ('高雄', '高濕', '高溫', '熱帶季風', ARRAY['濕熱型發炎','水腫傾向','腸胃負擔'], '每日 2.5L', '全年高溫，補水與排濕並重'),
  ('屏東', '高濕', '高溫', '熱帶', ARRAY['濕熱','紫外線傷害','腸胃'], '每日 2.5L', '日照強，注意抗氧化需求'),
  ('宜蘭', '極高濕', '溫涼多雨', '溫帶海洋', ARRAY['關節濕邪','呼吸道','黴菌過敏'], '每日 1.8L', '長期潮濕注意關節保養'),
  ('花蓮', '中濕', '溫和', '副熱帶', ARRAY['紫外線','季節性過敏'], '每日 2.0L', '戶外活動頻繁，注意補水'),
  ('台東', '中濕', '高溫', '熱帶', ARRAY['高溫脫水','紫外線'], '每日 2.2L', '全年溫暖，注意防曬與補水'),
  ('新竹', '中低濕', '多風乾燥', '副熱帶', ARRAY['乾燥型過敏','呼吸道乾燥'], '每日 1.8L', '冬季風大乾冷，注意保濕'),
  ('基隆', '極高濕', '多雨涼', '溫帶海洋', ARRAY['關節濕邪','呼吸道','情緒低落風險'], '每日 1.8L', '雨天多，注意維生素D與情緒維持')
on conflict (city) do update set
  humidity = excluded.humidity,
  temperature = excluded.temperature,
  climate_type = excluded.climate_type,
  health_risks = excluded.health_risks,
  water_advice = excluded.water_advice,
  season_note = excluded.season_note;

-- RLS for city_climate（公開讀取）
alter table public.city_climate enable row level security;
drop policy if exists "Public can read city climate" on public.city_climate;
create policy "Public can read city climate"
  on public.city_climate for select
  to anon, authenticated, service_role
  using (true);

-- ============================================================
-- Migration 完成
-- profiles 已包含：LINE 身份 / 建檔 7 項 / 體質標籤 / 身體數據
--                  AI 分析結果 / 會員等級點數 / 打卡追蹤
-- 新增：daily_checkins / daily_ai_messages / city_climate
-- ============================================================
