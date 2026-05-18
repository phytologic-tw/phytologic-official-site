# 植本邏輯官方網站系統總覽

更新日期：2026-05-18

本文件整理目前官方網站已建立的頁面、系統、資料流程、後台功能、Supabase 結構與部署相關設定，作為後續產品規劃、工程交接與營運管理的基礎文件。

## 1. 專案概況

專案名稱：`phytologic-website`

技術架構：

- 前端框架：Vite + React
- 樣式系統：Tailwind CSS
- 動效：Framer Motion
- 圖示：Lucide React
- 資料庫與 Storage：Supabase
- 後端 API：Vercel Serverless Functions
- 部署目標：Vercel
- 主要正式網域規劃：`phytologic.tw`、`www.phytologic.tw`

主要入口：

- 前台首頁：`/`
- 合作夥伴平台：`/partners`
- 最新消息頁：`/news`
- 精彩剪影頁：`/gallery`
- 後台入口：`/admin`
- 後台合作夥伴：`/admin/partners`
- 後台公告：`/admin/news`
- 後台精彩剪影：`/admin/gallery`

## 2. 前台首頁系統

檔案位置：

- `src/App.jsx`

首頁目前包含以下內容：

- 品牌 Hero：植本邏輯品牌主視覺、品牌標語、產品與派森導流。
- 頂部導覽列：首頁、品牌理念、產品系列、派森、最新消息、合作加盟、合作夥伴。
- 頂部 LINE 導流按鈕：保留為小型導流按鈕。
- 品牌理念：創辦理念、家庭與健康敘事、三好原則、三無鐵律。
- 生命顏色敘事：五色產品對應人生願望。
- 產品系列：五色植物機能飲品介紹與互動切換。
- 派森 AI 發炎指數快篩：嵌入 `HealthAssessment` 元件。
- 最新消息：首頁顯示固定品牌公告資料，並導流到 `/news`。
- 合作加盟：說明合作類型與支援內容，導流到 `/partners`。
- 聯絡我們：前端展示版洽詢表單，目前尚未串接資料庫或 Email。
- Footer：品牌資訊、官方 LINE QR Code、管理入口。
- 浮動 LINE 按鈕：全站前台固定顯示。

LINE CTA 現況：

- 首頁主內容中的大型 LINE 區塊已移除。
- LINE CTA 只保留在派森 AI 簡易分析報告下方作為小型卡片。
- 首頁頂部「加入 LINE」按鈕與右下角浮動 LINE 按鈕保留，定位為導流入口。

## 3. 派森 AI 發炎指數快篩

檔案位置：

- `src/components/HealthAssessment.jsx`
- `api/analyze.js`
- `src/components/line/UnlockFullReportCard.jsx`

使用流程：

1. 使用者填寫基本資料。
2. 使用者完成 15 題發炎指數快篩。
3. 系統計算分數、分類線索與推薦飲品。
4. 呼叫 `/api/analyze` 嘗試產生 AI 分析。
5. 若 AI API 失敗，使用本機 fallback 分析。
6. 產生簡易分析報告。
7. 在簡易分析報告下方顯示小型 LINE CTA。
8. 儲存報告資料到 Supabase `assessment_reports`。

基本資料欄位：

- 性別
- 年齡區間
- 身高
- 體重
- 職業 / 工作型態
- 睡眠時間
- 睡眠品質
- 運動習慣
- 飲食型態
- 壓力程度
- BMI 自動計算

問卷設定：

- 題庫總數：40 題
- 每次隨機抽題：15 題
- 答案選項：從不、偶爾、經常
- 計分：0、1、2
- 滿分：30 分

發炎等級：

- 0-5：健康綠燈
- 6-11：輕度發炎
- 12-20：中度發炎
- 21-30：重度發炎

分類系統：

