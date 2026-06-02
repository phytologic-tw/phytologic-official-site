# 植本邏輯 PHYTOLOGIC｜專案進度追蹤

> 這份文件是給 Claude 讀的「單一真相文件」。
> 每次有進展時更新這裡，開新對話前上傳到 Claude Project 知識庫取代舊版。
> 格式盡量保持簡短，讓 Claude 能快速抓到重點。

> 最新進度請優先讀：`PROJECT_PROGRESS_2026-05-25.md`。
> 該檔已整理 Phase 1 會員首頁、打卡、My Dr. Marvin、報告、Rich Menu、Webhook、推薦、任務、Admin 推廣人與 Vercel Hobby function 上限修正的最新狀態。

> **2026-05-29 Phase 0 production schema audit 已完成。**
> production schema 主體與 `profiles` canonical 方向對齊。詳見下方「資料庫資料表現況」與「目前優先任務」。

> **2026-06-02 Dr. Marvin 題庫引擎可用化完成。**
> 已新增正式 migration `dr_marvin_question_engine.sql`、25 題抽題 API `/api/dr-marvin/questions`，並將 `/line/assessment` 接上動態題庫與報告 API。Bryan 已於 Supabase SQL Editor 套用完成並驗證：`question_bank` 475 筆、`inflammation_alerts` 8 筆、`anti_inflammation_protocols` 21 筆、`member_question_history` 存在。

> **2026-06-02 Production hotfix 已推送。**
> 修復 `/api/dr-marvin/analyze` 在 Vercel 啟動失敗問題：`src/server/products.js` 原本錯誤指向不存在的 `src/data/products.js`，已改為根目錄 `data/products.js`。本機驗證 `api/dr-marvin/analyze.js` 可 import，`npm run build` 成功；commit `0ca96b3` 已 push 至 `main`。

> **2026-06-02 命理資料庫與今日四卡已套用至 Production Supabase。**
> 已新增 `supabase/astro_migration.sql`、`seed_numerology.sql`、`seed_zwds.sql`、`seed_daily_cards.sql`、`src/lib/astroCalc.js`，並在 `api/member.js` 增加 `resource=astro-init|astro-daily-cards`。`LineMemberHomePage` 今日植本靈感輪播已接入今日四卡資料來源。Bryan 已回報四支 SQL 皆於 Supabase SQL Editor 執行完畢；目前尚待 count 查詢回報以完成筆數驗證。

---

## 基本資訊（不常變動）

| 項目 | 內容 |
|------|------|
| 專案名稱 | 植本邏輯 PHYTOLOGIC |
| 正式網站 | https://phytologic.tw |
| 後台入口 | https://phytologic.tw/admin |
| GitHub | phytologic-tw/phytologic-official-site |
| 部署平台 | Vercel |
| 資料庫 | Supabase |
| 主要聯絡 | bryan@phytologic.tw |

---

## 技術堆疊

| 技術 | 狀態 | 備註 |
|------|------|------|
| React | ✅ 正常 | `react: latest` |
| React DOM | ✅ 正常 | `react-dom: latest` |
| Vite | ✅ 正常 | `vite: latest`，build 成功 |
| Tailwind CSS | ✅ 正常 | `tailwindcss: ^3.4.17` |
| PostCSS / Autoprefixer | ✅ 正常 | 前端樣式工具 |
| Supabase JS | ✅ 正常 | `@supabase/supabase-js: ^2.105.4` |
| LINE LIFF SDK | 🔧 進行中 | `@line/liff: ^2.29.0`，已有 LIFF 初始化與頁面 |
| Vercel Serverless | ✅ 正常 | `api/*.js` 目前 12 支 function，符合 Hobby 上限 |
| Anthropic API | 🔧 進行中 | 未安裝 `anthropic` 套件，目前 `api/analyze.js` 用 `fetch` 呼叫 |
| Framer Motion | ✅ 正常 | `framer-motion: latest` |
| Lucide React | ✅ 正常 | `lucide-react: latest` |

---

## 重要檔案位置

