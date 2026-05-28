-- ============================================================================
-- 植本邏輯 PHYTOLOGIC · Phase 0 Technical Debt Migration
-- ============================================================================
-- 文件：PHASE_0_MIGRATION.sql
-- 用途：完整修復 profiles/line_members 分裂、FK 衝突、缺失表的 SQL
-- 執行位置：Supabase 控制台 → SQL Editor
-- 預計執行時間：5-10 分鐘
-- ============================================================================
-- ⚠️ 重要提醒：
-- 1. 先在 TEST 環境驗證，再用於 PRODUCTION
-- 2. 執行前備份數據庫（Supabase → Backups）
-- 3. 出錯時參考 PHASE_0_TECHNICAL_DEBT.md 逐段執行
-- ============================================================================

-- Step 0：前置檢查與清理
-- ============================================================================

-- 0.1 檢查現有 line_members 表
-- 若存在，請先確認已備份且資料已遷移，再手動刪除。
-- 本檔不自動 DROP TABLE，避免未經確認的破壞性操作。
SELECT
  'line_members 存在（若 count > 0，需人工確認遷移後再刪除）' as check_item,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'line_members';

-- 0.2 檢查並備份 daily_checkins 現有數據（若有）
-- 可選：create temp table backup_checkins as select * from daily_checkins;

-- ============================================================================
-- Step 1：擴展 profiles 表 - 新增會員必需欄位
-- ============================================================================

ALTER TABLE public.profiles
  -- 基本會員資料
  ADD COLUMN IF NOT EXISTS line_user_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS line_display_name TEXT,
  ADD COLUMN IF NOT EXISTS line_picture_url TEXT,
  ADD COLUMN IF NOT EXISTS line_status_message TEXT,
  ADD COLUMN IF NOT EXISTS line_linked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS nickname TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS birthdate DATE,
  ADD COLUMN IF NOT EXISTS blood_type TEXT CHECK (blood_type IN ('A','B','AB','O')),
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male','female','other')),
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS numerology_number INTEGER CHECK (numerology_number BETWEEN 1 AND 9),
  ADD COLUMN IF NOT EXISTS life_number INTEGER CHECK (life_number BETWEEN 1 AND 9),
  
  -- 健康偏好
  ADD COLUMN IF NOT EXISTS diet_type TEXT,
  ADD COLUMN IF NOT EXISTS stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS health_concerns TEXT[],
  
  -- 推廣人追蹤
  ADD COLUMN IF NOT EXISTS promoter_id TEXT,
  ADD COLUMN IF NOT EXISTS promoter_type TEXT,
  ADD COLUMN IF NOT EXISTS referral_source TEXT,
  ADD COLUMN IF NOT EXISTS event_id TEXT,
  
  -- AI 生成內容
  ADD COLUMN IF NOT EXISTS daily_insight TEXT,
  ADD COLUMN IF NOT EXISTS daily_insight_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recommended_product_id TEXT,
  
  -- 七日啟動計畫
  ADD COLUMN IF NOT EXISTS seven_day_start_date DATE,
  ADD COLUMN IF NOT EXISTS registration_completed_at TIMESTAMPTZ,
  
  -- 遊戲化數值
  ADD COLUMN IF NOT EXISTS p_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS le_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cp_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_score INTEGER,
  ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'L1',
  ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '改變者',
  ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_checkins INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_checkin_date DATE,
  ADD COLUMN IF NOT EXISTS seven_day_bonus_done BOOLEAN DEFAULT false,
  
  -- 加入時間
  ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();

-- Step 1.1：profiles 索引
CREATE INDEX IF NOT EXISTS profiles_line_user_id_idx ON public.profiles (line_user_id);
CREATE INDEX IF NOT EXISTS profiles_promoter_id_idx ON public.profiles (promoter_id);
CREATE INDEX IF NOT EXISTS profiles_referral_source_idx ON public.profiles (referral_source);

-- ============================================================================
-- Step 2：修復 daily_checkins 表 - 移除衝突 FK
-- ============================================================================

-- 2.1 刪除舊的衝突 FK
ALTER TABLE IF EXISTS public.daily_checkins
  DROP CONSTRAINT IF EXISTS daily_checkins_member_id_fkey CASCADE;

