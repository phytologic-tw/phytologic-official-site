# 開發與部署流程

更新日期：2026-05-20

## Branch 規範

- `main`：production branch，保留給正式上線版本。
- `develop`：development branch，作為日常開發、文件整理與整合測試分支。

目前原則：

1. 從 `main` 建立 `develop`。
2. 開發與文件先提交到 `develop`。
3. 不直接把未驗證變更 merge 到 `main`。
4. 正式上線前，需確認 build、環境變數、Supabase schema 與 Vercel 設定。

## 本機開發

```bash
npm install
npm run dev
```

開發伺服器使用 Vite，package script 目前指定 host 為 `127.0.0.1`。

## 正式建置

```bash
npm run build
```

輸出資料夾：

```txt
dist/
```

## Vercel 設定

- Framework Preset：Vite
- Build Command：`npm run build`
- Output Directory：`dist`

`vercel.json` 目前設定多個 rewrite，讓 `/partners`、`/news`、`/gallery`、`/admin`、`/admin/:path*` 等路由回到 `/`，交由 React 前端處理。

## 環境變數

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

## 發布檢查

正式發布前至少確認：

- `npm run build` 成功。
- Vercel 專案環境變數完整。
- Supabase migration 已套用到目標環境。
- Admin API 的 `ADMIN_PASSCODE` 與前端 `VITE_ADMIN_PASSCODE` 一致。
- LINE 官方帳號 URL 指向正式帳號。
- `main` 只接收已驗證的 production-ready 變更。

## 目前暫不做的事

- 不在本文件階段修改正式功能邏輯。
- 不把 `develop` merge 回 `main`。
- 不新增未設計完成的 LINE Webhook、會員登入或支付流程。