| 功能 | 檔案路徑 |
|------|------|
| 主路由 / 官網頁面 | `src/App.jsx` |
| 全域樣式 | `src/style.css` |
| 健康快篩問卷 | `src/components/HealthAssessment.jsx` |
| LINE 解鎖卡片 | `src/components/line/UnlockFullReportCard.jsx` |
| LINE 導流設定 | `src/components/line/lineConfig.js` |
| LINE QR Code | `src/components/line/LineQRCode.jsx` |
| LINE 浮動按鈕 | `src/components/line/FloatingLineButton.jsx` |
| LINE CTA | `src/components/line/LineCTA.jsx` |
| LIFF / LINE Auth | `src/lib/lineAuth.js` |
| LINE 會員資料操作 | `src/lib/memberProfile.js` |
| 每日健康訊息 | `src/lib/dailyMessage.js` |
| Supabase client | `src/lib/supabase.js` |
| 後台資料操作 | `src/lib/adminData.js` |
| 後台 seed / local fallback | `src/lib/adminSeed.js`、`src/lib/adminStorage.js` |
| AI 分析 API | `api/analyze.js` |
| 後台管理 API（舊 passcode/service role 流程） | `api/admin.js` |
| LINE Webhook | `api/line-webhook.js` |
| Server-only utility | `src/server/`（原 `api/_*.js` 已移出 `/api`，避免被 Vercel 算作 function） |
| LINE 會員 API | `api/member.js`（`resource=home|reports|astro-init|astro-daily-cards`） |
| DB Schema 主檔 | `supabase/website_expansion.sql` |
| DB RLS 修復 | `supabase/admin_rls_repair.sql` |
| 命理資料庫 migration | `supabase/astro_migration.sql`（Bryan 已於 Production Supabase 套用） |
| 命理資料庫 seed | `supabase/seed_numerology.sql`、`supabase/seed_zwds.sql`、`supabase/seed_daily_cards.sql` |
| Dr. Marvin 題庫正式 migration | `supabase/dr_marvin_question_engine.sql` |
| Dr. Marvin 抽題 API | `api/dr-marvin/questions.js` |
| Dr. Marvin 題庫 seed | `supabase/seed_question_bank.sql` |
| Dr. Marvin 交集警示 seed | `supabase/seed_inflammation_alerts.sql` |
| Dr. Marvin 抗發炎處方 seed | `supabase/seed_anti_inflammation_protocols.sql` |
| Dr. Marvin SQL Editor 執行順序 | `supabase/DR_MARVIN_SQL_EDITOR_ORDER.md` |
| LINE 會員 MVP migration | `supabase/line_member_mvp.sql` |
| 舊版 assessments schema | `supabase/assessments.sql` |
| Admin 後台 | `src/components/admin/AdminDashboard.jsx` |
| LINE 入口頁 | `src/pages/line/LineEntry.jsx` |
| LINE 今日頁 | `src/pages/line/LineTodayPage.jsx` |
| LINE 打卡頁 | `src/pages/line/LineCheckinPage.jsx` |
| LINE 會員資料頁 | `src/pages/line/LineProfilePage.jsx` |
| LINE 任務頁 | `src/pages/line/LineTasksPage.jsx` |
| LINE 商城頁 | `src/pages/line/LineShopPage.jsx` |

---

## 資料庫資料表現況

