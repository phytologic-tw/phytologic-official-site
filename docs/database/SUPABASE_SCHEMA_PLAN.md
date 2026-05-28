# Supabase Schema 規劃

更新日期：2026-05-20

## 目前檔案

- `supabase/website_expansion.sql`：主要網站資料表、RLS、Storage bucket 與 policy。
- `supabase/assessments.sql`：早期快篩資料表，暫時保留。
- `supabase/inflammation_question_bank.sql`：發炎指數動態題庫、11 大器官分類、年齡層題庫與抽題 function。
- `src/lib/supabase.js`：前端 Supabase client。
- `api/admin.js`：後台以 service role 操作 Supabase。

## 主要資料表

### `partners`

用途：合作夥伴申請與前台展示。

主要欄位：

- `id`
- `partner_name`
- `city`
- `category`
- `contact_name`
- `phone`
- `email`
- `facebook_url`
- `instagram_url`
- `website_url`
- `description`
- `status`
- `created_at`

狀態：`pending`、`approved`、`rejected`

前台可新增 `pending` 申請，只讀取 `approved` 合作夥伴。

### `announcements`

用途：最新消息、品牌公告、活動公告與文章。

主要欄位：

- `id`
- `title`
- `category`
- `summary`
- `content`
- `cover_image_url`
- `status`
- `is_pinned`
- `published_at`
- `created_at`

狀態：`draft`、`published`、`archived`

前台只讀取 `published` 公告。

### `gallery_items`

用途：精彩剪影圖文影音。

主要欄位：

- `id`
- `title`
- `type`
- `category`
- `media_url`
- `thumbnail_url`
- `description`
- `status`
- `published_at`
- `created_at`

類型：`photo`、`video`

前台只讀取 `published` 剪影。

### `assessment_reports`

用途：保存 Dr.Marvin / 派森快篩結果、AI 分析與完整報告資料。

主要欄位：

- `id`
- `name`
- `gender`
- `age`
- `age_group`
- `height_cm`
- `weight_kg`
- `bmi`
- `work_type`
- `sleep_hours`
- `sleep_quality`
- `exercise_habit`
- `diet_pattern`
- `stress_level`
- `answers`
- `total_score`
- `inflammation_level`
- `system_scores`
- `primary_systems`
- `recommended_products`
- `ai_analysis`
- `lifestyle_advice`
- `partial_report`
- `full_report`
- `has_joined_line`
- `created_at`

目前前台可 insert，不開放前台 select 完整報告。

### `inflammation_*`

用途：保存 Dr. Marvin 發炎指數題庫，支援依會員年齡、性別、健康關注自動抽題。

主要資料表：

- `inflammation_organ_categories`：人體器官 11 大類。
- `inflammation_question_banks`：年齡層題庫版本，目前為連續五層 12-19、20-34、35-49、50-64、65-99；題庫標題保留原始內容來源年齡。
- `inflammation_question_items`：題目本體，共 475 題，含七大身體系統、11 大器官分類、年齡與性別適用條件。
- `inflammation_question_selection_rules`：每個題庫的深度篩檢預設 25 題抽題數、器官平衡與會員基本資料訊號權重。
- `inflammation_score_thresholds`：各年齡層分數門檻與建議文案。
- `inflammation_assessments`：未來保存會員完成發炎指數測驗的答案、系統分數、器官分類分數與 AI 摘要。

輔助 function：

- `select_inflammation_questions_for_profile(profile_id, target_count)`：讀取 `profiles.birth_date` / `birthdate`、`profiles.gender`、`profiles.blood_type`、`profiles.city`、`profiles.sleep_hours`、`profiles.sleep_quality`、`profiles.diet_pattern` / `diet_type`、`profiles.stress_level` / `stress_score`、`profiles.health_concerns`，選擇最適合的年齡層題庫並平衡 11 大器官分類抽題。會員必須已填生日或年齡、性別、血型、城市、睡眠、飲食、壓力與健康關注；資料不足時不 fallback 抽題。血型與城市只用於穩定個人化排序，不作醫療判斷。

狀態：已建立 migration 檔；尚未確認是否已套用至 production Supabase，也尚未串接 LIFF 前端。

### `profiles`

用途：Phase 0 後的 LINE / LIFF 會員唯一主表，並保留後台 Auth / RBAC 所需欄位。

Phase 0 已補齊 LINE 會員欄位、會員經濟欄位與健康狀態欄位，包含：

- LINE identity：`line_user_id`、`line_display_name`、`line_picture_url`
- 會員資料：`nickname`、`birth_date`、`blood_type`、`gender`、`numerology_number`
- 推廣追蹤：`promoter_id`、`promoter_type`、`referral_source`、`event_id`
- 點數與養成：`p_points`、`cp_points`、`le_points`、`health_score`、`streak_days`、`last_checkin_date`

`line_members` 已於 Phase 0 移除，不再作為會員資料來源。

### `contact_submissions`

用途：聯絡表單資料。

目前 schema 已規劃，前台聯絡表單仍以展示型為主，是否正式串接需後續確認。

## Storage

目前 bucket：

- `gallery`
- `announcements`

用途：

- `gallery`：後台精彩剪影上傳圖片或影片。
- `announcements`：公告封面或公告素材。

目前 policy 方向：

- 公開讀取 gallery / announcements files。
- 管理操作需搭配 admin 權限或 service role API。

## RLS 原則

- 公開資料只開放必要欄位與必要狀態。
- 使用者可提交合作申請與快篩報告，但不應讀取他人完整報告。
- Admin 操作目前主要透過 `/api/admin` + service role。
- 未來若導入 Supabase Auth，需重新檢查 service role API 與 RLS 的責任分界。

## 下一階段 Schema 規劃

LINE full report delivery：

- `assessment_reports.line_user_id`
- `assessment_reports.line_sent_at`
- `assessment_reports.member_id` / `assessment_reports.profile_id` 關聯 `profiles(id)`

會員系統：

- LINE userId 與會員資料綁定
- 快篩報告與會員關聯
- 會員分級與顧問權限

Admin：

- 將 passcode gate 升級為 Supabase Auth / LINE Login / RBAC。
- 明確定義 `admin`、`viewer`、可能的 `advisor` 權限。

Migration 原則：

1. 每次 schema 調整先寫入 SQL migration。
2. 避免直接刪除欄位或破壞既有資料。
3. 前端讀寫欄位調整需同步更新文件。
4. RLS policy 需與實際前台/後台資料流一起驗證。
