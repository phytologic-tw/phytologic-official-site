# AGENTS.md — 植本邏輯 PHYTOLOGIC 開發指引

> 這份文件是給 Codex / Claude / 所有 AI 工具的**自動載入指引**。  
> 每次開啟專案時請先完整讀取此文件，再開始任何開發工作。

---

## 🔴 最重要的事：先讀規格書

**開發任何功能之前，必須先讀這份文件：**

```
MEMBER_SYSTEM_SPEC_V1.0.md
```

這是植本邏輯 LINE 會員系統的**唯一真相規格文件**，包含：
- 八大核心系統架構與欄位規格
- 目前所有功能的完成狀態
- 資料庫 schema 與 migration 順序
- 開發路線圖（Phase 0 ~ Phase 4）
- 環境變數清單
- LIFF 頁面規格

---

## 專案基本資訊

| 項目 | 內容 |
|------|------|
| 專案名稱 | 植本邏輯 PHYTOLOGIC |
| 正式網站 | https://phytologic.tw |
| 後台入口 | https://phytologic.tw/admin |
| GitHub | phytologic-tw/phytologic-official-site |
| 部署平台 | Vercel（專案名：`phytologic-official-site-esme`） |
| 資料庫 | Supabase |
| 主要聯絡 | bryan@phytologic.tw |

---

## 技術堆疊快速參考

```
前端：React + Vite + Tailwind CSS
後端：Vercel Serverless Functions（api/*.js）
資料庫：Supabase（PostgreSQL + RLS）
LINE：LIFF SDK + Messaging API Webhook
AI：Anthropic API（api/analyze.js）
```

---

## 開發規則（必讀）

### 1. 資料庫規則
- **LINE 會員資料統一使用 `profiles` 資料表**，不使用 `line_members`
- `SUPABASE_SERVICE_ROLE_KEY` 只能在後端 `api/*.js` 使用，**絕對不能出現在前端**
- 前端一律使用 `VITE_SUPABASE_ANON_KEY`

### 2. Phase 規則
- **Phase 0 的問題若尚未修復，不可跳過直接開發 Phase 1 功能**
- 每個 Phase 任務在規格書中有明確的狀態標記（✅ / ❌ / 🔧 / 📋）
- 開發前先確認該功能對應的 Phase 和狀態

### 3. LINE / LIFF 規則
- Webhook URL 必須使用 `https://www.phytologic.tw/api/line-webhook`（含 www）
- LINE OA 自動回應訊息需關閉，否則 Webhook 不會收到用戶訊息
- LIFF App Endpoint URL：`https://www.phytologic.tw/line/entry`

### 4. 不確定的事不要假設
- 規格書中標記 `⚠️ 待確認` 的項目，請先詢問再動手
- 不要自行推斷欄位命名，以 `MEMBER_SYSTEM_SPEC_V1.0.md` 為準

---

## 目前最高優先任務（Phase 0）

以下問題**阻塞所有 LIFF 功能**，必須優先處理：

1. ❌ 補齊 `profiles` 資料表的 LINE 會員欄位（migration SQL 在規格書第六章）
2. ❌ 修正 `daily_checkins.member_id` FK → 改指向 `profiles(id)`
3. ❌ 修正 `daily_ai_messages.member_id` FK → 統一指向 `profiles(id)`
4. ❌ 對齊 `memberProfile.js` 欄位命名與 SQL schema
5. ❌ Rotate Supabase service role key（安全問題）

---

## 關鍵檔案快速索引

| 功能 | 檔案 |
|------|------|
| LINE Webhook | `api/line-webhook.js` |
| AI 分析 | `api/analyze.js` |
| LIFF 認證 | `src/lib/lineAuth.js` |
| 會員資料操作 | `src/lib/memberProfile.js` |
| Supabase Client | `src/lib/supabase.js` |
| 健康快篩 | `src/components/HealthAssessment.jsx` |
| LIFF 入口 | `src/pages/line/LineEntry.jsx` |
| LIFF 今日 | `src/pages/line/LineTodayPage.jsx` |
| LIFF 打卡 | `src/pages/line/LineCheckinPage.jsx` |
| LIFF 會員 | `src/pages/line/LineProfilePage.jsx` |
| DB Schema | `supabase/website_expansion.sql` |
| DB RLS | `supabase/admin_rls_repair.sql` |

---

## 規格書版本記錄

| 文件 | 版本 | 日期 | 說明 |
|------|------|------|------|
| `MEMBER_SYSTEM_SPEC_V1.0.md` | V1.0 | 2026-05-24 | 初版，整合現況盤點與 V7.0 設計藍圖 |

> 規格書更新時，同步更新此表格的版本號與日期。