| 資料表 | 狀態 | 備註 |
|------|------|------|
| `profiles` | ✅ Production 已確認 | **2026-05-29 audit**：V2 所有欄位到位（`line_user_id` unique、`level`/`p_points`/`cp_points`/`le_points` 新命名全數確認）。技術債：舊欄位 `lp`/`cp`/`member_level`/`member_title` 仍殘留，不影響流程 |
| `partners` | ✅ 正常 | 合作夥伴資料表 |
| `announcements` | ✅ 正常 | 最新消息資料表 |
| `gallery_items` | ✅ 正常 | Gallery 資料表 |
| `assessment_reports` | ✅ Production 已確認 | **2026-05-29 audit**：`line_user_id`/`line_sent_at`/`member_id`/`short_code`/`full_ai_report`/`seven_day_plan`/`report_sent_at` 全部確認。FK `assessment_reports_member_id_fkey` → `profiles(id)` |
| `contact_submissions` | ✅ 正常 | 聯絡表單資料表 |
| `assessments` | ⚠️ 待確認 | `supabase/assessments.sql` 舊表，是否仍使用待確認 |
| `line_members` | ✅ 已確認不存在 | **2026-05-29 audit**：production HTTP 404，表不存在，無任何 orphan `line_member_id` 欄位 |
| `daily_checkins` | ✅ FK 已確認 | **2026-05-29 audit**：`daily_checkins_member_id_fkey` → `profiles(id)` ✅。技術債：`daily_checkins_profile_id_fkey` → `profiles(id)` 並存（雙 FK），PostgREST join 需指定 FK 名稱，不影響功能 |
| `daily_ai_messages` | ✅ FK 已確認 | **2026-05-29 audit**：單一 FK → `profiles(id)`，無歧義 |
| `promoters` | ✅ Production 已確認 | **2026-05-29 audit**：table 存在，`id`/`type`/`name`/`cp_per_referral`/`cp_per_first_purchase`/`is_active` 全部到位 |
| `dr_marvin_reports` | ✅ Production 已確認 | **2026-05-29 audit**：table 存在，`profile_id` FK → `profiles(id)` 確認 |
| `question_bank` | ✅ Production 已套用 | **2026-06-02**：Bryan SQL Editor 驗證 475 筆；seed 可重複執行，已補舊 schema 相容前置修補 |
| `inflammation_alerts` | ✅ Production 已套用 | **2026-06-02**：Bryan SQL Editor 驗證 8 筆；seed 可重複執行 |
| `anti_inflammation_protocols` | ✅ Production 已套用 | **2026-06-02**：Bryan SQL Editor 驗證 21 筆；seed 可重複執行，已補舊 schema 相容前置修補 |
| `member_question_history` | ✅ Production 已套用 / hotfix 已執行 | **2026-06-02**：Bryan 已於 SQL Editor 執行 `supabase/dr_marvin_member_question_history_session_patch.sql`，補齊 `assessment_session_id`、作答回填欄位與 schema cache reload；供 30 天抽題避重與作答回填使用 |
| `member_astro_profiles` | ✅ Bryan 回報 Production 已套用 | **2026-06-02**：由 `supabase/astro_migration.sql` 建立；關聯 `profiles(id)`，保存主宰數、日數、九宮格、個體性之箭、紫微四化與太陽星座。尚待 count/schema 查詢回報完成驗證 |
| `numerology_*` / `zwds_*` / `astro_zodiac_health` | ✅ Bryan 回報 Production 已套用 | **2026-06-02**：包含生命靈數靜態知識庫、紫微斗數主星/天干四化/雙星聯集、今日四卡與抽卡牌組；四支 SQL 已由 Bryan 手動套用。尚待 count 查詢回報完成筆數驗證 |
| `city_climate` | ⚠️ 資料不足 | **2026-05-29 audit**：table 存在但只有 `city`/`temperature`/`humidity`，缺少季節/氣候描述欄位，影響 AI 報告品質（不阻斷功能） |

**assessment_reports 欄位確認（2026-05-29 production audit）：**
- `line_user_id` — ✅ production 確認存在
- `line_sent_at` — ✅ production 確認存在
- `member_id` — ✅ production 確認存在，FK（`assessment_reports_member_id_fkey`）→ `profiles(id)`
- `short_code` — ✅ production 確認存在（webhook UUID 前 8 碼主路徑 + `short_code` fallback 均可用）
- `has_joined_line` — ✅ production 確認存在
- `full_report` / `partial_report` — ✅ production 確認存在
- `recommended_products` / `ai_analysis` — ✅ production 確認存在
- `full_ai_report` / `seven_day_plan` / `report_sent_at` — ✅ production 確認存在（V2 webhook 回寫欄位）
- 注意：`profiles.latest_assessment_id` 在 production 有 FK → `assessment_reports(id)`，但未出現在任何已知 migration 檔，需補文件記錄（技術債，不阻斷）

---

## 環境變數清單

### 前端（Vercel / .env.local）