-- 2.2 確保表存在並有正確結構
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  checkin_date DATE NOT NULL,
  product_consumed TEXT,
  drink_product TEXT,
  drink_done BOOLEAN DEFAULT false,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
  energy_score INTEGER CHECK (energy_score BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  symptoms JSONB DEFAULT '[]'::jsonb,
  le_awarded INTEGER DEFAULT 10,
  le_earned INTEGER DEFAULT 0,
  notes TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 若表已存在，額外新增缺失欄位
ALTER TABLE IF EXISTS public.daily_checkins
  ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS checkin_date DATE,
  ADD COLUMN IF NOT EXISTS product_consumed TEXT,
  ADD COLUMN IF NOT EXISTS drink_product TEXT,
  ADD COLUMN IF NOT EXISTS drink_done BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS energy_score INTEGER CHECK (energy_score BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS symptoms JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS le_awarded INTEGER DEFAULT 10,
  ADD COLUMN IF NOT EXISTS le_earned INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS note TEXT;

UPDATE public.daily_checkins
SET profile_id = member_id
WHERE profile_id IS NULL AND member_id IS NOT NULL;

ALTER TABLE IF EXISTS public.daily_checkins
  ADD CONSTRAINT daily_checkins_member_id_fkey
    FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'daily_checkins_member_date_key'
      AND conrelid = 'public.daily_checkins'::regclass
  ) THEN
    ALTER TABLE public.daily_checkins
      ADD CONSTRAINT daily_checkins_member_date_key UNIQUE (member_id, checkin_date);
  END IF;
END $$;

-- 2.4 daily_checkins 索引
CREATE INDEX IF NOT EXISTS daily_checkins_member_date_idx ON public.daily_checkins (member_id, checkin_date DESC);
CREATE INDEX IF NOT EXISTS daily_checkins_profile_id_idx ON public.daily_checkins (profile_id);
CREATE INDEX IF NOT EXISTS daily_checkins_created_at_idx ON public.daily_checkins (created_at DESC);

-- 2.5 daily_checkins RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own checkins" ON public.daily_checkins;
CREATE POLICY "Users can view own checkins" 
  ON public.daily_checkins FOR SELECT 
  USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can insert own checkins" ON public.daily_checkins;
CREATE POLICY "Users can insert own checkins" 
  ON public.daily_checkins FOR INSERT 
  WITH CHECK (auth.uid() = member_id);

DROP POLICY IF EXISTS "Users can update own checkins" ON public.daily_checkins;
CREATE POLICY "Users can update own checkins" 
  ON public.daily_checkins FOR UPDATE 
  USING (auth.uid() = member_id);

-- ============================================================================
-- Step 3：建立 daily_ai_messages 表
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.daily_ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sent_date DATE,
  message_date DATE,
  message_type TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  lucky_color TEXT,
  recommended_action TEXT,
  context JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE IF EXISTS public.daily_ai_messages
  ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS sent_date DATE,
  ADD COLUMN IF NOT EXISTS message_date DATE,
  ADD COLUMN IF NOT EXISTS message_type TEXT,
  ADD COLUMN IF NOT EXISTS lucky_color TEXT,
  ADD COLUMN IF NOT EXISTS recommended_action TEXT,
  ADD COLUMN IF NOT EXISTS context JSONB,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.daily_ai_messages
SET sent_date = message_date
WHERE sent_date IS NULL AND message_date IS NOT NULL;

UPDATE public.daily_ai_messages
SET message_date = sent_date
WHERE message_date IS NULL AND sent_date IS NOT NULL;

ALTER TABLE IF EXISTS public.daily_ai_messages
  DROP CONSTRAINT IF EXISTS daily_ai_messages_member_id_fkey;

ALTER TABLE IF EXISTS public.daily_ai_messages
  ADD CONSTRAINT daily_ai_messages_member_id_fkey
    FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'daily_ai_messages_member_sent_type_key'
      AND conrelid = 'public.daily_ai_messages'::regclass
  ) THEN
    ALTER TABLE public.daily_ai_messages
      ADD CONSTRAINT daily_ai_messages_member_sent_type_key UNIQUE (member_id, sent_date, message_type);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS daily_ai_messages_member_date_idx ON public.daily_ai_messages (member_id, sent_date DESC);
