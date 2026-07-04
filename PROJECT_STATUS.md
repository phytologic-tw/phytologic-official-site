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
| 首頁 HomePage | ✅ | 依 V2 §4 五段結構重建（Hero/六色入口/三好三無/信念主張/導流CTA），取代原佔位首頁 |
| 首頁 Hero 圖片（4 張自動輪播） | ✅ | 2026-07-03 Bryan 提供 4 張 AI 生成圖（雲海雪山日出／晨霧稻田／森林光束／溫室育苗），套入 `public/images/home-hero-*.png`，每 6 秒淡入淡出切換。**例外於 CLAUDE.md §8「絕對禁止清單：Carousel 輪播」**——經 Bryan 明確確認採用自動輪播，非誤用；理念頁 Hero 與六色系列入口圖仍為佔位，未套用此批圖片 |
| 植本誌 Sanity CMS 真實串接 | ✅ | 2026-07-04 建立 Sanity 專案 `phytologic-journal`（Project ID `h3rw3ofo`，dataset `production`），Studio 部署於 `phytologic-journal.sanity.studio`；`studio/` 內含 `post` schema（title/slug/category/publishedDate/featured/posterImage/body/requiresReview/reviewStatus）；`src/lib/sanityClient.js` 串接前台 GROQ 查詢（`useCdn: true`），`JournalPage.jsx` 移除假資料改為 API 讀取；CORS 已開放 localhost 開發網域與 phytologic.tw 正式網域 |
| 植本誌 JournalPage（前台列表+輪播） | ✅ | 輪播區塊改為手動水平捲動（不自動播放），符合全站禁跑馬燈/彈出式輪播動效規範；資料為符合 CMS 欄位定義的假資料，待 Sanity 專案建立後替換 |
| 導覽列 navConfig | ✅ | 更新為首頁/理念/植萃系列/聯繫我們/植本誌五項 |
| 六色植萃頁改版（Claude Design 視覺稿套入） | ✅ | 套用 `~/Desktop/PHYTOLOGIC Website Design System-2/_export/`（2026-07-02 16:07 產出）視覺稿：版面改為左右分割（左側文字面板＋右側滿版真實產品圖），套入真實圖片 `public/images/series/*.png`；tagline 與家庭心聲文案同步採用新稿版本（與舊版「傳承的責任」等不同）。Nav/CTA/Footer **未採用**新稿的電商版（SHOP/Newsletter/PhytoWorld），維持既有 SiteHeader/SiteFooter（LINE OA + 五項導覽），因新稿與 MASTER SPEC「LINE OA 唯一轉換點」「PhytoWorld 不在此 repo 範圍」矛盾 |

---

## 進行中 / 待開發

| 項目 | 狀態 | 阻塞原因 |
|------|------|---------|
| 理念頁 Hero 圖片 / 首頁六色入口圖 / 信念主張區圖片 | ⏳ 待生成 | 首頁主 Hero 已於 2026-07-03 套入真實圖片（見上表），其餘圖片欄位仍為漸層佔位，等 Bryan 生成後替換 |
| 紫莓植萃圖片瓶身英文標示錯誤 | ⚠️ 待修正 | `public/images/series/berry-purple.png`（源自視覺稿 `img-amethyst.png`）瓶身印著「OSMANTHUS BOTANICAL ESSENCE」（桂花，應為桂香植萃專用），中文「紫莓植萃」正確但英文標示複製錯誤，需重新生成圖片 |
| SGS 八大營養標示 | ⏳ 待資料 | 等 Bryan 提供實際 SGS 檢驗數值 |

---

## Open Items（V3.1 後）

1. ✅ 理念頁「永續飲食計畫」正式命名為「植本邏輯支持永續飲食計劃」（2026-07-02 確認）
2. SGS 八大營養標示實際數值（待 Bryan 提供，之後再補上）
3. ✅ 植萃頁/首頁動畫觸發方式：維持捲動觸發（FadeUp + IntersectionObserver），不做停留觸發（2026-07-02 確認，理由：停留觸發在觸控裝置上語意不明確，捲動觸發已符合 V3 動效規範）
4. ✅ 合作頁聯絡信箱（lyra@phytologic.tw，2026-07-01 確認）
5. ✅ 植本誌 CMS 技術選型（Sanity，2026-07-01 確認）
6. ✅ 植本誌定名為「植本誌」（2026-07-02 確認，最終名稱）
7. LINE OA 連結（https://line.me/R/ti/p/@248xuoic，2026-07-01 已填入）
8. ✅ 首頁納入本次 rebuild 範圍（2026-07-02 確認，推翻 V3 第0節原標注「已完成無需重做」——實際上原內容於 repo 清空時遺失，已依 V2 §4 規範重建）

---

## 視覺稿來源記錄

2026-07-02，Bryan 提供 Claude Design 視覺稿匯出：`~/Desktop/PHYTOLOGIC Website Design System-2/_export/`（含 index.html/ideology.html/contact.html/series-*.html + ds tokens + 六張真實產品圖）。
- ideology.html、contact.html 內容與現有實作高度一致，未變更。
- index.html（首頁）與 series-*.html 的 Nav/Footer 使用通用電商元件（SHOP CTA、Newsletter、PhytoWorld 會員專區），與 MASTER SPEC 矛盾，**未採用**該部分；僅採用六色系列頁的排版與圖片。
- 六張真實產品圖已存入 `public/images/series/`，六色系列頁 tagline / 家庭心聲文案已依新稿更新。

---

*最後更新：2026-07-02*