| 變數 | 用途 | 狀態 |
|------|------|------|
| `VITE_SUPABASE_URL` | Supabase 前端連線 | ✅ 正常 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 前端 anon key | ✅ 正常 |
| `VITE_ADMIN_PASSCODE` | localStorage demo fallback 後台密碼 | ✅ 正常 |
| `VITE_LINE_OA_URL` | LINE 官方帳號 URL | ⚠️ 待確認 |
| `VITE_LINE_OFFICIAL_URL` | LINE 官方帳號 URL 備用 | ⚠️ 待確認 |
| `VITE_LINE_CTA_URL` | LINE CTA 連結備用 | ⚠️ 待確認 |
| `VITE_LINE_LIFF_ID` | LIFF App ID | 🔧 進行中，程式有引用；目前工作區 `.env.example` 已補，但尚未確認是否已提交 / 部署 |

### 後端（Vercel Environment Variables）

| 變數 | 用途 | 狀態 |
|------|------|------|
| `ANTHROPIC_API_KEY` | `api/analyze.js` 呼叫 Anthropic API | ✅ 正常 |
| `SUPABASE_URL` | 後端 Supabase URL | ✅ 正常，production 已確認 |
| `SUPABASE_SERVICE_ROLE_KEY` | 後端 service role key | ✅ 正常，production health check 已確認 JWT role 為 `service_role` |
| `ADMIN_PASSCODE` | `api/admin.js` 舊後台 API 驗證 | ⚠️ 待確認 |
| `LINE_CHANNEL_SECRET` | LINE Webhook signature 驗證 | ✅ 正常，production 已確認；目前工作區 `.env.example` 已補，但尚未確認是否已提交 |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE reply / push API token | ✅ 正常，production 已確認；目前工作區 `.env.example` 已補，但尚未確認是否已提交 |
| `VITE_SUPABASE_URL` | 後端 fallback 使用 | ⚠️ 待確認，不建議後端依賴 VITE 前綴 |

---

## 前台路由現況

| 路由 | 功能 | 狀態 |
|------|------|------|
| `/` | 品牌首頁 | ✅ 正常 |
| `/about` | 品牌故事 | ✅ 正常 |
| `/products` | 產品總覽 | ✅ 正常 |
| `/products/:slug` | 產品詳情 | ✅ 正常 |
| `/assessment` | Dr.Marvin 快篩 | ✅ 正常 |
| `/join` | 合作 / 加入入口 | ✅ 正常 |
| `/partners` | 合作夥伴 | ✅ 正常 |
| `/news` | 最新消息 | ✅ 正常 |
| `/gallery` | 精彩剪影 | ✅ 正常 |
| `/admin` | 後台入口，導向 dashboard | ✅ 正常 |
| `/admin/dashboard` | 後台總覽 | ✅ 正常 |
| `/admin/partners` | 合作夥伴管理 | ✅ 正常 |
| `/admin/news` | 最新消息管理 | ✅ 正常 |
| `/admin/gallery` | Gallery 管理 | ✅ 正常 |
| `/admin/assessments` | 快篩結果查閱 | ✅ 正常 |
| `/admin/contact` | 聯絡表單管理 | ✅ 正常 |
| `/admin/settings` | 系統設定 | ✅ 正常 |
| `/line/member-home` | LINE LIFF 會員首頁（重構 v3：任務中心整合打卡、植本百科入口、靈感輪播對齊） | ✅ 已更新（2026-06-02）|
| `/line/entry` | LIFF 入口 / 建立會員 | 🔧 進行中 |
| `/line/today` | LINE 今日狀態 | 🔧 進行中 |
| `/line/checkin` | 今日打卡 | 🔧 進行中 |
| `/line/profile` | LINE 會員資料 | 🔧 進行中 |
| `/line/tasks` | LINE 任務頁 | 🔧 進行中 |
| `/line/missions` | LINE 任務中心 alias | ✅ 對應 `/line/tasks` |
| `/line/shop` | LINE 商城導流 | 🔧 進行中 |
| `/line/assessment` | My Dr. Marvin 25 題動態問卷 | ✅ 已接 API（Production 題庫已套用） |
| `/line/encyclopedia` | 植本百科商品陳列（第一層） | ✅ 已完成（2026-06-02） |
| `/line/encyclopedia/:productId` | 商品詳情五 Tab（第二層） | ✅ 已完成（2026-06-02） |
| `/line/encyclopedia/:productId/wiki/:ingredientId` | 植物原料百科（第三層） | ✅ 已完成（2026-06-02） |

---

