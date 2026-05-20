# 植本邏輯官方網站開發文件

本目錄保存 `phytologic-website` 的產品、工程、資料庫、部署與營運規範。`main` 保留為 production branch，日常開發與文件整理先集中在 `develop`。

## 專案現況

- 前端：Vite + React + Tailwind CSS
- 動效與圖示：Framer Motion、Lucide React
- API：Vercel Serverless Functions
- 資料庫與檔案：Supabase Database、Supabase Storage
- 部署：Vercel
- 主要正式網域規劃：`phytologic.tw`、`www.phytologic.tw`

## 文件架構

- `architecture/`：網站架構、主要頁面、模組責任與資料流。
- `database/`：Supabase schema、RLS、Storage、migration 規劃。
- `line/`：LINE 官方帳號導流、報告解鎖與會員流程規劃。
- `ai/`：派森 AI / Dr.Marvin 快篩與分析流程。
- `deployment/`：Git branch、Vercel、環境變數與發布流程。
- `admin/`：後台管理規劃與權限演進。
- `membership/`：會員、LINE Login、角色與顧客資料規劃。
- `roadmap/`：階段性開發計畫與待辦整理。

## 開發原則

1. `main` 僅作為正式 production branch。
2. `develop` 作為整合開發分支，正式功能完成並驗證後再規劃合併。
3. 文件、資料庫 migration、前端功能與 API 調整需分開描述，避免混在同一個不清楚的變更中。
4. 不直接在 `main` 修改未驗證功能。
5. 改動正式功能前，先更新或補齊對應文件。

## 目前主要系統

- 官方網站首頁與品牌內容
- 產品系列展示
- Dr.Marvin 生理狀態快篩與派森 AI 分析
- LINE 官方帳號導流與完整報告解鎖入口
- 合作夥伴平台
- 最新消息
- 精彩剪影
- Admin 後台
- Supabase 資料庫與 Storage