- 腦部與神經壓力
- 消化與腸胃負擔
- 免疫與過敏反應
- 排毒與水分代謝
- 血糖與代謝波動
- 內分泌與荷爾蒙
- 肌肉骨骼與恢復

推薦飲品：

- 雪山植萃
- 青檸植萃
- 玫瑰植萃
- 桂香植萃
- 紫莓植萃

派森報告下方 LINE CTA 文案：

- 標題：加入植本邏輯官方 LINE
- 副標：解鎖完整 AI 健康分析報告
- 說明：加入官方 LINE 後，可獲得更詳細的個人化發炎分析、飲品建議與每日健康提醒。
- 按鈕：加入官方 LINE
- QR Code 尺寸：約 96px 至 108px

AI API：

- API 路徑：`/api/analyze`
- 使用環境變數：`ANTHROPIC_API_KEY`
- 模型：`claude-3-5-haiku-20241022`
- 回傳格式：JSON 字串，前端解析後合併 fallback 結果。

## 4. LINE 官方帳號系統

檔案位置：

- `src/components/line/FloatingLineButton.jsx`
- `src/components/line/LineQRCode.jsx`
- `src/components/line/UnlockFullReportCard.jsx`
- `src/components/line/LineCTA.jsx`

目前 LINE 入口：

- Header 小型「加入 LINE」按鈕。
- 首頁 Hero 內「立即加入 LINE」導流按鈕。
- Footer 官方 LINE QR Code。
- 右下角浮動 LINE 按鈕。
- 派森 AI 簡易分析報告下方小型 LINE CTA。

目前預設 LINE URL：

- `https://lin.ee/YpVA4C8`

可覆蓋環境變數：

- `VITE_LINE_OA_URL`
- `VITE_LINE_OFFICIAL_URL`
- `VITE_LINE_CTA_URL`

QR Code 圖檔：

- `public/line-qrcode.png`
- `public/line-qrcode-small.png`
- `public/line-qrcode-medium.png`
- `public/line-qrcode-large.png`

## 5. 合作夥伴平台

檔案位置：

- `src/App.jsx`
- Supabase table：`partners`

頁面路徑：

- `/partners`

前台 UX 現況：

- 預設為展示頁，不直接顯示表單。
- 頁面標題：合作夥伴平台
- 頁面說明：展示已核准合作夥伴，提供合作申請入口。
- 若尚無已核准合作夥伴，顯示「目前尚無已核准合作夥伴」。
- 即使尚無資料，仍顯示一張範例名片式卡片。
- 合作申請表單藏在「申請成為合作夥伴」按鈕之後。
- 點擊按鈕後以條件渲染展開表單。

合作夥伴卡片顯示內容：

- Logo / 大頭貼區
- 合作夥伴名稱
- 城市
- 類型
- 聯絡人
- 簡短介紹
- 查看據點按鈕
- 聯繫合作夥伴按鈕

合作類型選項：

- 門市
- 工作室
- 健康顧問
- 活動據點

合作申請表單欄位：

- `partner_name`
- `city`
- `partner_type`
- `contact_name`
- `phone`
- `email`
- `description`
- `partner_logo`

表單送出資料：

- 前端使用 `partner_type`。
- 寫入 Supabase 時轉成既有資料表欄位 `category`。
- `partner_logo` 目前只做前端預覽，不上傳 Supabase Storage。
- 未上傳圖片不會阻擋送出。
- 送出後寫入 `partners`，狀態為 `pending`。

注意：

- 前台讀取 `partners` 時只顯示 `status = approved` 的資料。
- 後台仍可審核 pending / approved / rejected 狀態。
- 既有 Supabase 資料結構保留，未新增破壞性欄位。

## 6. 最新消息系統

檔案位置：

- `src/App.jsx`
- 後台：`src/components/admin/AdminDashboard.jsx`
- Supabase table：`announcements`

頁面路徑：

- 前台最新消息頁：`/news`
- 後台公告管理：`/admin/news`

