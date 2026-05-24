# 植本邏輯 PHYTOLOGIC｜LINE 會員數位化計畫規格書 V1.0

> **文件用途**：這是給 Claude / Codex / 所有 AI 工具讀取的單一真相規格文件。  
> 開發任何 LINE 會員相關功能前，請先讀這份文件。  
> 版本：V1.0 ｜ 建立日期：2026-05-24 ｜ 網站：https://phytologic.tw  
> GitHub Repo：phytologic-tw/phytologic-official-site

---

## 目錄

1. [專案定位與核心使命](#一專案定位與核心使命)
2. [現況技術盤點](#二現況技術盤點2026-05-24)
3. [八大核心系統架構](#三八大核心系統架構)
4. [用戶旅程與核心閉環](#四用戶旅程與核心閉環)
5. [開發路線圖](#五開發路線圖)
6. [資料庫完整規格](#六資料庫完整規格)
7. [環境變數與部署規格](#七環境變數與部署規格)
8. [LIFF 頁面功能規格](#八liff-頁面功能規格)
9. [財務與安全規格](#九財務與安全規格)
10. [關鍵檔案索引](#附錄關鍵檔案索引)

---

## 一、專案定位與核心使命

### 1.1 產品本質宣言

植本邏輯不是一款飲料會員 App，而是一個「**健康 MMORPG 生態平台**」與「**人生健康成長平台**」。  
使用者在平台中不是會員，而是具備專屬身份的「**角色**」。

| 維度 | 傳統飲品品牌 | 植本邏輯定位 |
|------|------------|------------|
| 核心產品 | 飲品銷售 | AI 健康生態系統 |
| 用戶身份 | 購買者 / 會員 | 具專屬身份的「角色」 |
| 平台目的 | 促進消費 | 長期健康養成 + 生態擴張 |
| 留存機制 | 折扣 / 優惠 | 遊戲化 + AI 個人化 + 社群 |
| 數據資產 | 購買記錄 | 健康大數據 + 行為模型 |

**品牌核心理念**：重視生命、尊重自然、相信邏輯  
**品牌主張**：我們不是在販售飲料，而是在用自然、科學與愛，守護人生裡真正重要的人。

---

### 1.2 LINE 在生態系中的角色

LINE 不是客服工具，而是植本邏輯**會員核心操作介面**。官網是入口，LINE 是長期互動的家。

| 平台 | 角色定位 | 主要功能 |
|------|---------|---------|
| 官網 | 品牌入口 + 快篩入口 | 品牌展示、AI 健康快篩、導流加入 LINE |
| LINE OA | 即時互動 + 報告傳遞 | 健康報告接收、關鍵字互動、AI 問答 |
| LIFF | 會員中心核心 | 儀表板、打卡、任務、商城、個人健康紀錄 |
| Admin 後台 | 後台管理 | 會員管理、報告查閱、內容發布 |

---

## 二、現況技術盤點（2026-05-24）

### 2.1 已完成功能

| 功能模組 | 技術細節 | 狀態 |
|---------|---------|------|
| 品牌官網 | React SPA, Vite, Tailwind, Vercel | ✅ 上線 |
| 健康快篩問卷 | HealthAssessment.jsx，含分析、Supabase 寫入 | ✅ 可用 |
| assessment_reports DB | 全欄位含 partial/full_report, ai_analysis, line_user_id | ✅ 完整 |
| LINE 導流元件 | Header 按鈕、Footer QR、浮動按鈕、UnlockFullReportCard | ✅ 完成 |
| LINE Webhook | api/line-webhook.js，UUID 前 8 碼查詢，簽名驗證 | ✅ 可用 |
| follow 事件處理 | 加入 OA 自動回覆歡迎訊息 + 報告查詢提示 | ✅ 完成 |
| DB 回寫 line_user_id | Webhook 查報告成功後回寫 line_user_id / line_sent_at | ✅ 完成 |
| Admin 後台 | 7 個管理頁，Supabase Auth, role=admin | ✅ 正常 |
| LIFF 框架 | lineAuth.js, 6 個 /line/* 頁面，memberProfile.js 邏輯 | 🔧 框架有，未串接 |

### 2.2 未完成與已知問題

| 問題 | 影響 | 嚴重度 | 狀態 |
|------|------|-------|------|
| LINE 會員主表模型分裂（profiles vs line_members） | LIFF 所有會員功能失效 | 🔴 高 | ❌ 待修 |
| daily_checkins FK 衝突（指向 line_members 但前端傳 profiles.id） | 打卡寫入失敗 | 🔴 高 | ❌ 待修 |
| line_member_mvp.sql 欄位命名與 memberProfile.js 不一致 | 程式運行錯誤 | 🔴 高 | ❌ 待修 |
| Supabase service role key 曾出現在對話記錄 | 安全風險 | 🔴 高 | ❌ 需立即 rotate |
| 自動推送完整報告尚未完成 | 用戶須手動輸入編號，體驗差 | 🟡 中 | 🔧 待做 |
| Webhook 純文字回覆（無 Flex Message） | 用戶體驗不佳 | 🟡 中 | 🔧 待做 |
| 手機版快篩結果頁跳轉不穩 | 用戶流失點 | 🟡 中 | ❌ 待修 |
| Webhook 未處理 postback 事件 | 未來 Flex Message 按鈕失效 | 🔵 低 | 📋 待規劃 |

### 2.3 資料庫各表現況

| 資料表 | 狀態 | 說明與待辦 |
|-------|------|---------|
| `profiles` | ⚠️ 需補 migration | LINE 欄位（line_user_id 等）pending migration |
| `assessment_reports` | ✅ 可用 | 已有 line_user_id, line_sent_at, inflammation_level, full/partial_report |
| `line_members` | ❌ 模型待決 | active SQL 未建立；前端已改用 profiles，需正式決定 |
| `daily_checkins` | ❌ FK 衝突 | FK 指向 line_members(id)，前端傳 profiles.id，需修正 |
| `daily_ai_messages` | ⚠️ 待確認 | FK 指向 profiles(id)，需與 daily_checkins 統一 |
| `partners` | ✅ 正常 | 合作夥伴資料表 |
| `announcements` | ✅ 正常 | 最新消息資料表 |
| `gallery_items` | ✅ 正常 | Gallery 資料表 |
| `contact_submissions` | ✅ 正常 | 聯絡表單資料表 |

### 2.4 技術堆疊

| 技術 | 版本 | 狀態 |
|------|------|------|
| React | latest | ✅ 使用中 |
| Vite | latest | ✅ 使用中 |
| Tailwind CSS | ^3.4.17 | ✅ 使用中 |
| Supabase JS | ^2.105.4 | ✅ 使用中 |
| LINE LIFF SDK | ^2.29.0 | 🔧 進行中 |
| Framer Motion | latest | ✅ 使用中 |
| Lucide React | latest | ✅ 使用中 |
| Anthropic API | fetch 方式呼叫 | 🔧 進行中 |
| Vercel Serverless | api/*.js | ✅ 正常 |

### 2.5 前台路由現況

| 路由 | 功能 | 狀態 |
|------|------|------|
| `/` | 品牌首頁 | ✅ 正常 |
| `/assessment` | 派森 AI 健康快篩 | ✅ 正常 |
| `/partners` | 合作夥伴 | ✅ 正常 |
| `/news` | 最新消息 | ✅ 正常 |
| `/gallery` | 精彩剪影 | ✅ 正常 |
| `/admin/dashboard` | 後台總覽 | ✅ 正常 |
| `/admin/assessments` | 快篩結果查閱 | ✅ 正常 |
| `/line/entry` | LIFF 入口 / 建立會員 | 🔧 框架有，未串接 |
| `/line/today` | LINE 今日狀態 | 🔧 框架有，未串接 |
| `/line/checkin` | 今日打卡 | 🔧 框架有，未串接 |
| `/line/profile` | LINE 會員資料 | 🔧 框架有，未串接 |
| `/line/tasks` | LINE 任務頁 | 🔧 框架有，未串接 |
| `/line/shop` | LINE 商城導流 | 🔧 框架有，未串接 |

---

## 三、八大核心系統架構

### 系統一：會員身份系統（Account System）

**功能規格：**
- 多渠道登入：LINE Login（主要）、手機 OTP（未來）、Apple ID / Google（未來）
- 首次登入自動建立會員身份（profiles 資料表），賦予唯一角色 ID
- 必須綁定推薦碼或門市 QR Code，追溯 CP 貢獻來源
- 帳號安全：單一裝置綁定、異常登入偵測（Phase 3）

**資料模型（profiles 表 LINE 欄位）：**

| 欄位 | 型別 | 預設值 | 說明 |
|------|------|-------|------|
| `id` | uuid PK | gen_random_uuid() | 主鍵 |
| `line_user_id` | text UNIQUE | NULL | LINE 平台 userId |
| `line_display_name` | text | NULL | LINE 顯示名稱 |
| `line_picture_url` | text | NULL | LINE 頭像 URL |
| `referral_code` | text | NULL | 推薦人編號 |
| `level` | text | 'L1' | 會員等級 L1~L4 |
| `title` | text | '改變者' | 稱號文字 |
| `p_points` | integer | 0 | P 點數（可流通） |
| `cp_points` | integer | 0 | CP 貢獻點（不可提現） |
| `le_points` | integer | 0 | LE 幸運能量值 |
| `health_score` | integer | NULL | 綜合健康分數 0~100 |
| `streak_days` | integer | 0 | 連續打卡天數 |
| `last_checkin_date` | date | NULL | 最後打卡日期 |
| `seven_day_bonus_done` | boolean | false | 七日啟動計畫完成狀態 |

---

### 系統二：AI 健康模型系統（AI Core）

**兩層 AI 架構：**

- **第一層（基礎 AI，低成本）**：15 題互動問卷（涵蓋疲勞、睡眠、外食等）+ 生命靈數 → 生命能量模型、幸運色、推薦飲品、今日建議
- **第二層（進階 AI，高價值會員）**：L3 以上或高活躍會員啟用 LLM 深度分析（Anthropic API）→ 長期追蹤、情緒陪伴、個人化建議

**當前問題：**
- 目前隨機抽題 6~9 題，非真正動態問診
- 需改為依年齡、性別、職業、睡眠、運動、BMI 動態生成問題與追問
- AI 分析需對接 Anthropic API（`api/analyze.js` 已預留，`ANTHROPIC_API_KEY` 已設定）

**目標問診邏輯（AI Decision Tree）：**
```
輸入：年齡、性別、職業、BMI、睡眠時數、運動習慣、飲食型態
↓
動態產生：適合該族群的問題組合（從慢性發炎問卷資料庫取題）
↓
追問邏輯：依回答內容動態追問
↓
輸出：inflammation_level（1~10）、system_scores（各系統評分）、recommended_products、ai_analysis、lifestyle_advice
```

**慢性發炎問卷資料庫（已上傳）：**
- 青少年版（75 題）
- 20~30 歲版（100 題）
- 35~45 歲版（100 題）
- 50~60 歲版（100 題）
- 65~75 歲版（100 題）

---

### 系統三：健康養成系統（Health Growth）

**每日核心行為：**
- 今日飲用打卡：增加 LE 幸運能量值、健康值、活力值、代謝值
- 七日啟動計畫：新會員前 7 日完成飲用打卡 → 獲得 3 倍 LE + AI 引導
- 每日打卡建立 DAU（日活躍用戶）核心數據

**daily_checkins 資料模型：**

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | uuid PK | 打卡紀錄唯一 ID |
| `member_id` | uuid FK → profiles(id) | 會員 ID【需修正 FK】 |
| `checkin_date` | date | 打卡日期 |
| `mood_score` | integer | 心情評分 1~5 |
| `energy_level` | integer | 活力評分 1~5 |
| `symptoms` | jsonb | 今日症狀陣列 |
| `le_earned` | integer | 本次打卡獲得的 LE 值 |
| `notes` | text | 備註 |

---

### 系統四：雙點數金融系統（FinTech）

#### P 點數（Platform Point — 財務流通層）
- **用途**：具現金價值，可用於商城消費、提現、轉贈
- **匯率**：商城消費 25P = 1 元；提現 30P = 1 元
- **提現門檻**：滿 45,000P 才可提現，扣除 5% 手續費
- **轉換 CP**：1P 可轉換 100CP

#### CP 貢獻點（Contribution Point — 生態貢獻層）
- **用途**：不可提現，專用於等級晉升 L1~L4、權限解鎖、榮譽身份獲取
- **獲取來源**：消費型（1元=1CP）、推薦型（推薦註冊 500CP）、活動型、教育型
- **限制**：系統限制推薦型 CP 占比，避免過度傳直銷化

#### LE 幸運能量值（Lucky Energy）
- **取得方式**：僅能透過健康行為（運動、打卡、飲用）獲取，**不可直接購買**
- **用途**：消耗 LE 抽取健康盲盒（P點、CP、稀有稱號或植物）

#### L1~L4 等級與收益權限

| 等級 | 稱號 | 晉升門檻 | 消費回饋 | 直推分潤 | 管理/教育加成 |
|------|------|---------|---------|---------|------------|
| L1 | 改變者 | 註冊+首購 | 3P / 1元 | 0% | 0% |
| L2 | 實踐者 | 3,000 CP | 3.6P / 1元 | 15% | 0% |
| L3 | 教育家 | 15,000 CP | 3.6P / 1元 | 20% | 5% |
| L4 | 實業家 | 80,000 CP | 3.6P / 1元 | 23% | 12%（總封頂 35%） |

**⚠️ CAC 財務防線：所有分潤總計不得超過 35%**

---

### 系統五：遊戲化系統（Gamification）

- **健康盲盒**：消耗 LE 抽取 P 點、CP、稀有稱號或植物
- **黃金時刻**：系統排程開啟 LE 暴擊或 CP 雙倍時段，刺激活躍度
- **區域共鬥**：高雄市一週累積 500 萬健康值 → 解鎖限定稱號
- **世界事件**：「世界樹」「永夜降臨」等伺服器級大型活動（Phase 4）

---

### 系統六：社群與家族系統（Community）

- **好友系統**：查看朋友健康狀態、互贈禮物
- **L4 家族建立**：實業家可建立晨跑家族、修復家族等健康社群
- **實體活動**：羽球、公益、健康市集等線下聯動

---

### 系統七：商城與 O2O 系統

- **健康聯盟平台**：販售冰磚、健身券、課程、合作店家優惠，串接低溫冷鏈物流
- **O2O 動態掃碼**：實體門市掃碼自動核銷，即時發放 CP 與 LE
- 當前 `/line/shop` 頁面已建立，後端串接待開發（Phase 2）

---

### 系統八：身份與榮譽系統（Identity）

- **L4 專屬稱號**：「修復者」「晨跑領袖」「翡翠先行者」
- **2D 像素紙娃娃**：裝備、外觀人格化（Phase 4）
- **線下 NFC 感應掉寶**：門市體驗整合（Phase 4）

---

## 四、用戶旅程與核心閉環

### 4.1 完整用戶旅程（10 步）

| 步驟 | 用戶行為 | 系統動作 | 當前狀態 |
|------|---------|---------|---------|
| 1 | 訪問 phytologic.tw | 展示品牌、派森 AI 介紹 | ✅ 完成 |
| 2 | 進行健康快篩問卷 | 隨機出題、分析、寫入 assessment_reports | ✅ 完成 |
| 3 | 查看部分報告 | 顯示 UUID 前 8 碼、引導加入 LINE | ✅ 完成 |
| 4 | 加入 LINE OA | follow 事件 → 歡迎訊息 + 查詢提示 | ✅ 完成 |
| 5 | 輸入 8 碼報告編號 | Webhook 查詢 → 回覆報告（純文字） | ⚠️ 純文字，待升級 |
| **6** | **【目標】加入後自動收完整報告** | **follow → 自動 push full_report Flex Message** | **❌ 待做（最高優先）** |
| 7 | LINE Login 綁定身份 | LIFF 初始化 → findOrCreateMember → profiles 記錄 | ❌ 待做 |
| 8 | 進入 LIFF 會員儀表板 | 顯示健康分數、推薦飲品、每日任務 | ❌ 待做 |
| 9 | 每日打卡 + 飲用記錄 | daily_checkins 寫入，LE + 連續天數累積 | ❌ 待做 |
| 10 | 長期互動：任務、盲盒、社群 | 點數系統、等級晉升、遊戲化獎勵 | 📋 規劃中 |

### 4.2 核心閉環定義

**目前已達成：展示閉環**
```
官網展示 → 快篩 → 部分報告 → 引導加入 LINE → 手動查詢報告
```

**下一目標：留存閉環（Phase 1~2 核心）**
```
快篩 → 加入 LINE → 自動收到完整報告 → LINE Login 建立身份 → LIFF 儀表板 → 每日打卡
```

**最終目標：生態閉環（Phase 3~5）**
```
每日飲用打卡 → LE 積累 → 盲盒獎勵 → 等級晉升 → 推薦好友 → 家族系統 → 城市共鬥
```

---

## 五、開發路線圖

### 🚨 Phase 0 — 技術債修復（立即，約 1~2 週）

> 目標：修復所有阻塞後續開發的高風險問題，讓 LIFF 功能可以正常啟動

| 任務 | 技術說明 | 優先級 |
|------|---------|-------|
| 統一 LINE 會員主表為 `profiles` | 補齊 profiles 的 LINE 相關欄位 migration，清理殘留 FK | P0 |
| 修正 `daily_checkins.member_id` FK | 改指向 `profiles(id)` | P0 |
| 修正 `daily_ai_messages.member_id` FK | 統一改指向 `profiles(id)` | P0 |
| 對齊 `memberProfile.js` 欄位命名 | `line_display_name`, `lp`→`p_points`, `le`→`le_points` 等欄位需與 SQL schema 一致 | P0 |
| Rotate Supabase service role key | 在 Supabase Dashboard rotate，更新 Vercel production env | P0 |
| 修復手機版快篩結果頁跳轉 | 調試 HealthAssessment.jsx 手機版路由邏輯 | P1 |
| 確認 `.env.example` 提交 | `VITE_LINE_LIFF_ID`、`LINE_CHANNEL_SECRET`、`LINE_CHANNEL_ACCESS_TOKEN` | P1 |

---

### Phase 1 — MVP 生存版本（第 1~2 個月）

> 目標：「讓用戶加入 LINE 後，可以留下來」

| 功能 | 說明 | 相關檔案 |
|------|------|---------|
| 自動推送完整報告 | follow 事件 → 自動 push full_report，不需手動輸入報告編號 | api/line-webhook.js |
| Flex Message 升級 | 報告回覆改為圖文並茂的 Flex Message（含健康等級、飲品推薦、CTA 按鈕） | api/line-webhook.js |
| LINE Login / LIFF 初始化 | LIFF App ID 設定、initLiff 完整測試、取得用戶 LINE profile | src/lib/lineAuth.js |
| findOrCreateMember | LINE 登入後自動建立 profiles 記錄，綁定 line_user_id | src/lib/memberProfile.js |
| LIFF 入口頁（/line/entry） | 從 LINE 開啟 LIFF → 登入 → 導向儀表板 | src/pages/line/LineEntry.jsx |
| 會員儀表板（/line/today） | 顯示健康分數、今日推薦飲品、LE 值、連續打卡天數 | src/pages/line/LineTodayPage.jsx |
| 每日打卡（/line/checkin） | 飲用打卡、心情/活力記錄、LE 獎勵計算 | src/pages/line/LineCheckinPage.jsx |
| 七日啟動計畫 | 新會員前 7 日：3 倍 LE、AI 引導訊息、完成獎勵 | api/line-webhook.js |
| P 點數基礎功能 | 消費回饋計算（先上，不開放提現） | profiles 欄位 |
| E2E 驗收 | 快篩 → LINE → 自動報告 → LIFF 登入 → 打卡 → LE 累積完整流程 | All |

---

### Phase 2 — 留存成長版本（第 3~5 個月）

> 目標：「開始形成平台循環，讓用戶每天都有理由回來」

- AI 問卷引擎重構：依年齡/性別/職業動態生成問題，對接 Anthropic API
- 健康報告歷史（/line/profile）：查看歷史快篩趨勢、發炎指數曲線
- 任務系統（/line/tasks）：每日任務、週任務，完成獲得 LE / CP
- 健康盲盒：消耗 LE 抽取獎勵，建立多巴胺循環
- 好友系統：查看好友健康狀態、互贈禮物
- 冷鏈商城基礎（/line/shop）：飲品訂購、P 點消費流程
- 門市 QR Code 核銷串接：掃碼自動發放 CP + LE

---

### Phase 3 — 生態形成版本（第 6~9 個月）

> 目標：「讓會員開始自我擴張，平台從使用者推動走向社群驅動」

- 推薦綁定系統：推薦碼 + CP 回饋，正式啟動 L1~L4 分潤結算引擎
- AI 進階深度模型：L3 以上啟用 LLM 長期分析、AI 對話情緒陪伴
- 城市共鬥系統：區域健康值累積 → 限定稱號解鎖
- L4 健康家族建立：社群創建、成員管理
- 提現功能開放：45,000P 門檻，5% 手續費，風控機制

---

### Phase 4 — 世界觀版本（第 10~18 個月）

> 目標：「讓平台變成文化，植本邏輯成為用戶健康生活的一部分」

- 大型世界事件：世界樹、永夜降臨等伺服器級活動
- 2D 人格化紙娃娃系統：裝備、外觀、稀有稱號
- 線下 NFC 感應掉寶：門市體驗整合
- 高階 AI 助手：情緒陪伴、成長追蹤、預防醫學建議

---

## 六、資料庫完整規格

### 6.1 核心 Migration 執行順序（Phase 0）

```sql
-- Step 0: 移除舊版 admin schema 對 Supabase Auth 的綁定
-- LINE/LIFF 會員不是 auth.users，profiles.id 必須可用 gen_random_uuid() 自動建立
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 1: 補齊 profiles 的 LINE 會員欄位
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS line_user_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS line_display_name TEXT,
  ADD COLUMN IF NOT EXISTS line_picture_url TEXT,
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'L1',
  ADD COLUMN IF NOT EXISTS title TEXT DEFAULT '改變者',
  ADD COLUMN IF NOT EXISTS p_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cp_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS le_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_score INTEGER,
  ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_checkin_date DATE,
  ADD COLUMN IF NOT EXISTS seven_day_bonus_done BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS profiles_line_user_id_idx ON public.profiles (line_user_id);

-- Step 2: 修正 daily_checkins FK
ALTER TABLE public.daily_checkins
  DROP CONSTRAINT IF EXISTS daily_checkins_member_id_fkey;
ALTER TABLE public.daily_checkins
  ADD CONSTRAINT daily_checkins_member_id_fkey
    FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 3: 修正 daily_ai_messages FK（統一）
ALTER TABLE public.daily_ai_messages
  DROP CONSTRAINT IF EXISTS daily_ai_messages_member_id_fkey;
ALTER TABLE public.daily_ai_messages
  ADD CONSTRAINT daily_ai_messages_member_id_fkey
    FOREIGN KEY (member_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 4: assessment_reports member_id 確認指向 profiles
ALTER TABLE public.assessment_reports
  ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.profiles(id);
```

### 6.2 daily_ai_messages 資料模型

| 欄位 | 型別 | 說明 |
|------|------|------|
| `id` | uuid PK | 唯一 ID |
| `member_id` | uuid FK → profiles(id) | 會員 ID |
| `message_date` | date | 訊息日期 |
| `content` | text | AI 建議內容 |
| `message_type` | text | 類型（health/motivation/diet/sleep） |

### 6.3 assessment_reports 欄位完整清單

| 欄位 | 狀態 | 說明 |
|------|------|------|
| `id` | ✅ | UUID 主鍵 |
| `age_group` | ✅ | 年齡分組 |
| `height_cm` / `weight_kg` / `bmi` | ✅ | 身體資料 |
| `work_type` / `sleep_hours` / `sleep_quality` | ✅ | 生活型態 |
| `exercise_habit` / `diet_pattern` / `stress_level` | ✅ | 健康習慣 |
| `answers` | ✅ | 問卷答案 jsonb |
| `system_scores` | ✅ | 各系統評分 jsonb |
| `inflammation_level` | ✅ | 發炎指數（Webhook 讀此欄位） |
| `primary_systems` | ✅ | 主要問題系統 jsonb |
| `recommended_products` | ✅ | 推薦飲品 jsonb |
| `ai_analysis` | ✅ | AI 分析文字 |
| `lifestyle_advice` | ✅ | 生活建議 |
| `partial_report` | ✅ | 部分報告（免費顯示） |
| `full_report` | ✅ | 完整報告（LINE 解鎖） |
| `has_joined_line` | ✅ | 是否已加入 LINE |
| `line_user_id` | ✅ | LINE userId（Webhook 回寫） |
| `line_sent_at` | ✅ | 報告推送時間（Webhook 回寫） |
| `member_id` | ⚠️ 待確認 | 關聯 profiles.id |
| `short_code` | ⚠️ fallback | UUID 前 8 碼為主，short_code 為備 |

---

## 七、環境變數與部署規格

### 7.1 前端環境變數（Vercel / .env.local）

| 變數名稱 | 用途 | 狀態 |
|---------|------|------|
| `VITE_SUPABASE_URL` | Supabase 前端連線 URL | ✅ 正常 |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key（前端） | ✅ 正常 |
| `VITE_ADMIN_PASSCODE` | 後台 demo fallback 密碼 | ✅ 正常 |
| `VITE_LINE_OA_URL` | LINE 官方帳號 URL | ⚠️ 待確認 |
| `VITE_LINE_OFFICIAL_URL` | LINE 官方帳號 URL 備用 | ⚠️ 待確認 |
| `VITE_LINE_CTA_URL` | LINE CTA 連結備用 | ⚠️ 待確認 |
| `VITE_LINE_LIFF_ID` | LIFF App ID（LIFF 初始化必需） | 🔧 工作區已補，待確認提交 |

### 7.2 後端環境變數（Vercel Production）

| 變數名稱 | 用途 | 狀態 |
|---------|------|------|
| `SUPABASE_URL` | 後端 Supabase URL | ✅ 正常 |
| `SUPABASE_SERVICE_ROLE_KEY` | 後端 service role key | ⚠️ 需立即 rotate |
| `ANTHROPIC_API_KEY` | Claude AI API（analyze.js） | ✅ 正常 |
| `LINE_CHANNEL_SECRET` | LINE Webhook 簽名驗證 | ✅ 正常 |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API push/reply | ✅ 正常 |
| `ADMIN_PASSCODE` | api/admin.js 舊流程備用密碼 | ⚠️ 待確認 |

### 7.3 部署架構

- **前端**：Vercel（正式專案：`phytologic-official-site-esme`）
- **Webhook URL**：`https://www.phytologic.tw/api/line-webhook`
  - ⚠️ 必須使用 `www`，避免 `phytologic.tw` → `www` 的 307 redirect 導致 POST 失效
- **資料庫**：Supabase（含 RLS + admin policies + updated_at trigger）
- **健康檢查**：`GET /api/line-webhook` 回傳 env 診斷，確認 service_role 正確

### 7.4 LINE 後台設定注意事項

- LINE OA 自動回應訊息需**關閉**，否則 Webhook 不會收到使用者訊息
- LINE Developers Console → Messaging API → Webhook URL 設為 `https://www.phytologic.tw/api/line-webhook`
- LIFF App → Endpoint URL 設為 `https://www.phytologic.tw/line/entry`

---

## 八、LIFF 頁面功能規格

### 8.1 頁面清單

| 路由 | 頁面名稱 | 核心功能 | Phase | 狀態 |
|------|---------|---------|-------|------|
| `/line/entry` | LIFF 入口 | LIFF 初始化 → LINE 登入 → findOrCreateMember → 導向 Today | P1 | 🔧 框架 |
| `/line/today` | 今日儀表板 | 健康分數卡、LE值、連續打卡天數、今日推薦飲品、快速打卡入口 | P1 | 🔧 框架 |
| `/line/analysis` | 健康分析 | 查看歷史快篩、發炎指數、AI 分析與系統分數 | P1 | 🔧 框架 |
| `/line/checkin` | 今日打卡 | 飲用記錄、心情/活力評分、LE 獎勵顯示、連續天數更新 | P1 | 🔧 框架 |
| `/line/profile` | 會員資料 | 個人資訊、等級徽章、P/CP/LE 點數、健康快篩歷史 | P1 | 🔧 框架 |
| `/line/tasks` | 任務中心 | 每日/週/限定任務清單、完成進度、獎勵領取 | P2 | 📋 待做 |
| `/line/shop` | 商城 | 飲品訂購、健康聯盟商品、P 點消費、冷鏈物流 | P2 | 📋 待做 |
| `/line/assessment` | LINE 版快篩 | LIFF 內執行 AI 問卷，結果關聯會員身份 | P2 | 📋 待做 |

### 8.2 視覺設計規範

- **風格定位**：新極簡科學美學（Neo-Minimalist Science），實驗室等級高階質感
- **色彩計畫**：莫蘭迪色系（Morandi Palette）— 翡翠綠 `#123828`、珍珠白、寶石紅等低彩度灰調
- **LINE 主色**：`#06C755`
- **交互設計**：數據呈現具備精密儀表板感，減少冗餘動畫，強調數據透明與精確

### 8.3 LIFF 開發關鍵邏輯

```javascript
// lineAuth.js 核心流程
async function initAndGetProfile() {
  await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID });
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
    return null;
  }
  const profile = await liff.getProfile();
  return profile; // { userId, displayName, pictureUrl }
}

// memberProfile.js 核心流程
async function findOrCreateMember(lineProfile) {
  const { userId, displayName, pictureUrl } = lineProfile;
  // 1. 查詢 profiles WHERE line_user_id = userId
  // 2. 若無 → INSERT profiles (line_user_id, line_display_name, line_picture_url, level='L1')
  // 3. 回傳 profiles record
}
```

---

## 九、財務與安全規格

### 9.1 CAC 財務防線

- 平台建立嚴格的 **35% CAC（客戶獲取成本）財務防線**，確保毛利安全
- 所有等級分潤 + 管理加成總計不得超過 35%
- Phase 1 P 點數先上，**不開放提現**，確保早期財務安全

### 9.2 點數防濫用機制

- 推薦型 CP 占比限制：防止過度傳直銷化
- 提現風控：45,000P 最低門檻，5% 手續費，異常行為偵測
- 單一裝置綁定（Phase 3）：防止多帳號刷點
- LE 幸運能量值：**僅能透過健康行為獲得，不可購買**，防止刷分

### 9.3 資安要求

- Supabase RLS（Row Level Security）全面啟用
- Admin API 使用 service role key，前端使用 anon key，嚴格分離
- LINE Webhook 使用 `x-line-signature` HMAC-SHA256 驗證，防止偽造請求
- `SUPABASE_SERVICE_ROLE_KEY` 定期 rotate（**目前需立即執行**）
- LIFF 應用需在 LINE Developers Console 正確設定 Endpoint URL 白名單

---

## 附錄：關鍵檔案索引

| 功能 | 檔案路徑 | 狀態 |
|------|---------|------|
| 健康快篩 | `src/components/HealthAssessment.jsx` | ✅ 完成 |
| LINE 解鎖卡片 | `src/components/line/UnlockFullReportCard.jsx` | ✅ 完成 |
| LINE 導流設定 | `src/components/line/lineConfig.js` | ✅ 完成 |
| LINE QR Code | `src/components/line/LineQRCode.jsx` | ✅ 完成 |
| LINE 浮動按鈕 | `src/components/line/FloatingLineButton.jsx` | ✅ 完成 |
| LINE CTA | `src/components/line/LineCTA.jsx` | ✅ 完成 |
| LIFF 認證 | `src/lib/lineAuth.js` | 🔧 待完整串接 |
| LINE 會員資料操作 | `src/lib/memberProfile.js` | ⚠️ 欄位命名待對齊 |
| 每日健康訊息 | `src/lib/dailyMessage.js` | 🔧 進行中 |
| Supabase Client | `src/lib/supabase.js` | ✅ 正常 |
| AI 分析 API | `api/analyze.js` | ⚠️ 未完整整合 |
| LINE Webhook | `api/line-webhook.js` | ✅ 可用 |
| 後台管理 API | `api/admin.js` | ⚠️ 待確認 |
| DB 主 Schema | `supabase/website_expansion.sql` | ✅ 基礎完成 |
| DB LINE 會員 MVP | `supabase/line_member_mvp.sql` | ❌ 欄位不一致，待重寫 |
| DB RLS 修復 | `supabase/admin_rls_repair.sql` | ✅ 完成 |
| LIFF 入口頁 | `src/pages/line/LineEntry.jsx` | 🔧 框架，待串接 |
| LIFF 今日頁 | `src/pages/line/LineTodayPage.jsx` | 🔧 框架，待串接 |
| LIFF 打卡頁 | `src/pages/line/LineCheckinPage.jsx` | 🔧 框架，待串接 |
| LIFF 會員資料 | `src/pages/line/LineProfilePage.jsx` | 🔧 框架，待串接 |
| LIFF 任務頁 | `src/pages/line/LineTasksPage.jsx` | 📋 待開發 |
| LIFF 商城頁 | `src/pages/line/LineShopPage.jsx` | 📋 待開發 |

---

## 版本記錄

| 版本 | 日期 | 更新重點 |
|------|------|---------|
| V1.0 | 2026-05-24 | 初版建立。整合現況技術盤點（PROJECT_STATUS.md）與會員系統第七版本（V7.0）設計藍圖，產出完整數位化計畫規格書 |

---

> **給 Claude / Codex 的說明**
>
> 1. 這份文件是植本邏輯 LINE 會員系統的**唯一真相規格文件**，優先於其他所有文件
> 2. 開發任何功能前請先確認對應的 Phase 和狀態欄位
> 3. 標記 `⚠️ 待確認` 的項目請先詢問，不要自行推斷
> 4. Phase 0 的問題若尚未修復，請勿跳過直接開發 Phase 1 功能
> 5. 所有 LINE 會員資料統一使用 `profiles` 資料表，不使用 `line_members`
> 6. `SUPABASE_SERVICE_ROLE_KEY` 只能在後端（`api/*.js`）使用，絕對不能出現在前端
