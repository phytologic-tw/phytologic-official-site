-- ============================================================
-- Phytologic 命理資料庫 Migration
-- 檔名: 01_astro_migration.sql
-- 包含：生命靈數 + 紫微斗數 資料表結構
-- 參照 Dr. Marvin question_engine 架構模式
-- ============================================================

-- ────────────────────────────────────────────
-- BLOCK 1：生命靈數 靜態知識庫
-- ────────────────────────────────────────────

-- 主宰數完整知識庫（數字 2-11, 22）
CREATE TABLE IF NOT EXISTS numerology_master_numbers (
  id                  SERIAL PRIMARY KEY,
  master_number       SMALLINT NOT NULL UNIQUE,  -- 2~11, 22
  label               TEXT NOT NULL,             -- 和平締造者
  core_tags           TEXT[] NOT NULL,           -- ['直覺敏銳','善於合作']
  life_goal           TEXT NOT NULL,             -- 人生目標敘述
  best_expression     TEXT NOT NULL,             -- 最佳表達方式
  shadow_trait        TEXT NOT NULL,             -- 陰影面/盲點
  ai_prompt_hint      TEXT NOT NULL,             -- AI 撰寫報告時的語氣提示
  suitable_careers    TEXT[] NOT NULL,           -- 最適職業
  health_tendency     TEXT,                      -- 健康傾向（供 Dr. Marvin 參考）
  element_affinity    TEXT,                      -- 五行/元素對應
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 日數知識庫（出生日的數字，1~11, 22）
CREATE TABLE IF NOT EXISTS numerology_day_numbers (
  id                  SERIAL PRIMARY KEY,
  day_number          SMALLINT NOT NULL UNIQUE,  -- 1~11, 22
  external_label      TEXT NOT NULL,             -- 外在形象標籤
  social_traits       TEXT NOT NULL,             -- 社交特質描述
  shadow_trigger      TEXT,                      -- 失控觸發條件
  recovery_advice     TEXT,                      -- 康復建議
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 數字 0-9 基礎能量定義（九宮格底層字典）
CREATE TABLE IF NOT EXISTS numerology_base_digits (
  digit               SMALLINT PRIMARY KEY,      -- 0~9
  archetype           TEXT NOT NULL,             -- 絕對數字/溝通器
  dimension           TEXT NOT NULL,             -- 身體/心智/靈魂
  layer               TEXT NOT NULL,             -- body/mind/soul
  core_keyword        TEXT NOT NULL,             -- 溝通、直覺、記憶…
  positive_expression TEXT NOT NULL,
  negative_expression TEXT NOT NULL,
  health_link         TEXT,                      -- 對應身體健康面向
  ai_tag              TEXT[]                     -- AI 分析標籤
);

-- 個體性之箭（連線 / 缺線）
CREATE TABLE IF NOT EXISTS numerology_arrows (
  id                  SERIAL PRIMARY KEY,
  arrow_type          TEXT NOT NULL CHECK (arrow_type IN ('strength','weakness')),
  digits_required     SMALLINT[] NOT NULL,       -- [1,5,9] 或缺 [1,5,9]
  arrow_name          TEXT NOT NULL,             -- 決心之箭
  core_tags           TEXT[] NOT NULL,
  ai_insight          TEXT NOT NULL,             -- AI 洞察文字
  blind_spot          TEXT,                      -- 盲點提醒
  recovery_advice     TEXT,                      -- 弱點箭的克服方案
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 孤立數字（四個角落孤立邏輯）
CREATE TABLE IF NOT EXISTS numerology_isolated_digits (
  id                  SERIAL PRIMARY KEY,
  digit               SMALLINT NOT NULL UNIQUE CHECK (digit IN (1,3,7,9)),
  trigger_condition   TEXT NOT NULL,             -- 觸發條件描述
  core_expression     TEXT NOT NULL,             -- 核心表現
  empathy_opener      TEXT NOT NULL,             -- AI 同理心開場語
  recovery_advice     TEXT NOT NULL,             -- 修正建議
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 個人流年知識庫（1-9）
CREATE TABLE IF NOT EXISTS numerology_personal_years (
  id                  SERIAL PRIMARY KEY,
  year_number         SMALLINT NOT NULL UNIQUE,  -- 1~9
  year_label          TEXT NOT NULL,             -- 積極調整之年
  wave_position       TEXT NOT NULL CHECK (wave_position IN ('peak','valley','rising','stable')),
  core_theme          TEXT NOT NULL,
  ai_advice           TEXT NOT NULL,
  ai_warning          TEXT,
  transition_month    SMALLINT,                  -- 幾月起進入下一個流年能量
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 太陽星座健康補充資料庫
CREATE TABLE IF NOT EXISTS astro_zodiac_health (
  id                  SERIAL PRIMARY KEY,
  zodiac_sign         TEXT NOT NULL UNIQUE,      -- '牡羊座'
  date_start          TEXT NOT NULL,             -- '3/21'
  date_end            TEXT NOT NULL,             -- '4/20'
  element             TEXT NOT NULL CHECK (element IN ('fire','earth','air','water')),
  triplicity          TEXT NOT NULL CHECK (triplicity IN ('head','body','feet')),
  core_traits         TEXT[] NOT NULL,
  shadow_traits       TEXT[] NOT NULL,
  vulnerable_areas    TEXT NOT NULL,             -- 脆弱的身體部位
  recommended_foods   TEXT NOT NULL,             -- 推薦飲食（與植本產品連結用）
  avoid_foods         TEXT,
  cell_salt           TEXT,                      -- 細胞鹽
  karmic_lesson       TEXT NOT NULL,             -- 業力課題
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- BLOCK 2：紫微斗數 靜態知識庫
-- ────────────────────────────────────────────

-- 十四主星星性資料庫
CREATE TABLE IF NOT EXISTS zwds_stars (
  id                  SERIAL PRIMARY KEY,
  star_name           TEXT NOT NULL UNIQUE,      -- '紫微星'
  star_label          TEXT NOT NULL,             -- '帝座'
  element             TEXT NOT NULL,             -- '土'
  polarity            TEXT NOT NULL CHECK (polarity IN ('north','south','neutral')),
  core_keywords       TEXT[] NOT NULL,           -- ['尊貴','領導','穩重']
  positive_traits     TEXT NOT NULL,
  shadow_traits       TEXT NOT NULL,
  ai_positive_prompt  TEXT NOT NULL,             -- 化祿時的 AI 正向語料
  ai_warning_prompt   TEXT NOT NULL,             -- 化忌時的 AI 注意語料
  health_domain       TEXT,                      -- 對應健康/身體領域
  life_domain         TEXT,                      -- 對應人生領域（財帛/官祿等）
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 十天干四化對照表（流日運勢核心引擎）
CREATE TABLE IF NOT EXISTS zwds_heavenly_stems (
  id                  SERIAL PRIMARY KEY,
  stem                TEXT NOT NULL UNIQUE,      -- '甲'
  stem_element        TEXT NOT NULL,             -- '木'
  hua_lu              TEXT NOT NULL,             -- 化祿星名
  hua_quan            TEXT NOT NULL,             -- 化權星名
  hua_ke              TEXT NOT NULL,             -- 化科星名
  hua_ji              TEXT NOT NULL,             -- 化忌星名
  year_examples       INT[],                     -- [1984,1994,2004] 年份範例
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 雙星聯集能量資料庫（複合效應）
CREATE TABLE IF NOT EXISTS zwds_star_combinations (
  id                  SERIAL PRIMARY KEY,
  star_a              TEXT NOT NULL,
  star_b              TEXT NOT NULL,
  combination_label   TEXT NOT NULL,             -- '日月同輝'
  ancient_concept     TEXT NOT NULL,             -- 古籍概念
  energy_type         TEXT NOT NULL CHECK (energy_type IN ('positive','caution','mixed')),
  ai_prompt_text      TEXT NOT NULL,             -- 給 AI 的語料
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(star_a, star_b)
);

-- ────────────────────────────────────────────
-- BLOCK 3：會員命盤結果（動態，關聯 profiles）
-- ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS member_astro_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 生命靈數
  birth_date          DATE,                      -- 出生日期（計算用）
  master_number       SMALLINT,                  -- 主宰數
  day_number          SMALLINT,                  -- 日數
  life_path_digits    SMALLINT[],                -- 九宮格中所有數字陣列
  grid_matrix         JSONB,                     -- {"1":2,"3":1,"5":0,...} 九宮格各數字出現次數
  active_arrows       JSONB,                     -- {"strength":["決心之箭"],"weakness":["拖延之箭"]}
  isolated_digits     SMALLINT[],                -- [1,9] 孤立的數字
  life_number         SMALLINT,                  -- 今日流日數字（動態，每日更新）
  current_personal_year SMALLINT,               -- 當年個人流年數

  -- 紫微斗數
  birth_year_stem     TEXT,                      -- 出生年天干 '甲'
  birth_year_branch   TEXT,                      -- 出生年地支 '子'
  innate_hua_lu       TEXT,                      -- 先天化祿星
  innate_hua_quan     TEXT,                      -- 先天化權星
  innate_hua_ke       TEXT,                      -- 先天化科星
  innate_hua_ji       TEXT,                      -- 先天化忌星

  -- 太陽星座
  zodiac_sign         TEXT,                      -- '牡羊座'
  zodiac_element      TEXT,                      -- 'fire'

  -- 人格綜合維度（供 Dr. Marvin 讀取）
  personality_dimensions JSONB,                 -- {"dominant_layer":"mind","motivation_type":"self_aware","key_strength":"智力之箭"}
  health_personality_note TEXT,                 -- 人格對健康影響的摘要文字（Dr. Marvin 讀取用）

  -- 時間戳
  computed_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(profile_id)
);

-- ────────────────────────────────────────────
-- BLOCK 4：今日四卡動態內容表
-- ────────────────────────────────────────────

-- 流日數字每日訊息（靜態種子，1-9 × 4 種卡片）
CREATE TABLE IF NOT EXISTS numerology_daily_cards (
  id                  SERIAL PRIMARY KEY,
  flow_number         SMALLINT NOT NULL,         -- 今日流日數字 1~9
  card_type           TEXT NOT NULL CHECK (card_type IN (
                        'energy',        -- 今日能量
                        'color',         -- 今日好色
                        'body_tip',      -- 今日提示（身體/命理）
                        'draw_card'      -- 數字抽卡（隨機占卜）
                      )),
  title               TEXT NOT NULL,
  content             TEXT NOT NULL,             -- 主要內容文字
  lucky_color         TEXT,                      -- 幸運色（color 卡專用）
  lucky_direction     TEXT,                      -- 幸運方位（color 卡專用）
  color_hex           TEXT,                      -- 顏色 hex（前端用）
  body_area           TEXT,                      -- 身體部位提示（body_tip 用）
  plant_extract_link  TEXT,                      -- 連結的植本植萃（可選）
  positive_affirmation TEXT,                     -- 正向肯定語
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 數字抽卡牌組（每個數字多張，隨機抽取）
CREATE TABLE IF NOT EXISTS numerology_card_deck (
  id                  SERIAL PRIMARY KEY,
  number              SMALLINT NOT NULL,         -- 1~9
  card_title          TEXT NOT NULL,             -- '領導者覺醒'
  card_message        TEXT NOT NULL,             -- 占卜訊息正文
  action_hint         TEXT NOT NULL,             -- 今日行動提示
  energy_type         TEXT NOT NULL CHECK (energy_type IN ('high','neutral','reflective')),
  illustration_key    TEXT,                      -- 前端插圖 key
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- BLOCK 5：索引與 RLS
-- ────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_member_astro_profile_id ON member_astro_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_numerology_daily_cards_flow ON numerology_daily_cards(flow_number, card_type);
CREATE INDEX IF NOT EXISTS idx_numerology_deck_number ON numerology_card_deck(number);
CREATE INDEX IF NOT EXISTS idx_zwds_stems_stem ON zwds_heavenly_stems(stem);

-- RLS
ALTER TABLE member_astro_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE numerology_daily_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE numerology_card_deck ENABLE ROW LEVEL SECURITY;

-- 靜態知識庫允許所有已驗證用戶讀取
ALTER TABLE numerology_master_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE numerology_base_digits ENABLE ROW LEVEL SECURITY;
ALTER TABLE numerology_arrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE zwds_stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE zwds_heavenly_stems ENABLE ROW LEVEL SECURITY;
ALTER TABLE astro_zodiac_health ENABLE ROW LEVEL SECURITY;

-- 知識庫公開讀取（透過 service role 或 anon）
CREATE POLICY "公開讀取靜態命理知識庫" ON numerology_master_numbers FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON numerology_base_digits FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON numerology_arrows FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON numerology_personal_years FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON zwds_stars FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON zwds_heavenly_stems FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON astro_zodiac_health FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON zwds_star_combinations FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON numerology_isolated_digits FOR SELECT USING (true);
CREATE POLICY "公開讀取靜態命理知識庫" ON numerology_day_numbers FOR SELECT USING (true);
CREATE POLICY "公開讀取今日四卡" ON numerology_daily_cards FOR SELECT USING (true);
CREATE POLICY "公開讀取抽卡牌組" ON numerology_card_deck FOR SELECT USING (true);

-- 會員命盤：本人可讀寫
CREATE POLICY "會員可讀取自己的命盤" ON member_astro_profiles
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE line_user_id = auth.uid()::text)
  );
CREATE POLICY "Service role 可寫入命盤" ON member_astro_profiles
  FOR ALL USING (auth.role() = 'service_role');