前台顯示：

- 只讀取 `status = published` 的公告。
- 支援置頂排序。
- 顯示分類、標題、摘要、內容、封面圖與發布時間。

後台功能：

- 新增公告
- 編輯公告
- 刪除公告
- 草稿 / 發布 / 封存狀態
- 置頂開關

資料欄位：

- `title`
- `category`
- `summary`
- `content`
- `cover_image_url`
- `status`
- `is_pinned`
- `published_at`
- `created_at`

## 7. 精彩剪影系統

檔案位置：

- `src/App.jsx`
- 後台：`src/components/admin/AdminDashboard.jsx`
- Supabase table：`gallery_items`
- Supabase Storage bucket：`gallery`

頁面路徑：

- 前台精彩剪影頁：`/gallery`
- 後台精彩剪影管理：`/admin/gallery`

前台顯示：

- 只讀取 `status = published` 的剪影。
- 支援圖片與影片類型。
- 圖片使用 `thumbnail_url` 或 `media_url`。
- 影片目前以文字區塊顯示影片 URL。

後台功能：

- 新增剪影
- 編輯剪影
- 刪除剪影
- 發布 / 取消發布
- 上傳圖片或影片到 Supabase Storage `gallery` bucket

資料欄位：

- `title`
- `type`
- `category`
- `media_url`
- `thumbnail_url`
- `description`
- `status`
- `published_at`
- `created_at`

## 8. Admin 後台系統

檔案位置：

- `src/components/admin/AdminDashboard.jsx`
- `api/admin.js`

後台入口：

- `/admin`

後台分頁：

- 合作夥伴：`/admin/partners`
- 公告：`/admin/news`
- 精彩剪影：`/admin/gallery`

登入方式：

- 目前使用臨時 passcode gate。
- 前端環境變數：`VITE_ADMIN_PASSCODE`
- 後端 API 驗證環境變數：`ADMIN_PASSCODE`
- 解鎖狀態存在 `sessionStorage`。

Admin API：

- 路徑：`/api/admin`
- 允許資料表：`partners`、`announcements`、`gallery_items`
- 支援 action：`list`、`insert`、`update`、`delete`、`upload`

後端 Supabase 權限：

- 使用 `SUPABASE_SERVICE_ROLE_KEY`
- 使用 `SUPABASE_URL` 或 `VITE_SUPABASE_URL`

目前後台注意事項：

- passcode gate 為臨時方案。
- 未來建議改為 Supabase Auth、LINE Login 與 RBAC。

## 9. Supabase 資料庫系統

檔案位置：

- `src/lib/supabase.js`
- `supabase/website_expansion.sql`
- `supabase/assessments.sql`

前端 Supabase 連線：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

若未設定 Supabase：

- 前端會顯示「尚未設定 Supabase 連線，請設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。」

主要資料表：

- `partners`
- `announcements`
- `gallery_items`
- `assessment_reports`
- `assessments`：早期 assessment table，保留於 `supabase/assessments.sql`

### partners

用途：

- 合作夥伴申請與展示。

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

狀態：

- `pending`
- `approved`
- `rejected`

前台權限：

- 可新增 pending 申請。
- 只可讀取 approved 合作夥伴。

### announcements

用途：

- 最新消息、品牌公告、活動公告與文章。

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

狀態：

- `draft`
- `published`
- `archived`

### gallery_items

用途：

- 活動現場、消費者體驗、合作夥伴、產品製作與品牌故事圖文影音。

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

類型：

- `photo`
- `video`

### assessment_reports

用途：

- 儲存派森 AI 發炎指數快篩結果與分析報告。

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

前台權限：

- 可新增 assessment report。
- 不開放前台讀取完整報告資料。

## 10. Storage 系統

Supabase Storage bucket：

- `gallery`
- `announcements`

目前用途：

