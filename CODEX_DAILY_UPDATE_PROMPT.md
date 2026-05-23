# 每日進度更新指令｜給 Codex 使用

> 每天開發結束前，把這段指令貼給 Codex 執行。
> Codex 會掃描專案現況，產出一份更新好的 PROJECT_STATUS.md。
> 產出的文件直接上傳到 Claude Project 知識庫取代舊版即可。

---

## 使用方式

1. 開發結束前，把下方「Codex 指令」完整貼給 Codex
2. Codex 產出新版 `PROJECT_STATUS.md`
3. 把這份文件上傳到 Claude Project → Knowledge（取代舊版）
4. 下次開新對話，Claude 就能讀到最新狀態

---

## Codex 指令（直接複製貼上）

---

請你掃描整個專案，產出一份更新後的 `PROJECT_STATUS.md`。

**格式要求：**
嚴格按照下方模板的結構輸出，不要新增或刪除區塊標題。
只更新有變動的欄位，沒變動的保持原樣。
所有狀態符號統一使用：✅ 正常 / 🔧 進行中 / ⚠️ 待確認 / ❌ 有問題

---

**請依序完成以下掃描任務，再統整輸出：**

### 1. 技術堆疊
掃描 `package.json`，確認目前實際安裝的套件與版本，更新技術堆疊狀態欄。
特別確認：`@line/liff`、`@supabase/supabase-js`、`anthropic` 是否存在。

### 2. 重要檔案位置
確認以下檔案是否實際存在，若有新增重要檔案也一併列入：
- `api/line-webhook.js`
- `src/lib/lineAuth.js`
- `src/components/line/UnlockFullReportCard.jsx`
- `supabase/line_member_mvp.sql`
- 任何新增的 `supabase/*.sql`
- 任何新增的 `api/*.js`
- 任何新增的 `src/lib/*.js`

### 3. 資料庫資料表現況
讀取所有 `supabase/*.sql` 檔案，列出：
- 哪些資料表有建立（CREATE TABLE）
- 哪些欄位有新增（ALTER TABLE ADD COLUMN）
- 特別確認：`line_members`、`short_code`、`line_user_id`、`line_sent_at`、`member_id`、`daily_checkins`、`daily_ai_messages` 的現況
- 如果某個資料表或欄位在 SQL 裡只有 reference 但沒有建立，標記 ⚠️ 待確認

### 4. 環境變數清單
讀取 `.env.example`（或 `.env.local` 若存在），列出所有變數。
掃描 `api/*.js` 和 `src/lib/*.js`，找出所有 `process.env.` 和 `import.meta.env.` 的引用，
確認文件中的變數清單是否完整，補上缺漏的變數，標記狀態為 ⚠️ 待確認。

### 5. 前台路由現況
讀取 `src/App.jsx`（或路由設定檔），列出所有 Route，
比對每個路由對應的元件是否存在、是否有基本內容（非空白頁面）。

### 6. LINE 系統現況
讀取 `api/line-webhook.js`，列出：
- 目前處理了哪些事件類型（follow、message、postback 等）
- 目前的自動回覆邏輯摘要
- 是否有處理 `follow` 事件
- 是否有把 `line_user_id` 回寫到 `assessment_reports`

讀取 `src/lib/lineAuth.js`，列出已實作的函式。
讀取 `src/components/line/UnlockFullReportCard.jsx`，確認報告編號的產生方式。
比對 webhook 查詢欄位和前端編號產生方式是否一致。

### 7. 目前優先任務
根據你掃描到的問題，列出最重要的 3–5 件待辦事項。
格式：`數字. **任務名稱** — 一句話說明`

### 8. 已知 Bug / 待修問題
整合你掃描到的所有不一致、缺漏、或明顯錯誤，加入已知問題清單。
嚴重度判斷：
- 高：會讓功能壞掉或資料不一致
- 中：影響體驗但不會壞掉
- 低：優化性問題

### 9. 版本記錄
在版本記錄最上方加一行，格式：
`| YYYY-MM-DD | 簡短描述今天的主要進展（一行以內）|`

---

**輸出格式：**
直接輸出完整的 `PROJECT_STATUS.md` 內容，從 `# 植本邏輯 PHYTOLOGIC｜專案進度追蹤` 開始，
不要加任何前言或說明文字，讓我可以直接複製存檔。

---

## 模板（Codex 輸出時請嚴格照此結構）

```markdown
# 植本邏輯 PHYTOLOGIC｜專案進度追蹤

> 這份文件是給 Claude 讀的「單一真相文件」。
> 每次有進展時更新這裡，開新對話前上傳到 Claude Project 知識庫取代舊版。
> 格式盡量保持簡短，讓 Claude 能快速抓到重點。

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
<!-- Codex 根據 package.json 填入 -->

---

## 重要檔案位置

| 功能 | 檔案路徑 |
|------|------|
<!-- Codex 根據實際存在的檔案填入 -->

---

## 資料庫資料表現況

| 資料表 | 狀態 | 備註 |
|------|------|------|
<!-- Codex 根據 supabase/*.sql 填入 -->

**assessment_reports 待確認欄位：**
<!-- Codex 列出不確定是否存在的欄位 -->

---

## 環境變數清單

### 前端（Vercel / .env.local）

| 變數 | 用途 | 狀態 |
|------|------|------|
<!-- Codex 根據掃描結果填入 -->

### 後端（Vercel Environment Variables）

| 變數 | 用途 | 狀態 |
|------|------|------|
<!-- Codex 根據掃描結果填入 -->

---

## 前台路由現況

| 路由 | 功能 | 狀態 |
|------|------|------|
<!-- Codex 根據 App.jsx 填入 -->

---

## LINE 系統現況（最關鍵）

### 已完成
<!-- Codex 根據掃描結果填入 -->

### 未完成 / 有問題
<!-- Codex 根據掃描結果填入 -->

### 核心目標（還未達到）
> 用戶在官網完成快篩 → 加入 LINE → 自動收到個人化完整健康報告

---

## 目前優先任務

1. **任務名稱** — 說明
2. **任務名稱** — 說明
3. **任務名稱** — 說明

---

## 已知 Bug / 待修問題

| 問題 | 嚴重度 | 狀態 |
|------|------|------|
<!-- Codex 根據掃描結果填入 -->

---

## 版本記錄

| 日期 | 更新重點 |
|------|------|
| YYYY-MM-DD | 今日進展 |
<!-- 保留過去的版本記錄 -->

---

## 給 Claude 的說明

**讀這份文件的方式：**
先看「目前優先任務」和「LINE 系統現況」，這兩個區塊是最常變動、最需要跟上的。其他區塊（技術堆疊、資料表、路由）比較穩定，有疑問時再查。

**這份文件過時了怎麼辦：**
如果我說「最新進度是 XXX」，請以我說的為準，文件內容退為參考。如果我沒有特別說明，就以文件為主。

**不確定的事不要假設：**
標記 ⚠️ 待確認 的項目代表我也不確定，請直接問我，不要自行推斷。
```