## LINE 系統現況（最關鍵）

### 2026-05-22 Production Debug 結論
- 正式 Vercel 專案是 `phytologic-official-site-esme`，不是 `phytologic-official-site`。
- LINE Developers Webhook URL 使用 `https://www.phytologic.tw/api/line-webhook`，避免 `phytologic.tw` → `www.phytologic.tw` 的 307 redirect 造成 POST 失效。
- LINE OA 自動回應訊息需關閉，否則 webhook 不會收到使用者訊息。
- Production health check：`GET https://www.phytologic.tw/api/line-webhook` 會回傳 env 診斷，不暴露 secret。
- 已確認 production env：
  - `supabaseUrlConfigured: true`
  - `supabaseKeyType: "legacy-jwt"`
  - `supabaseJwtRole: "service_role"`
  - `lineSecretConfigured: true`
  - `lineTokenConfigured: true`
- 重要事故：`SUPABASE_SERVICE_ROLE_KEY` 曾誤填 anon key，導致 webhook 查 `assessment_reports` 時回 `42501` 權限錯誤。已更新為 service_role key 並重新部署。
- 安全維運：service role key 曾在對話中貼出；無外洩直接證據，已降為 Medium Priority 排程項目，待功能驗收後擇期執行 rotate（Bryan 手動操作 Supabase dashboard）。

### 已完成
- `api/line-webhook.js` 已存在，支援 LINE Webhook POST。
- Webhook 已改用 raw body 驗證 `x-line-signature`；`LINE_CHANNEL_SECRET` 缺少時不再放行。
- Webhook 支援 GET health check，回傳 env 是否存在與 Supabase JWT role，便於 production 除錯。
- Webhook 已處理 `follow` 事件，使用者加入官方帳號時會收到歡迎與報告編號提示。
- Webhook 目前處理 `message` + `text` 事件。
- 使用者輸入 8 碼英數報告編號時，webhook 會查詢 `assessment_reports`。
- 報告查詢邏輯已對齊前端：優先使用 UUID 前 8 碼查詢 `assessment_reports.id`，找不到時才 fallback 查 `short_code`。
- 查詢成功後，webhook 會 PATCH `assessment_reports.line_user_id`、`line_sent_at` 與 `member_id`。
- `formatReport()` 已改讀 `inflammation_level`，不再讀不存在的 `level`。
- LINE reply 失敗會記錄 HTTP status / response body。
- Webhook 有關鍵字回覆：「報告」「結果」「飲品」「推薦」與預設回覆。
- `src/lib/lineAuth.js` 已實作 `initLiff`、`getLiffProfile`、`getLiffAccessToken`、`isInLiffBrowser`、`liffLogout`、`sendLiffMessage`。
- `/line/*` LIFF 會員頁面已建立。
- `src/lib/memberProfile.js` 已有 `findOrCreateMember`、`getMemberByLineId`、`updateMemberHealth`、`doCheckin`、`getCheckinHistory`。
- `src/lib/memberProfile.js` 目前主要讀寫 `profiles`，不是 `line_members`。
- LP / level / title / health_score / streak_days 等會員 MVP 欄位已進入程式邏輯，但欄位命名與 `line_member_mvp.sql` 尚未完全一致。
- `src/components/line/UnlockFullReportCard.jsx` 會顯示報告編號並引導加入 LINE。

### 未完成 / 有問題
- Webhook 未處理 `postback` 事件。
- Webhook 目前仍是純文字回覆，尚未做 Flex Message。
- Webhook 查詢有 `short_code` fallback，但正式主路徑已改用 UUID 前 8 碼；後續需決定是否正式新增 / 保留 `short_code` 欄位。
- ~~LINE 會員主表分裂狀態~~ **2026-05-29 已解決**：production `line_members` 不存在，`profiles` 為 canonical table，兩 FK 均指向 `profiles(id)`。
- `line_member_mvp.sql` 欄位命名（`display_name`/`picture_url`/`le`）與 production 及程式（`line_display_name`/`line_picture_url`/`p_points`）仍不一致，但 production 已以正確命名為準；`line_member_mvp.sql` 視為歷史參考文件，不影響流程。
- `.env.example` 目前工作區已補 `VITE_LINE_LIFF_ID`、`LINE_CHANNEL_SECRET`、`LINE_CHANNEL_ACCESS_TOKEN`，但檔案尚未確認已提交。
- 尚無自動 push 完整報告流程。
- LIFF 會員頁尚未完整串接官網快篩報告歷史。

