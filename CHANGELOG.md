# CHANGELOG — phytologic-website (feature/v3-rebuild)

---

## 2026-07-01

### Added
- `src/pages/ContactPage.jsx`：合作頁，三段式結構（合作精神說明 + CTA 按鈕 + mailto:lyra@phytologic.tw），純前端零後端，使用共用 FadeUp 動畫元件
- `PROJECT_STATUS.md`：網站專屬進度追蹤文件
- `docs/SPEC_PATCH_V3.1_合作頁與植本誌.md`：Spec Patch V3.1 原始文件入庫
- `docs/JOURNAL_CMS_TECH_COMPARISON.md`：植本誌 CMS 技術選型比較（Sanity vs 自建），供 Bryan 決策參考

### Changed
- `src/components/SiteHeader.jsx`：LINE OA URL 由 TODO 佔位替換為正式網址 `https://line.me/R/ti/p/@248xuoic`
- `src/components/SiteFooter.jsx`：聯絡資訊區由 TODO 佔位填入 `lyra@phytologic.tw`
- `src/pages/series/SnowMountainPage.jsx`：ingredients 由舊清單（山藥/老薑/銀耳）更新為 V3 §3.4.1 正式清單（山藥/老薑/豆薯/紅棗/生核桃/蘋果）；terroir 移除銀耳，改為合併版兩句結構（山藥+老薑+核桃）
- `docs/PHYTOLOGIC_WEBSITE_MASTER_SPEC_V3.md`：版本號 V3.0 → V3.1；合併 Spec Patch V3.1，覆寫第4節（合作頁三段式結構）與第5節（植本誌正式內容模型、Sanity 技術選型、CMS 欄位定義）；Open Items 第4項（合作頁信箱）、第5項（CMS 選型）標記已解決；LINE OA 連結 Open Item 標記已填入

---

## 2026-07 初（建立期）

### Added
- `src/style.css`：全域 CSS 變數（六色 Soul Colors、排版 tokens、FadeUp 動畫類別）
- `src/lib/navConfig.js`：導覽連結單一來源（NAV_LINKS），供 Header/Footer 共用
- `src/components/SiteHeader.jsx`：固定頂部導覽，含 mobile hamburger menu
- `src/components/SiteFooter.jsx`：兩欄 footer，含版權聲明
- `src/pages/series/SnowMountainPage.jsx`：六色植萃範本頁（雪山植萃 #E9ECEB）
- `src/pages/series/LimeGreenPage.jsx`：青檸植萃（#4F7A5C）
- `src/pages/series/RosePage.jsx`：玫瑰植萃（#C2272D）
- `src/pages/series/CinnamonPage.jsx`：桂香植萃（#D9A02E）
- `src/pages/series/PurpleBerryPage.jsx`：紫莓植萃（#9B6FC4）
- `src/pages/series/PlatinumPage.jsx`：鉑金植萃（#E0D5BD）
- `docs/PHYTOLOGIC_WEBSITE_MASTER_SPEC_V2.md`：V2 規範存檔
- `docs/PHYTOLOGIC_WEBSITE_MASTER_SPEC_V3.md`：V3 官方規範（初版）

### Removed
- 舊會員系統相關所有代碼（見 commit `8ebfdb7`）
