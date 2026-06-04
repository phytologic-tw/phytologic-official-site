# 植本邏輯 PHYTOLOGIC 官方網站部署包

本專案為 Vite + React + Tailwind 官方網站版本，已包含：

- 植本邏輯 Logo：`public/logo.png`
- 官網首頁與互動式產品介紹
- 派森發炎指數快篩問卷
- 產品推薦邏輯
- 聯絡我們區塊
- 已通過 `npm run build`

## 本機預覽

```bash
npm install
npm run dev
```

## 產生正式版

```bash
npm run build
```

產生的靜態網站會在：

```txt
dist/
```

## Vercel 部署方式

### Production Canonical Target

**正式 production Vercel project 必須使用：**

```txt
phytologic-official-site-esme
```

**正式驗收網域必須使用：**

```txt
https://www.phytologic.tw
```

注意：`phytologic-official-site` 是 GitHub repo 名稱，不等於目前 production Vercel project 名稱。未來部署、驗收、手機端 LIFF 檢查與 Vercel CLI 操作，都不得把 `phytologic-official-site` 誤當 production project。

建議 production 部署指令：

```bash
npx --yes vercel@latest deploy --prod
```

1. 將整個資料夾上傳到 GitHub。
2. 登入 Vercel。
3. New Project → Import GitHub Repository。
4. Framework Preset 選 Vite。
5. Build Command 使用：

```bash
npm run build
```

6. Output Directory 使用：

```bash
dist
```

7. 部署完成後，到 Vercel 的 Domains 加入：

```txt
phytologic.tw
www.phytologic.tw
```

## DNS 設定

在網域商後台設定：

```txt
A     @      76.76.21.21
CNAME www    cname.vercel-dns.com
```

等待 DNS 生效後，正式網址建議使用：

```txt
https://phytologic.tw
```

## 注意事項

目前聯絡表單是前端互動展示版，尚未接 Email、Google Sheet 或後台資料庫。正式上線前可再接：

- Formspree
- Google Sheet API
- Vercel Serverless Function
- LINE 官方帳號導流

## 第二階段 LINE 完整報告推送（TODO）

第一階段：問卷完成後顯示報告編號，引導使用者至 LINE 輸入編號取得完整分析（目前版本）。

第二階段待實作：

- [ ] 將 `LINE_OFFICIAL_URL` 替換為正式 OA 連結，並設定環境變數 `VITE_LINE_OA_URL`
- [ ] 導入 LINE Messaging API Webhook（`api/line-webhook.js`）
- [ ] 接收使用者在 LINE 輸入的報告編號（8碼），查詢 Supabase `assessment_reports`
- [ ] 回傳格式化完整報告到使用者 LINE 聊天室
- [ ] 導入 LIFF 或 LINE Login，取得 `line_user_id`
- [ ] 問卷完成後自動推送完整報告到該 LINE 使用者
- [ ] 寫入 `assessment_reports.line_user_id` 與 `line_sent_at`
- [ ] 將 admin passcode gate 升級為 Supabase Auth 或 LINE Login RBAC
