# 系統架構總覽

更新日期：2026-05-20

## 目標

本文件整理目前官方網站的實際架構，作為後續開發、部署、後台管理、LINE 會員與派森 AI 功能演進的共同基準。

## 技術架構

- 前端框架：Vite + React
- 樣式系統：Tailwind CSS
- 動效：Framer Motion
- 圖示：Lucide React
- API：Vercel Serverless Functions
- 資料庫：Supabase PostgreSQL
- Storage：Supabase Storage
- 部署：Vercel

## 主要入口

- `/`：官方網站首頁
- `/partners`：合作夥伴平台
- `/news`：最新消息
- `/gallery`：精彩剪影
- `/admin`：後台入口
- `/admin/partners`：合作夥伴管理
- `/admin/news`：公告管理
- `/admin/gallery`：精彩剪影管理

`vercel.json` 目前透過 rewrites 將前台與後台路由導回 `/`，再由 React 前端處理。

## 主要模組

### 前台

主要檔案：`src/App.jsx`

目前包含：

- 品牌 Hero 與導覽列
- 品牌理念、生命顏色與產品系列
- Dr.Marvin 生理狀態快篩
- 最新消息展示與 `/news` 頁
- 合作加盟區塊與 `/partners` 頁
- 聯絡我們展示型表單
- Footer 與 LINE QR Code
- 右下角浮動 LINE 按鈕

### 派森 AI / Dr.Marvin 快篩

主要檔案：

- `src/components/HealthAssessment.jsx`
- `api/analyze.js`
- `src/components/line/UnlockFullReportCard.jsx`

目前為 7 題生理狀態快篩，依使用者基本資料、生活型態與分類分數產生產品推薦與生活建議。AI API 失敗時會使用前端 fallback 分析。

### LINE

主要檔案：

- `src/components/line/lineConfig.js`
- `src/components/line/FloatingLineButton.jsx`
- `src/components/line/LineQRCode.jsx`
- `src/components/line/LineCTA.jsx`
- `src/components/line/UnlockFullReportCard.jsx`

目前以官方 LINE 導流為主，使用環境變數覆蓋預設 LINE URL。完整 LINE Messaging API、LIFF、LINE Login 尚未實作。

### Admin 後台

主要檔案：

- `src/components/admin/AdminDashboard.jsx`
- `api/admin.js`

目前使用 passcode gate。後端 API 以 `ADMIN_PASSCODE` 驗證，並透過 Supabase service role 操作資料。未來建議升級為 Supabase Auth、LINE Login 或 RBAC。

### Supabase

主要檔案：

- `src/lib/supabase.js`
- `supabase/website_expansion.sql`
- `supabase/assessments.sql`

主要資料表：

- `partners`
- `announcements`
- `gallery_items`
- `assessment_reports`
- `profiles`
- `contact_submissions`
- `assessments`：早期快篩資料表，保留於獨立 SQL 檔

## API

### `/api/analyze`

用途：產生派森 AI 分析報告。

流程：

1. 前端送出 prompt。
2. API 使用 `ANTHROPIC_API_KEY` 呼叫 Anthropic Messages API。
3. 回傳模型文字。
4. 前端嘗試解析 JSON。
5. 若失敗，使用 fallback 分析。

目前模型設定在 `api/analyze.js`，為 `claude-sonnet-4-20250514`。

### `/api/admin`

用途：後台資料管理與檔案上傳。

支援資料表：

- `partners`
- `announcements`
- `gallery_items`
- `assessment_reports`

支援 action：

- `list`
- `insert`
- `update`
- `delete`
- `upload`

`assessment_reports` 目前允許後台讀取，但不允許後台寫入或刪除。

## 開發注意事項

- 不在 `main` 直接開發新功能。
- 資料庫欄位與 RLS 變更需先記錄在 `docs/database/`。
- LINE 與會員流程需先完成流程設計，再接 Messaging API、LIFF 或 Login。
- Admin passcode gate 為臨時方案，不應被視為最終權限設計。