### 核心目標（還未達到）
> 用戶在官網完成快篩 → 加入 LINE → 自動收到個人化完整健康報告

---

## 目前優先任務

### Phase 0 — 狀態更新（2026-05-29 schema audit 後）

**已確認完成（production read-only audit 驗證，不需要再執行 migration）：**

1. ✅ `profiles` 作為 canonical LINE member table — production V2 欄位全部到位
2. ✅ `line_members` 不存在 — production 已無此表，無 orphan FK
3. ✅ `daily_checkins.member_id` FK → `profiles(id)` — production 已確認
4. ✅ `daily_ai_messages.member_id` FK → `profiles(id)` — production 已確認
5. ✅ `assessment_reports.line_user_id` / `line_sent_at` / `member_id` — production 已確認
6. ✅ `promoters` / `dr_marvin_reports` — production 已確認存在

**仍需處理（進入 Phase 1 前完成）：**

1. **確認 `.env.example` 變更提交** — 工作區已補 `VITE_LINE_LIFF_ID`、`LINE_CHANNEL_SECRET`、`LINE_CHANNEL_ACCESS_TOKEN`，但需確認 commit / 部署文件同步。
2. **`city_climate` 資料補充** — production table 只有 `city`/`temperature`/`humidity`，AI 報告氣候脈絡薄弱，建議補充季節與氣候描述欄位及台灣主要城市資料。

**降為 Medium Priority（不阻斷 Phase 1 啟動）：**

- **Rotate Supabase service role key** — 無外洩直接證據；待功能驗收後擇期執行（Bryan 手動操作 Supabase dashboard → rotate → 更新 Vercel env）。

**技術債（Phase 1 後排程清理，不影響目前流程）：**

- `profiles` 舊欄位 `lp`/`cp`/`member_level`/`member_title` 仍殘留 production
- `profiles.latest_assessment_id` 有 production FK → `assessment_reports(id)` 但無 migration 記錄，需補文件
- `daily_checkins` 雙 FK（`member_id`/`profile_id`）造成 PostgREST join 需明確指定 FK 名稱

### Phase 1B — 會員首頁重構（2026-05-30 完成）

**已完成：LIFF 會員首頁重新設計**

- ✅ `src/pages/line/LineMemberLayout.jsx` — 底部導覽列完全移除（commit: `3c539e1`）：
  - 移除所有 tab bar JSX / icon imports / NAV_ITEMS
  - 新 Zone 1 Header：Logo + 植本邏輯 + 🔔通知 + 圓形頭像（金色框 + L-badge）
  - `height: 100dvh; display: flex; flex-direction: column`
  - main: `overflow-y: auto; padding-bottom: env(safe-area-inset-bottom)`
- ✅ `src/pages/line/LineMemberHomePage.jsx` — 6 Zone 單頁設計（commit: `ee5b903`）：
  - Zone 2：問候區（早安/午安/晚安 依台灣時區動態切換）
  - Zone 3：健康分數大卡（深綠背景、SVG 弧形儀表、五維指數列）
  - Zone 4：今日植本靈感橫向輪播（scroll-snap、卡片左緣對齊 page-padding、dot indicator）
  - Zone 5：8 快捷功能 2×4 grid（今日打卡合併入任務中心；已打卡時顯示 `今日已打卡 ✓`、opacity 0.65；新增植本百科入口）
  - Zone 6：七日健康啟動計畫進度條（條件顯示，僅在進行中時渲染）
- 保留原始 useEffect 資料讀取邏輯（`/api/member?resource=home` + `/api/dr-marvin/insight`）
- ✅ `npm run build` — 0 errors，✓ 2252 modules transformed

### Phase 2 — 植本百科三層架構（2026-06-02 完成）

