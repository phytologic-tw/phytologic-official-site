# phytologic-website 網站開發進度

> 本文件僅追蹤 `phytologic-official-site` repo（官方網站）的開發進度。
> 跨生態系整體進度（含 PhytoWorld 會員系統）仍以 `phytologic-core` 根目錄的 `PROJECT_STATUS.md` 為準。

分支：`feature/v3-rebuild`
規格依據：`docs/PHYTOLOGIC_WEBSITE_MASTER_SPEC_V3.md`（V3.1）

---

## 已完成

| 項目 | 狀態 | 備注 |
|------|------|------|
| repo 清空、保留設定檔 | ✅ | 移除舊會員系統代碼，保留 .git/vercel.json/package.json |
| 共用元件：SiteHeader | ✅ | 含 mobile hamburger，LINE OA 連結已填入正式網址 |
| 共用元件：SiteFooter | ✅ | 聯絡信箱已填入 lyra@phytologic.tw |
| 導覽設定：navConfig.js | ✅ | 單一來源，Header/Footer 共用 |
| 六色植萃頁（雪山/青檸/玫瑰/桂香/紫莓/鉑金） | ✅ | ingredients 對照 V3 §3.4.1；SGS 完全不呈現 |
| 跨頁一致性核對 | ✅ | 結構/欄位/背景/SGS/navigation chain 五項全通過 |
| 合作頁 ContactPage | ✅ | 三段式：說明文字 + CTA + mailto:lyra@phytologic.tw |
| Spec V3.1 合併（合作頁+植本誌內容模型） | ✅ | Open Items 第4、5項標記已決定 |

---

## 進行中 / 待開發

| 項目 | 狀態 | 阻塞原因 |
|------|------|---------|
| 理念頁 | ⏳ 待開發 | 無阻塞，可直接開始 |
| 植本誌（前台列表+輪播） | ⏳ 待開發 | 需先建立 Sanity schema |
| 植本誌（Sanity CMS 串接） | ⏳ 待開發 | 需開 Sanity 帳號（建議公司信箱持有） |
| 首頁 | ⏳ 待確認 | V3 第0節標注首頁不在本次 rebuild 範圍，待 Bryan 確認 |
| 六色植萃頁背景圖片 | ⏳ 待生成 | 等 Bryan 使用 Adobe Firefly 生成後替換 TODO 漸層 |
| SGS 八大營養標示 | ⏳ 待資料 | 等 Bryan 提供實際 SGS 檢驗數值 |

---

## Open Items（V3.1 後）

1. 理念頁「永續飲食計畫」是否需要正式命名（V3 第2.3節）
2. SGS 八大營養標示實際數值（待 Bryan 提供）
3. 植萃頁動畫觸發方式（捲動 vs 停留，交 Claude Design 決定）
4. ✅ 合作頁聯絡信箱（lyra@phytologic.tw，2026-07-01 確認）
5. ✅ 植本誌 CMS 技術選型（Sanity，2026-07-01 確認）
6. 植本誌最終定名確認（「植本誌」是否為最終名稱）
7. LINE OA 連結（https://line.me/R/ti/p/@248xuoic，2026-07-01 已填入）

---

*最後更新：2026-07-01*
