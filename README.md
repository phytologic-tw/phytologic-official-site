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
