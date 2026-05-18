# 植本邏輯官方網站進度備份

備份時間：2026-05-19 00:59 CST  
備份分支：`main`  
備份 commit：`21ca0c7 feat: prepare Supabase admin dashboard for production`  
遠端 repo：`https://github.com/phytologic-tw/phytologic-official-site.git`

## 目前正式網站

- 正式入口：`https://phytologic.tw`
- WWW 入口：`https://www.phytologic.tw`
- Admin 後台入口：`https://phytologic.tw/admin`
- 目前 `phytologic.tw` 會導向 `www.phytologic.tw`。
- Vercel 已回應正式網域，`/admin` 與 `/admin/dashboard` 皆可回到 React SPA。

## 前台功能進度

- 首頁主視覺與品牌內容已建立。
- 產品展示、派森 AI 健康系統介紹、合作加盟、聯絡表單、Footer 與 LINE 導流已建立。
- 合作夥伴頁：`/partners`
  - 可送出合作申請。
  - 前台只顯示 `status = approved` 的合作夥伴。
- 最新消息頁：`/news`
  - 讀取 Supabase `announcements`。
  - 前台只顯示 `status = published` 的公告。
- 精彩剪影頁：`/gallery`
  - 讀取 Supabase `gallery_items`。
  - 前台只顯示 `status = published` 的內容。
- 聯絡表單已串接 Supabase `contact_submissions`。

## 派森 AI 健康快篩

- 快篩元件：`src/components/HealthAssessment.jsx`
- 問卷會隨機抽題並產生簡易分析。
- 結果會寫入 Supabase `assessment_reports`。
- 報告下方會顯示 LINE 解鎖完整報告 CTA。
- 已保留 `partial_report`、`full_report`、`has_joined_line` 等欄位供後續 LINE Bot / LIFF 串接。

## LINE 進度

- LINE 設定集中於：
  - `src/components/line/lineConfig.js`
  - `src/components/line/FloatingLineButton.jsx`
  - `src/components/line/LineCTA.jsx`
  - `src/components/line/LineQRCode.jsx`
  - `src/components/line/UnlockFullReportCard.jsx`
- 已有：
  - Header LINE 按鈕
  - Footer LINE QR Code
  - 右下角浮動 LINE 按鈕
  - 派森報告下方 LINE CTA
- 待辦：
  - LINE Messaging API Webhook
  - LIFF / LINE Login
  - 將 LINE user id 與 `assessment_reports` 綁定

## Admin 後台進度

- 後台入口：`/admin`
- 後台路由：
  - `/admin/dashboard`
  - `/admin/partners`
  - `/admin/news`
  - `/admin/gallery`
  - `/admin/assessments`
  - `/admin/contact`
  - `/admin/settings`
- 後台元件：`src/components/admin/AdminDashboard.jsx`
- 後台資料層：
  - `src/lib/adminData.js`
  - `src/lib/adminSeed.js`
  - `src/lib/adminStorage.js`
- Auth 狀態：
  - 已改為 Supabase Auth 登入。
  - 使用 `profiles.role = admin` 控制權限。
  - `role` 判斷已做 `trim().toLowerCase()`，避免大小寫或空白造成誤判。
  - 未登入者直接進 `/admin/dashboard` 會停在登入頁。
  - Demo fallback 僅在 Supabase 未設定時使用。
- 第一個 admin：
  - `bryan@phytologic.tw`
  - Supabase Auth 使用者已建立。
  - `profiles.role = admin` 已確認。

## Supabase 進度

- Supabase client：`src/lib/supabase.js`
- 主要 migration：
  - `supabase/website_expansion.sql`
  - `supabase/admin_rls_repair.sql`
  - `supabase/assessments.sql`
- 已整理的 table：
  - `profiles`
  - `partners`
  - `announcements`
  - `gallery_items`
  - `assessment_reports`
  - `contact_submissions`
- `supabase/admin_rls_repair.sql` 已包含：
  - table schema
  - indexes
  - RLS enable / force RLS
  - admin policies
  - public insert policies
  - public read policies for published/approved content
  - `updated_at` trigger
  - `public.is_admin()` helper

## Vercel / 部署進度

- Vercel rewrite：`vercel.json`
  - `/partners` -> `/`
  - `/news` -> `/`
  - `/gallery` -> `/`
  - `/admin` -> `/`
  - `/admin/:path*` -> `/`
- 最新正式後台版本已 push 到 GitHub `main`。
- Vercel 已部署並回應新 bundle。
- Production build 已通過：
  - `npm run build`

## Environment Variables

前端需要：

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ADMIN_PASSCODE
VITE_LINE_CTA_URL
VITE_LINE_OA_URL
VITE_LINE_OFFICIAL_URL
```

後端 / Serverless 才能使用，不可放到前端 bundle：

```txt
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
ADMIN_PASSCODE
```

目前 `.env.local` 已由 `.gitignore` 排除，不會提交真實金鑰。

## 最新已追蹤檔案重點

- `src/App.jsx`：前台頁面、路由、合作夥伴、消息、剪影、聯絡表單。
- `src/components/HealthAssessment.jsx`：派森快篩與報告儲存。
- `src/components/admin/AdminDashboard.jsx`：正式後台 UI 與各管理分頁。
- `src/lib/adminData.js`：Supabase Auth、admin session、CRUD、public insert。
- `src/lib/supabase.js`：Supabase 前端 client。
- `supabase/admin_rls_repair.sql`：正式後台資料表與 RLS 修復 migration。
- `vercel.json`：production route rewrites。

## 建議下一步

- 在 Supabase SQL Editor 確認 `admin_rls_repair.sql` 已執行。
- 用 `bryan@phytologic.tw` 在正式站登入 `/admin` 做完整瀏覽測試。
- 在 Vercel Production 確認必要環境變數都有設定。
- 補上 Supabase Auth URL Configuration：
  - `https://phytologic.tw`
  - `https://www.phytologic.tw`
  - `https://phytologic.tw/admin`
  - `https://www.phytologic.tw/admin`
  - `https://phytologic.tw/admin/dashboard`
  - `https://www.phytologic.tw/admin/dashboard`
