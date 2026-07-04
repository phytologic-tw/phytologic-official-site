# CHANGELOG — phytologic-website (feature/v3-rebuild)

---

## 2026-07-04 — 植本誌 Sanity CMS 串接

### Added
- `studio/`：Sanity Studio 後台原始碼，已部署至 `https://phytologic-journal.sanity.studio/`（Project ID `h3rw3ofo`，dataset `production`）
- `studio/schemaTypes/post.js`：植本誌文章 schema（title/slug/category/publishedDate/featured/posterImage/body/requiresReview/reviewStatus）
- `src/lib/sanityClient.js`：`@sanity/client` 前台查詢，僅讀取 `reviewStatus == "published"` 的文章

### Changed
- `src/pages/JournalPage.jsx`：移除假資料 `JOURNAL_ENTRIES`，改為 `useEffect` 呼叫 `fetchJournalEntries()` 讀取真實內容；`posterColor` 佔位改為 `posterImageUrl` 真實圖片（無圖時 fallback 灰階漸層）

### Note
- Sanity 專案的 CORS origins 已開放 `localhost:5173`／`127.0.0.1:5173`（開發）與 `phytologic.tw`／`www.phytologic.tw`（正式），前台為 public dataset 讀取，不需 API token

---

## 2026-07-03 — 首頁 Hero 真實圖片（自動輪播）

### Added
- `public/images/home-hero-{mountain,field,forest,greenhouse}.png`：Bryan 提供 4 張 AI 生成真實圖片
- `src/pages/HomePage.jsx`：Hero 區塊改為 4 張圖片自動輪播（6 秒 opacity 淡入淡出切換 + Ken Burns 微縮放），取代漸層佔位

### Note
- 此為 **CLAUDE.md §8「絕對禁止清單：Carousel 輪播」之明確例外**，經 Bryan 於對話中確認採用自動輪播，非誤用或疏漏
- `src/components/SiteFooter.jsx`：移除過期註解「（待補）」，聯絡資訊實際已填妥

---

## 2026-07-02（二）— 六色系列頁改版

### Changed
- `src/pages/series/SnowMountainPage.jsx`（範本）+ 其餘五色頁：套入 Claude Design 視覺稿新版面，滿版深色疊圖 → 左右分割（左側淺色文字面板 + 右側滿版真實產品圖）；新增 `hexToRgba()` helper 依 soulColorHex 動態計算 PRODUCT INFO 卡片底色/邊框；移除 SCROLL 捲動提示（新版面不需要）
- 六色 tagline / 家庭心聲（familyVoice）文案依視覺稿更新（例如雪山植萃 tagline 由「傳承的責任」改為「腦力族的溫和滋養，腸胃敏感者的日常修復」），ingredients/servingSize/howToDrink/tastingNote/terroir/tripleGoodNote 維持不變
- Nav/Footer/CTA **未採用**視覺稿的電商版本（SHOP CTA、Newsletter 訂閱、PhytoWorld 會員專區），因與 MASTER SPEC「LINE OA 唯一轉換點」「PhytoWorld 不在此 repo 範圍」矛盾，維持既有 SiteHeader/SiteFooter

### Added
- `public/images/series/`：六張真實產品圖（snow-mountain.png / lime-green.png / rose-red.png / cinnamon-gold.png / berry-purple.png / platinum.png），取代原本的漸層佔位

### Known Issues
- `public/images/series/berry-purple.png` 瓶身英文標示錯誤印著「OSMANTHUS BOTANICAL ESSENCE」（應為桂香植萃專用），中文「紫莓植萃」正確；此為視覺稿原始圖片素材本身的錯誤，需重新生成

---

## 2026-07-02

### Added
- `src/pages/HomePage.jsx`：正式首頁，依 V2 §4 規範重建五段結構（Hero / 六大植萃系列入口 / 三好三無 / 信念主張 / 導流CTA），取代原本臨時佔位首頁
- `src/pages/JournalPage.jsx`：植本誌前台頁，輪播區塊（手動水平捲動，不自動播放，符合全站禁跑馬燈/彈出式輪播規範）+ 內容列表（依發布日期新到舊排序）；內容為符合 V3.1 §5 CMS 欄位定義的假資料，待 Sanity 專案建立後替換

### Changed
- `src/App.jsx`：新增 `/journal` 路由，首頁改為引入 `HomePage.jsx`（移除內嵌的臨時佔位元件）
- `src/lib/navConfig.js`：NAV_LINKS 新增「首頁」「植本誌」，補齊 V3 主導覽五大項目
- `src/pages/IdeologyPage.jsx`：Section 4 標題新增正式計畫名稱「植本邏輯支持永續飲食計劃」，原標題「為什麼堅持台灣在地食材」改為副標
- `PROJECT_STATUS.md`：首頁、植本誌前台列表由「待開發」更新為「已完成」；Open Items 第1、3、6、8項標記已決定（永續飲食計畫命名、動畫觸發方式維持捲動觸發、植本誌定名、首頁納入本次 rebuild 範圍）

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