- `gallery`：後台精彩剪影上傳圖片或影片。
- `announcements`：SQL 已建立相關讀取與管理政策，前端公告目前使用 URL 欄位。

Storage policy 摘要：

- 公開讀取 gallery files。
- 公開讀取 announcement files。
- authenticated 可上傳、更新、刪除 gallery files。
- authenticated 可上傳、更新、刪除 announcement files。

## 11. API 與資料流

### `/api/analyze`

用途：

- 派森 AI 分析報告產生。

流程：

1. 前端送出 prompt。
2. API 使用 `ANTHROPIC_API_KEY` 呼叫 Anthropic Messages API。
3. 回傳文字結果。
4. 前端解析 JSON。
5. 失敗時使用本機 fallback 分析。

### `/api/admin`

用途：

- 後台資料管理與檔案上傳。

流程：

1. 前端後台送出 action。
2. Header 帶入 `x-admin-passcode`。
3. API 驗證 `ADMIN_PASSCODE`。
4. 使用 Supabase service role 操作資料。
5. 回傳資料或 public URL。

## 12. 環境變數清單

前端：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSCODE`
- `VITE_LINE_OA_URL`
- `VITE_LINE_OFFICIAL_URL`
- `VITE_LINE_CTA_URL`

後端：

- `SUPABASE_URL`
- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSCODE`
- `ANTHROPIC_API_KEY`

## 13. 建置與部署

本機開發：

```bash
npm install
npm run dev
```

正式建置：

```bash
npm run build
```

輸出資料夾：

```txt
dist/
```

Vercel 設定：

- Framework Preset：Vite
- Build Command：`npm run build`
- Output Directory：`dist`

Vercel rewrite：

- `vercel.json` 將 `/partners`、`/news`、`/gallery`、`/admin` 與 `/admin/:path*` 導回 `/`，由 React 前端路由處理。

## 14. 主要檔案索引

前台主程式：

- `src/App.jsx`

派森 AI：

- `src/components/HealthAssessment.jsx`
- `api/analyze.js`

LINE：

- `src/components/line/FloatingLineButton.jsx`
- `src/components/line/LineQRCode.jsx`
- `src/components/line/UnlockFullReportCard.jsx`
- `src/components/line/LineCTA.jsx`
- `public/line-qrcode*.png`

後台：

- `src/components/admin/AdminDashboard.jsx`
- `api/admin.js`

Supabase：

- `src/lib/supabase.js`
- `supabase/website_expansion.sql`
- `supabase/assessments.sql`

樣式：

- `src/style.css`
- `tailwind.config.js`

部署：

- `package.json`
- `vite.config.js`
- `vercel.json`

## 15. 目前已完成的重要調整

- 首頁大型 LINE CTA 已移除。
- LINE CTA 已移到派森 AI 簡易分析報告下方。
- 派森 LINE CTA 已改為小型卡片，寬度跟報告內容一致。
- 合作夥伴平台已改成前台展示頁。
- 合作申請表單預設隱藏，點擊「申請成為合作夥伴」才展開。
- 合作申請表單已新增 `partner_logo` 圖片欄位與前端預覽。
- 合作夥伴頁在無資料時會顯示「目前尚無已核准合作夥伴」與範例卡片。
- 保留 admin、Supabase、assessment、合作夥伴資料結構與既有功能。

## 16. 後續建議

- 將 admin passcode gate 升級為 Supabase Auth 或 LINE Login。
- 為合作夥伴新增正式 `partner_logo_url` 欄位與 Storage 上傳流程。
- 將聯絡我們表單串接 Email、Google Sheet 或 Supabase。
- 為公告封面圖新增後台上傳流程。
- 為影片剪影新增前台播放器。
- 將派森完整報告與 LINE 會員狀態串接，讓 `has_joined_line` 可由實際會員資料控制。
- 將 AI 模型與 prompt 版本記錄到 `assessment_reports`，方便後續追蹤分析品質。