CREATE INDEX IF NOT EXISTS daily_ai_messages_created_at_idx ON public.daily_ai_messages (created_at DESC);

-- 3.1 daily_ai_messages RLS
ALTER TABLE public.daily_ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own messages" ON public.daily_ai_messages;
CREATE POLICY "Users can view own messages" 
  ON public.daily_ai_messages FOR SELECT 
  USING (auth.uid() = member_id);

DROP POLICY IF EXISTS "Authenticated can insert messages" ON public.daily_ai_messages;
CREATE POLICY "Authenticated can insert messages" 
  ON public.daily_ai_messages FOR INSERT 
  WITH CHECK (auth.uid() = member_id);

-- ============================================================================
-- Step 4：建立 promoters 表（推廣人管理）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.promoters (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  region TEXT,
  contact TEXT,
  line_url TEXT,
  qr_code_url TEXT,
  cp_per_referral INTEGER DEFAULT 0,
  cp_per_first_purchase INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS promoters_type_idx ON public.promoters (type);
CREATE INDEX IF NOT EXISTS promoters_is_active_idx ON public.promoters (is_active);

-- 4.1 promoters RLS
ALTER TABLE public.promoters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active promoters" ON public.promoters;
CREATE POLICY "Public can read active promoters" 
  ON public.promoters FOR SELECT 
  USING (is_active = true);

-- ============================================================================
-- Step 5：建立 dr_marvin_reports 表（深度健康檢測報告）
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dr_marvin_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL DEFAULT 'deep' CHECK (report_type IN ('quick', 'deep')),
  answers JSONB NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{}',
  health_score INTEGER,
  recommended_product_id TEXT,
  report_content TEXT,
  le_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dr_marvin_reports_profile_id_idx ON public.dr_marvin_reports (profile_id);
CREATE INDEX IF NOT EXISTS dr_marvin_reports_created_at_idx ON public.dr_marvin_reports (created_at DESC);

-- 5.1 dr_marvin_reports RLS
ALTER TABLE public.dr_marvin_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reports" ON public.dr_marvin_reports;
CREATE POLICY "Users can view own reports" 
  ON public.dr_marvin_reports FOR SELECT 
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert own reports" ON public.dr_marvin_reports;
CREATE POLICY "Users can insert own reports" 
  ON public.dr_marvin_reports FOR INSERT 
  WITH CHECK (auth.uid() = profile_id);

-- ============================================================================
-- Step 6：確保 profiles 表的 RLS 完整設定
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 清理舊的衝突 policy
DROP POLICY IF EXISTS "Authenticated can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated can update own profile" ON public.profiles;

-- 新建明確的 policy
CREATE POLICY "Profiles are viewable by the user who owns it"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles are updatable by the user who owns it"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Step 7：驗證查詢（執行後檢查輸出）
-- ============================================================================

-- 7.1 確認 profiles 新欄位
SELECT 
  'profiles 欄位總數' as check_item,
  COUNT(*) as count
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- 7.2 確認 line_members 是否仍存在（若存在，需人工確認遷移後再刪除）
SELECT 
  'line_members 存在（需人工確認）' as check_item,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'line_members';

-- 7.3 確認 daily_checkins FK
SELECT 
  'daily_checkins FK' as constraint_type,
  constraint_name
FROM information_schema.table_constraints 
WHERE table_schema = 'public' AND table_name = 'daily_checkins' AND constraint_type = 'FOREIGN KEY';

-- 7.4 確認新表存在
SELECT 
  table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('daily_ai_messages', 'promoters', 'dr_marvin_reports')
ORDER BY table_name;

-- ============================================================================
-- 完成訊息
-- ============================================================================
-- Phase 0 Migration 已完成！
-- 請檢查以上驗證查詢的輸出，確認：
-- ✓ profiles 欄位數 >= 25
-- ✓ line_members 若 count > 0，已人工確認遷移與刪除計畫
-- ✓ daily_checkins member_id FK 指向 profiles(id)
-- ✓ 三個新表都存在
--
-- 接下來：
-- 1. 確認 Vercel 後端密鑰已完成輪替
-- 2. 進行功能測試（打卡、報告、推廣）
-- 3. 開始 Phase 1B（首頁 + AI 洞察系統）
-- ============================================================================