- ✅ Phase 1B LineMemberHomePage 快捷功能重構 → 已完成
- ✅ Phase 2 植本百科三層架構 → 已完成
- ✅ Phase 2 輪播對齊修正 → 已完成
- ✅ `src/pages/line/EncyclopediaListPage.jsx` — 第一層商品陳列
- ✅ `src/pages/line/ProductDetailPage.jsx` — 第二層商品詳情五 Tab（營養素、植化素、材料、配方原理、植本百科）
- ✅ `src/pages/line/WikiDetailPage.jsx` — 第三層植物原料百科（歷史淵源、生長背景、食用方式、營養與植化素價值）
- ✅ `src/App.jsx` — 註冊 `/line/encyclopedia/*` 路由與 `/line/missions` alias
- ✅ `npm run build` — 0 errors，0 warnings

### Phase 1 — 第一個垂直切片（2026-05-29 完成）

**已完成：LINE LIFF 會員首頁（Mission Hub v1）**

- ✅ `src/pages/line/LineMemberHomePage.jsx` — Mission Hub 規格（已由 Phase 1B 重構）
- ✅ `src/pages/line/LineMemberLayout.jsx` — 底部導航（已由 Phase 1B 重構為無導航）
- ✅ `npm run build` — 0 errors，✓ 2252 modules transformed
- ✅ 資料來源：`/api/member?resource=home`（已有 `has_checked_in_today`、`reports_count`、`streak_days`、`p_points`、`seven_day_plan`）

### 下一階段

1. **完成 LINE 查報告驗收** — 使用 `73D80DE9` 或新報告編號測試 LINE 是否能回完整報告，並確認 DB 已回寫 `line_user_id` / `line_sent_at`。
2. **決定長期報告編號策略** — 目前 production 使用 UUID 前 8 碼；後續可正式新增 `short_code` 欄位並讓前端 / webhook / SQL 完全一致。
3. **完成自動 push 完整報告流程** — 從手動輸入報告編號，升級到加入 LINE 後可自動推送完整報告。

---

## 已知 Bug / 待修問題

| 問題 | 嚴重度 | 狀態 |
|------|------|------|
| LINE 會員主表在 `profiles` / `line_members` 之間分裂 | 高 | ✅ 已解決（2026-05-29 audit）：production `line_members` 不存在，`profiles` 為唯一 canonical table |
| webhook 查 `short_code`，但 schema 未見 `short_code` 欄位 | 高 | ✅ 已解決：`short_code` 欄位 production 已確認存在；webhook UUID 前 8 碼主路徑 + fallback 均可用 |
| 前端 8 碼報告編號與 webhook 查詢欄位不一致 | 高 | ✅ 已修正：webhook 支援 UUID 前 8 碼 |
| `formatReport()` 使用 `report.level`，可能導致 LINE 健康等級顯示未知 | 中 | ✅ 已修正：改讀 `inflammation_level` |
| `daily_checkins` 與 `daily_ai_messages` 的 member reference 不一致 | 高 | ✅ 已解決（2026-05-29 audit）：兩者 FK 均指向 `profiles(id)` |
| `line_member_mvp.sql` 欄位命名與 `memberProfile.js` 不一致 | 低 | ⚠️ 技術債（降級）：production 已正確，`line_member_mvp.sql` 為歷史文件，不影響流程 |
| Webhook 未處理 `follow` 事件 | 中 | ✅ 已修正 |
| Webhook 缺少 Flex Message | 中 | 🔧 進行中 |
| LINE push / 自動推送完整報告尚未完成 | 中 | 🔧 進行中 |
| `VITE_LINE_LIFF_ID` 未列入 `.env.example` | 中 | 🔧 工作區已補，待提交確認 |
| `LINE_CHANNEL_SECRET` / `LINE_CHANNEL_ACCESS_TOKEN` 未列入 `.env.example` | 中 | 🔧 工作區已補，待提交確認 |
| Vercel production `SUPABASE_SERVICE_ROLE_KEY` 誤填 anon key | 高 | ✅ 已修正，health check 顯示 `service_role` |
| `SUPABASE_SERVICE_ROLE_KEY` 曾出現在對話記錄 | 中 | ⚠️ 降為 Medium Priority（2026-05-29）：無外洩直接證據，排程執行 rotate |
| 後台同時存在 Supabase Auth 前端流程與 `api/admin.js` passcode/service role 舊流程 | 中 | ⚠️ 待確認 |
| `api/admin.js` allowedTables 未包含 `contact_submissions`，但前端後台有聯絡表單管理 | 中 | ⚠️ 待確認 |
| Build bundle 超過 500 kB 警告 | 低 | ⚠️ 待確認 |
| `memberProfile.js` 同時被動態與靜態 import，code splitting 無效 | 低 | ⚠️ 待確認 |
| `profiles.latest_assessment_id` 有 production FK 但無 migration 記錄 | 低 | ⚠️ 技術債：需補文件 migration 記錄，不影響功能 |
| `daily_checkins` 雙 FK（`member_id`/`profile_id`）PostgREST join 需指定名稱 | 低 | ⚠️ 技術債：功能無影響，未來 API 查詢需注意 |
| `city_climate` 資料過薄 | 中 | ⚠️ 待補充：只有 `city`/`temperature`/`humidity`，影響 AI 報告氣候脈絡品質 |

