# Supabase Schema 規劃

更新日期：2026-05-20

## 目前檔案

- `supabase/website_expansion.sql`：主要網站資料表、RLS、Storage bucket 與 policy。
- `supabase/assessments.sql`：早期快篩資料表，暫時保留。
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

### `profiles`

用途：未來 Auth / RBAC 使用。

目前欄位包含 `email`、`full_name`、`role`，`role` 可為 `admin` 或 `viewer`。

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
- `line_members`

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