---

## 版本記錄

| 日期 | 更新重點 |
|------|------|
| 2026-06-02 | Phase 1B/2 UI 更新：`LineMemberHomePage.jsx` 今日打卡合併入任務中心、快捷格新增植本百科、今日植本靈感輪播對齊 page-padding；新增植本百科三層頁面 `/line/encyclopedia`、`/line/encyclopedia/:productId`、`/line/encyclopedia/:productId/wiki/:ingredientId`；`vite.config.js` 調整 chunk warning threshold；npm run build ✓ 0 errors / 0 warnings |
| 2026-05-30 | Phase 1B 會員首頁重構：`LineMemberLayout.jsx` 底部導覽列完全移除（100dvh + safe-area）；`LineMemberHomePage.jsx` 6 Zone 單頁設計（健康分數卡 + 弧形儀表 + 五維指數 + 靈感輪播 scroll-snap + 8 快捷 grid + 七日計畫進度條）；npm run build ✓ 0 errors |
| 2026-05-29 | Phase 1 第一個垂直切片：LINE LIFF 會員首頁（Mission Hub）完成；`LineMemberHomePage.jsx` 對齊 MEMBER_SYSTEM_PAGES_SPEC_V1.1 規格（三點數 LE/CP/P、今日任務 CTA、洞察免責聲明、Dr.Marvin 知識卡切換、週一情境提示）；`LineMemberLayout.jsx` 底部導航對齊規格；npm run build ✓ 0 errors |
| 2026-05-29 | Phase 0 production schema read-only audit 完成：`profiles` canonical 方向確認、`line_members` 不存在確認、`daily_checkins`/`daily_ai_messages` FK 均指向 `profiles(id)` 確認、`assessment_reports` 關鍵欄位確認、`promoters`/`dr_marvin_reports` 確認存在；service role key rotate 降為 Medium Priority；文件同步更新 |
| 2026-05-23 | 更新 Phase 0 判斷：目前不是單純缺 `line_members`，而是 `profiles` / `line_members` 模型分裂；現有前端已改用 `profiles`，需讓 migration、FK、欄位命名全部對齊 |
| 2026-05-22 | 修復 LINE webhook production：關閉 OA 自動回應、修正 Webhook URL 到 `www`、確認正式 Vercel 專案為 `phytologic-official-site-esme`、修正 raw signature、follow 事件、UUID 前 8 碼查詢、`inflammation_level`，並將 `SUPABASE_SERVICE_ROLE_KEY` 從 anon 改為 service_role |
| 2026-05-22 | 更新 LINE / LIFF / schema 現況，確認 build 成功並標出報告編號與 `line_members` 高風險問題 |
| 2026-05-22 | 初版建立，整合 0519 進度文件與 0522 現況更新 |

---

## 給 Claude 的說明

**讀這份文件的方式：**
先看「目前優先任務」和「LINE 系統現況」，這兩個區塊是最常變動、最需要跟上的。其他區塊（技術堆疊、資料表、路由）比較穩定，有疑問時再查。

**這份文件過時了怎麼辦：**
如果我說「最新進度是 XXX」，請以我說的為準，文件內容退為參考。如果我沒有特別說明，就以文件為主。

**不確定的事不要假設：**
標記 ⚠️ 待確認 的項目代表我也不確定，請直接問我，不要自行推斷。
