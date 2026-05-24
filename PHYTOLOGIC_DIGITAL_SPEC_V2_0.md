# 植本邏輯 PHYTOLOGIC
# 數位化生態系部署規格書 V2.0
# Digital Ecosystem Deployment Specification

> **文件性質**：第一階段數位化部署唯一真相規格文件  
> **版本**：V2.0 ｜ 建立日期：2026-05-24  
> **適用對象**：Claude · Codex · 所有 AI 開發工具 · 技術執行團隊  
> **網站**：https://phytologic.tw ｜ **LINE OA**：@phytologic  
> **GitHub**：phytologic-tw/phytologic-official-site  

> ⚠️ 本文件優先於所有舊版規格書。開發任何功能前請先完整閱讀。

---

## 目錄

1. [生態系總覽與三層架構](#一生態系總覽與三層架構)
2. [多元入口來源系統](#二多元入口來源系統)
3. [推廣人追蹤系統](#三推廣人追蹤系統)
4. [LINE OA 會員建立流程](#四line-oa-會員建立流程)
5. [LINE Rich Menu 三入口設計](#五line-rich-menu-三入口設計)
6. [會員專區首頁設計規格](#六會員專區首頁設計規格)
7. [八大會員功能規格](#七八大會員功能規格)
8. [Dr. Marvin AI 知識庫三支柱](#八dr-marvin-ai-知識庫三支柱)
9. [My Dr. Marvin 深度檢測規格](#九my-dr-marvin-深度檢測規格)
10. [資料庫 Schema 更新規格](#十資料庫-schema-更新規格)
11. [Admin 後台新增功能規格](#十一admin-後台新增功能規格)
12. [技術堆疊與環境變數](#十二技術堆疊與環境變數)
13. [開發優先順序與任務清單](#十三開發優先順序與任務清單)
14. [給 Codex 的實作指引](#十四給-codex-的實作指引)

---

## 一、生態系總覽與三層架構

### 1.1 核心定位

植本邏輯數位生態系由三個平台組成，各有明確職責，不重疊、不越界：

| 層級 | 平台 | 核心職責 | 目標行為 |
|------|------|---------|---------|
| Layer 01 | 官方網頁 phytologic.tw | 品牌展示 · 信任建立 · 引流 | 陌生人 → 有興趣的潛在會員 |
| Layer 02 | LINE 官方帳號 @phytologic | 身份建立 · 報告傳遞 · 互動 | 潛在會員 → 正式會員 |
| Layer 03 | 會員專區 LIFF App | 功能使用 · 習慣養成 · 留存 | 會員 → 長期活躍用戶 |

### 1.2 Layer 01：官方網頁功能範圍

- 品牌故事、六個家庭的理念
- 五色植萃產品系列介紹
- Dr. Marvin **官網輕量版快篩**（5題，查看部分報告，引導加入 LINE）
- 合作夥伴申請 · 聯絡表單
- **不包含**：會員登入、完整報告、任何 LIFF 功能

### 1.3 Layer 02：LINE OA 功能範圍

**Rich Menu 精簡三入口**（不得增加）：
1. 會員專區
2. My Dr. Marvin
3. 最新活動

**LINE 聊天頻道功能**：
- 歡迎 Flex Message（依來源客製化）
- 健康報告 Flex Message 推送
- 關鍵字自動回應
- AI 問答（Dr. Marvin 基礎對話）

### 1.4 Layer 03：會員專區 LIFF 功能範圍

八大功能（詳見第七章）：今日打卡 · 我的報告 · My Dr. Marvin · 植萃商城 · 任務中心 · 我的帳戶 · 推薦好友 · 最新活動

**入口唯一性原則**：Layer 03 的所有功能，入口只能從 LINE Rich Menu 的「會員專區」進入 LIFF。不設任何獨立網頁入口。

---

## 二、多元入口來源系統

### 2.1 五大入口類型

消費者不一定從官方網頁加入。系統必須支援所有以下入口，且體驗一致：

| 入口類型 | 觸發場景 | QR/連結格式 | referral_source 值 |
|---------|---------|------------|-------------------|
| 官方網頁 | Dr. Marvin 快篩後引導 | 官網 CTA 按鈕 | `website` |
| 展覽 · 活動現場 | 掃碼換體驗包 | 活動專屬 QR Code | `event_{年份}_{城市}_{場次}` |
| 實體門市 | 門市人員推廣 | 門市/推廣人 QR Code | `store_{城市}_{門市代號}` |
| 好友推薦 | 會員分享推薦碼 | 帶 ref 參數的連結 | `referral` |
| 廣告 · 社群 | IG / FB / TikTok 廣告 | UTM 追蹤連結 | `ig_ad` / `fb_ad` / `kol_{名稱}` |

### 2.2 LINE 加入連結標準格式

```
https://line.me/R/ti/p/@phytologic?ref={PROMOTER_CODE}&src={SOURCE_TYPE}&evt={EVENT_ID}
```

參數說明：
- `ref`：推廣人唯一識別碼（格式見第三章）
- `src`：來源類型（對應 referral_source）
- `evt`：活動場次 ID（展覽/活動專用，可選）

### 2.3 各入口的歡迎 Flex Message

加入後系統依 `referral_source` 推送對應版本：

**官網來源**
> 「您的植本邏輯健康快篩報告已在這裡等您。完成會員資料，即可查看完整的 AI 健康分析。」

**展覽 · 活動來源**
> 「感謝您在 {活動名稱} 與我們相遇。您的體驗包資格已登記，完成會員資料填寫即視為資格確認。」

**門市來源**
> 「感謝您光臨植本邏輯。完成會員資料，您將獲得首次消費 CP 點數回饋。」

**推薦 · 廣告來源**（通用版）
> 「歡迎加入植本邏輯，開始您的植萃健康旅程。填寫基本資料，Dr. Marvin 正在準備您的個人洞察。」

---

## 三、推廣人追蹤系統

### 3.1 推廣人類型

| 類型 | 代碼前綴 | 範例 | 說明 |
|------|---------|------|------|
| 門市店員 | `P_STORE_` | `P_STORE_KH01` | 高雄門市第1位推廣員 |
| 區域合作 | `P_PARTNER_` | `P_PARTNER_GYM01` | 合作健身房 |
| 會員推廣人 | `P_MEMBER_` | `P_MEMBER_A1B2C3` | L2以上會員升格 |
| KOL合作 | `P_KOL_` | `P_KOL_IGNAME` | 社群媒體合作 |
| 活動現場 | `P_EVENT_` | `P_EVENT_2026TW01` | 特定展覽場次 |

### 3.2 資料寫入規則

用戶加入 LINE 時，系統從 URL 參數讀取 `ref`，寫入 `profiles` 資料表：

```
profiles.promoter_id    = ref 參數值（例："P_STORE_KH01"）
profiles.promoter_type  = 依前綴推斷（"store" / "partner" / "member" / "kol" / "event"）
profiles.referral_source = src 參數值
profiles.event_id       = evt 參數值（若有）
profiles.joined_at      = 加入時間戳記
```

### 3.3 Admin 後台追蹤維度

後台必須支援三個核心查詢維度：

**維度一：推薦人數**
- 每位推廣人（promoter_id）帶入的會員總數
- 依時間區間篩選（日 / 週 / 月 / 自訂）
- 依 promoter_type 分組統計

**維度二：消費追蹤**
- 哪些被推薦會員有下單記錄
- 首購金額 · 品項 · 時間差（加入→首購天數）
- 回購率追蹤

**維度三：點數結算**
- 推薦 CP 累積：每成功推薦 1 位會員 → 推廣人獲 X CP（數值由業務規則設定）
- 消費回饋 CP：被推薦會員首購 → 推廣人再獲 Y CP
- 批量匯出結算報表（CSV）
- 批量發放 P 點福利（Admin 操作）

### 3.4 CP 結算防濫用規則

- 同一 LINE userId 只能被計入一次推薦
- 推薦人不得推薦自己（系統驗證 line_user_id 不重複）
- 活動體驗包來源（event）：僅計人數，不自動發放 CP，需 Admin 手動核銷
- 會員推廣人（P_MEMBER_）：受 35% CAC 財務防線約束

---

## 四、LINE OA 會員建立流程

### 4.1 標準加入流程（三步驟）

**Step 1 — 30秒快速填寫（必填，解鎖會員資格）**
- 暱稱（預填 LINE 顯示名稱，可修改）
- 出生年月日（用於計算生命靈數）
- 性別

**Step 2 — 健康偏好（卡片式多選，快速完成）**
- 飲食習慣（全素 / 蛋奶素 / 葷食 / 不固定）
- 壓力指數（1–5 滑桿）
- 在意的身體部位（多選卡片）：
  - 頭部（頭痛、睡眠、注意力）
  - 消化系統（腸胃、代謝、排便）
  - 體態（體重、體脂、水腫）
  - 四肢（關節、肌肉、痠痛）
  - 皮膚（膚色、暗沉、痘痘）
  - 能量（疲勞、精神、活力）
  - 情緒（焦慮、情緒波動、壓力）

**Step 3 — 來源確認（選填）**
- 推薦人編號輸入框（若 URL 已帶 ref，自動帶入並顯示推薦人名稱，不需手動填）
- 已從活動現場加入者：顯示「已識別您的活動來源，資格確認中」

### 4.2 資料填寫 UX 原則

- 全程在 LINE 聊天界面內完成（Flex Message + Quick Reply）或跳轉 LIFF 表單頁（擇一實作）
- 每步驟完成後即時顯示進度確認
- 填完後立即推送歡迎卡（含血型靈數初始洞察）
- **不得在會員專區再次要求填寫任何 Step 1–3 的資料**

### 4.3 系統自動動作（填寫完成後）

```
1. 建立 profiles 記錄（findOrCreateMember）
2. 計算生命靈數（birth_date → numerology_number）
3. 呼叫 Claude API → 生成首頁洞察文案（血型 × 靈數）
4. 儲存洞察文案至 profiles.daily_insight（每日更新）
5. 啟動七日計畫計時器（seven_day_start_date = now()）
6. 推送「歡迎報告 Flex Message」含初始洞察
7. 推廣人 CP 計算（若有 promoter_id）
8. LINE Rich Menu 切換為「會員版 Rich Menu」（三入口）
```

---

## 五、LINE Rich Menu 三入口設計

### 5.1 設計規格

- **尺寸**：2500 × 1686 px（LINE 標準 Large Rich Menu）
- **格局**：三等分橫向排列
- **風格**：深森綠 #243A33 底，燕麥白文字，符合品牌視覺規範

### 5.2 三個入口定義

| 格子 | 入口名稱 | 副文字 | 動作 | LIFF 路由 |
|------|---------|-------|------|----------|
| 左 | 會員專區 | 打卡 · 報告 · 商城 | 開啟 LIFF | `/line/member-home` |
| 中 | My Dr. Marvin | 深度健康檢測 | 開啟 LIFF | `/line/assessment` |
| 右 | 最新活動 | 紅利 · 優惠 · 公告 | 開啟 LIFF | `/line/events` |

### 5.3 Rich Menu 版本切換

- **未加入版**（訪客）：顯示「加入會員」單一按鈕
- **已加入版**（會員）：顯示三入口版本
- 切換時機：Step 1–3 資料填寫完成後立即切換

---

## 六、會員專區首頁設計規格

### 6.1 頂部個人資訊區（常駐）

```
[ LINE 頭像 ]  Hi，{暱稱}
               {等級稱號} · {血型} · 靈數 {靈數數字} · 連續打卡 {N} 天
               LE {當前值} / {下一等級門檻}  [進度條]
```

### 6.2 血型 × 生命靈數洞察卡（每日更新）

- **資料來源**：血型（profiles.blood_type）× 生命靈數（系統計算自 birth_date）
- **生成方式**：呼叫 Claude API + 生命靈數典籍知識庫
- **更新頻率**：每日 00:00 批次更新，或首次進入時即時生成
- **格式**：
  ```
  今日植本洞察 · {血型}型 · 靈數 {N}              [左側陶土色標線]
  {2句個人特質描述}
  {1句今日能量建議，連結推薦飲品}
  ```
- **語氣規範**：溫柔肯定，不預測吉凶，不誇大，符合品牌「科學但不冰冷」原則

### 6.3 Dr. Marvin 引導提示卡（條件顯示）

**顯示條件**：會員尚未完成 My Dr. Marvin 深度檢測

```
✦ 尚未完成 My Dr. Marvin 深度檢測
完成 15 題即可解鎖：
· 五維健康報告  · 個人化植萃建議
· 生命能量 LE 首次 ×3 加成
[ 立即開始檢測 → ]
```

**完成後替換為**：健康分數儀表板 + 五維雷達圖概覽（縮略版）

### 6.4 八大功能區（2×4 格）

詳見第七章。排列順序固定（左到右、上到下）：

```
[ 今日打卡 ] [ 我的報告 ] [ My Dr.Marvin ] [ 植萃商城 ]
[ 任務中心 ] [ 我的帳戶 ] [  推薦好友  ] [ 最新活動 ]
```

---

## 七、八大會員功能規格

### 功能 01：今日打卡

**路由**：`/line/checkin`  
**核心功能**：
- 記錄今日飲用的植萃品項（選單選擇）
- 記錄今日心情（1–5 表情選擇）
- 記錄今日活力指數（1–5）
- 計算並顯示 LE 獎勵（連續天數加乘）
- 更新 streak_days · last_checkin_date · le_points

**LE 計算規則**：
- 基礎打卡：+10 LE
- 連續 3 天：×1.5
- 連續 7 天：×2
- 七日啟動計畫期間（前 7 天）：×3

---

### 功能 02：我的報告

**路由**：`/line/reports`  
**核心功能**：
- 列表顯示歷次 My Dr. Marvin 檢測記錄（日期 + 健康等級）
- 點擊查看完整報告（五維健康評估詳情）
- 健康趨勢圖（多次檢測後顯示折線圖）
- 官網快篩報告也整合顯示（標記「初篩」）

---

### 功能 03：My Dr. Marvin

**路由**：`/line/assessment`  
**詳細規格見第九章**

---

### 功能 04：植萃商城

**路由**：`/line/shop`  
**Phase 1 範圍**：
- 五色植萃產品列表（含機能說明）
- 導流至正式電商（外連）或簡易訂單表單
- P 點餘額顯示
- **Phase 2 開放**：完整購物車 · P 點折抵 · 訂閱制

---

### 功能 05：任務中心

**路由**：`/line/tasks`  
**核心任務類型**：

| 任務類型 | 觸發條件 | 獎勵 |
|---------|---------|------|
| 七日啟動計畫 | 新會員前 7 天 | 每日 LE ×3 + 完成徽章 |
| 每日打卡任務 | 每日重置 | +10 LE |
| 完成 Dr. Marvin | 首次檢測 | +100 LE + 解鎖報告 |
| 推薦首位好友 | 成功推薦 | +50 LE |
| 週任務 | 每週重置 | +30 LE |

---

### 功能 06：我的帳戶

**路由**：`/line/profile`  
**顯示內容**：
- 個人資料（暱稱 · 血型 · 靈數 · 等級 · 稱號）
- 三種點數餘額：P 點 / CP 點 / LE 值
- 會員等級進度條（L1→L2 晉升條件）
- 健康分數概覽（來自最近一次 Dr. Marvin 報告）
- 資料修改入口（飲食習慣 · 在意部位可更新）
- 推廣人資訊（若有：顯示推薦人名稱）

---

### 功能 07：推薦好友

**路由**：`/line/referral`  
**核心功能**：
- 顯示個人專屬推薦碼（格式：`P_MEMBER_{6碼}`）
- 一鍵複製推薦連結
- 分享至 LINE 朋友
- 推薦進度追蹤（已推薦 N 人 · 其中 M 人有消費）
- CP 回饋記錄明細

---

### 功能 08：最新活動

**路由**：`/line/events`  
**內容來源**：Admin 後台 announcements 資料表（標記 `audience=member`）  
**功能**：
- 會員專屬活動列表（紅利 · 優惠 · 限定公告）
- 推播通知觸發點（新活動上架時主動推送）
- 活動詳情頁 + CTA 按鈕
- 體驗包領取狀態追蹤（展覽來源會員）

---

## 八、Dr. Marvin AI 知識庫三支柱

Dr. Marvin 的所有 AI 輸出由三個知識庫驅動，均以結構化文件形式上傳至 Claude Project Knowledge，並在每次 API 呼叫時作為 System Prompt 的一部分傳入。

### 8.1 知識庫一：生命靈數典籍

**狀態**：待上傳（業主提供典籍全文）  
**處理方式**：Claude 讀取典籍後建立結構化矩陣

**輸出格式**（系統使用）：
```json
{
  "numerology": 7,
  "blood_type": "A",
  "core_traits": ["深度思考", "細節敏感", "直覺強"],
  "body_tendency": ["神經系統敏感", "消化偏弱"],
  "energy_cycle": "自我整理週期",
  "lucky_color": "#87A192",
  "daily_insight_template": "你天生擅長深度思考，對細節有高度敏感。靈數 7 的你正處於{週期}，今日適合{建議}。"
}
```

**組合矩陣**：靈數 1–9 × 血型 A/B/AB/O = 36 種基礎組合，每組合有獨立的特質描述與能量建議模板。

### 8.2 知識庫二：植物配方機能庫

**狀態**：待整理（業主提供配方說明）  
**結構**：

```json
{
  "product_id": "green",
  "name": "青檸植萃",
  "color": "翡翠綠",
  "key_ingredients": ["深綠蔬菜", "芭樂", "檸檬", "黑木耳"],
  "functions": ["腸道促排", "代謝支持", "高纖維"],
  "best_for": ["消化系統", "體態", "代謝偏低"],
  "body_types": ["消化偏弱", "體重管理需求", "外食族"],
  "contraindications": ["腸躁症急性期"],
  "east_west_basis": "東方：助消化理氣；西方：膳食纖維 + 維生素 C"
}
```

**推薦邏輯**：My Dr. Marvin 報告生成時，依五維評分最低維度 × 在意部位 × 體質傾向，對應推薦 1–2 款植萃飲品。

### 8.3 知識庫三：健康問卷題庫規範

**狀態**：由 Claude 依以下規範生成初稿，業主審核後定稿  
**詳細規格見第九章**

### 8.4 Claude API 呼叫架構

```javascript
// 所有 Dr. Marvin 相關 API 呼叫的基礎結構
const drMarvinSystemPrompt = `
你是 Dr. Marvin，植本邏輯的 AI 健康引導系統。
你的性格：溫柔但不軟弱，科學但不冰冷，高級但不疏離。
你絕不誇大醫療效果，不預測吉凶，不使用恐懼行銷。

[生命靈數知識庫]
{numerology_knowledge_base}

[植物配方機能庫]
{botanical_formula_database}

[輸出格式規範]
{output_format_spec}
`;

// 首頁洞察生成
const insightPrompt = `
會員資料：血型 {blood_type}，生命靈數 {numerology}，今日節氣 {solar_term}
任務：生成今日植本洞察，約 60 字，溫柔肯定，結尾連結推薦飲品。
輸出純文字，不含 markdown。
`;
```

---

## 九、My Dr. Marvin 深度檢測規格

### 9.1 設計原則

- **不重複**：已在加入時填寫的資料（暱稱、生日、血型、性別、飲食習慣、壓力指數、在意部位）一律從 `profiles` 直接讀取，不在問卷中再次詢問
- **動態狀態**：15 題全部問「當下感受」，非靜態個人資料
- **五大系統覆蓋**：每個系統至少 2–3 題

### 9.2 五大系統 × 15 題題庫框架

**系統一：睡眠 & 神經（3題）**
1. 這週入睡需要多久？（立即 / 15分 / 30分+ / 超過1小時）
2. 這週睡醒後的感覺？（精神飽滿 / 尚可 / 還是疲勞 / 完全沒睡飽）
3. 這週有沒有情緒起伏大、容易焦慮？（完全沒有 / 偶爾 / 常常 / 幾乎每天）

**系統二：消化 & 代謝（3題）**
4. 這週的消化狀況？（順暢 / 偶有脹氣 / 常常不適 / 排便不規律）
5. 這週飲食中外食比例？（幾乎自煮 / 一半 / 以外食為主 / 全外食）
6. 這週有沒有特別渴望甜食或油炸？（完全沒有 / 偶爾 / 常常 / 強烈渴望）

**系統三：肌肉 & 關節（2題）**
7. 這週身體有沒有特別痠痛的部位？（沒有 / 輕微 / 明顯 / 嚴重影響活動）
8. 這週的體力與運動表現？（良好 / 尚可 / 比平常差 / 明顯下降）

**系統四：皮膚 & 循環（2題）**
9. 這週皮膚狀態？（明亮有光澤 / 正常 / 偶有暗沉 / 明顯暗沉或出油）
10. 這週有沒有水腫感（手腳臉）？（完全沒有 / 偶爾 / 常常 / 每天）

**系統五：能量 & 免疫（3題）**
11. 這週的整體精神狀態？（充沛 / 還好 / 容易疲勞 / 嚴重疲勞）
12. 最近有沒有比較容易感冒或過敏？（完全沒有 / 輕微 / 明顯 / 頻繁）
13. 這週喝水量足夠嗎？（超過 2L / 約 1.5L / 不到 1L / 幾乎不喝水）

**綜合感受（2題）**
14. 這週最困擾你的身體症狀是？（開放式選擇，含「目前沒有特別困擾」選項）
15. 如果用 1–10 分評估這週的整體健康感受，你給幾分？（滑桿）

### 9.3 報告生成規格

**五維評分系統**：
- 睡眠指數（0–100）
- 消化指數（0–100）
- 能量指數（0–100）
- 肌骨指數（0–100）
- 循環指數（0–100）

**綜合健康分數**：五維加權平均（寫入 `profiles.health_score`）

**報告輸出結構**：
```
1. 健康等級 & 總分
2. 五維雷達圖數據
3. 最需要關注的 1–2 個維度（詳細說明）
4. 個人化植萃飲品推薦（1主 1副）
5. 今日/本週生活調整建議（3條，具體可行）
6. 生命能量洞察（結合靈數）
```

---

## 十、資料庫 Schema 更新規格

### 10.1 profiles 資料表新增欄位

```sql
ALTER TABLE public.profiles
  -- 基本會員資料
  ADD COLUMN IF NOT EXISTS nickname TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS blood_type TEXT CHECK (blood_type IN ('A','B','AB','O')),
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male','female','other')),
  ADD COLUMN IF NOT EXISTS numerology_number INTEGER CHECK (numerology_number BETWEEN 1 AND 9),
  
  -- 健康偏好
  ADD COLUMN IF NOT EXISTS diet_type TEXT,
  ADD COLUMN IF NOT EXISTS stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS health_concerns TEXT[],
  
  -- 推廣人追蹤
  ADD COLUMN IF NOT EXISTS promoter_id TEXT,
  ADD COLUMN IF NOT EXISTS promoter_type TEXT,
  ADD COLUMN IF NOT EXISTS referral_source TEXT,
  ADD COLUMN IF NOT EXISTS event_id TEXT,
  
  -- AI 生成內容
  ADD COLUMN IF NOT EXISTS daily_insight TEXT,
  ADD COLUMN IF NOT EXISTS daily_insight_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recommended_product_id TEXT,
  
  -- 七日啟動計畫
  ADD COLUMN IF NOT EXISTS seven_day_start_date DATE,
  ADD COLUMN IF NOT EXISTS registration_completed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS profiles_promoter_id_idx ON public.profiles (promoter_id);
CREATE INDEX IF NOT EXISTS profiles_referral_source_idx ON public.profiles (referral_source);
```

### 10.2 promoters 推廣人資料表（新建）

```sql
CREATE TABLE IF NOT EXISTS public.promoters (
  id TEXT PRIMARY KEY,                      -- P_STORE_KH01
  type TEXT NOT NULL,                       -- store / partner / member / kol / event
  name TEXT NOT NULL,                       -- 顯示名稱
  region TEXT,                              -- 地區
  contact TEXT,                             -- 聯絡方式
  line_url TEXT,                            -- 專屬加入連結
  qr_code_url TEXT,                         -- QR Code 圖片 URL
  cp_per_referral INTEGER DEFAULT 0,        -- 每推薦1人獲得的CP
  cp_per_first_purchase INTEGER DEFAULT 0, -- 被推薦人首購後額外CP
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);
```

### 10.3 dr_marvin_reports 報告資料表（新建）

```sql
CREATE TABLE IF NOT EXISTS public.dr_marvin_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id),
  report_type TEXT DEFAULT 'deep',          -- 'quick'(官網5題) / 'deep'(會員15題)
  answers JSONB NOT NULL,                   -- 完整問卷答案
  scores JSONB NOT NULL,                    -- 五維評分
  health_score INTEGER,                     -- 綜合健康分數
  recommended_product_id TEXT,
  report_content TEXT,                      -- AI 生成完整報告文字
  le_awarded INTEGER DEFAULT 0,            -- 此次檢測獲得的LE
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dr_marvin_reports_profile_id_idx ON public.dr_marvin_reports (profile_id);
```

### 10.4 daily_checkins 資料表修正

```sql
-- 修正 FK，統一指向 profiles(id)
ALTER TABLE public.daily_checkins
  DROP CONSTRAINT IF EXISTS daily_checkins_member_id_fkey;
ALTER TABLE public.daily_checkins
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS product_consumed TEXT,
  ADD COLUMN IF NOT EXISTS mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS energy_score INTEGER CHECK (energy_score BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS le_awarded INTEGER DEFAULT 10;
```

---

## 十一、Admin 後台新增功能規格

### 11.1 推廣人管理模組

**路由**：`/admin/promoters`

功能清單：
- 新增 / 編輯 / 停用推廣人
- 自動生成專屬 LINE 連結與 QR Code
- 推廣績效總覽表（推薦人數 · 消費人數 · CP 待發）
- 依時間區間篩選
- 單一推廣人詳細報表
- 批量 CP 結算 + P 點發放操作
- 匯出 CSV 結算報表

### 11.2 活動管理模組更新

在現有 announcements 管理中新增：
- `audience` 欄位：`all`（官網） / `member`（會員專屬） / `event_{id}`（特定活動）
- `event_id` 關聯欄位：可連結特定展覽場次
- 體驗包核銷功能：查看 `event_id` 下的所有會員，標記已發放

### 11.3 會員管理模組更新

在現有會員管理中新增：
- 依 `promoter_id` 篩選會員
- 顯示 `referral_source` · `event_id`
- 健康分數概覽
- Dr. Marvin 報告查閱權限
- 手動調整點數（需輸入原因）

---

## 十二、技術堆疊與環境變數

### 12.1 技術堆疊（無變更）

| 技術 | 版本 | 用途 |
|------|------|------|
| React + Vite | latest | 前端框架 |
| Tailwind CSS | ^3.4.17 | 樣式 |
| Supabase JS | ^2.105.4 | 資料庫 + Auth |
| LINE LIFF SDK | ^2.29.0 | LINE 整合 |
| Framer Motion | latest | 動畫 |
| Anthropic API | fetch | Claude AI 呼叫 |
| Vercel Serverless | api/*.js | 後端 API |

### 12.2 新增環境變數

```env
# 現有（保留）
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
VITE_LINE_LIFF_ID=
ADMIN_PASSCODE=

# 新增
VITE_LINE_OA_REF_BASE_URL=https://line.me/R/ti/p/@phytologic
DR_MARVIN_SYSTEM_PROMPT_VERSION=v2
DAILY_INSIGHT_CRON_SECRET=    # 每日洞察批次更新用
```

### 12.3 新增 API 路由

```
POST /api/dr-marvin/insight      # 生成血型×靈數首頁洞察
POST /api/dr-marvin/analyze      # 處理15題問卷，生成深度報告
POST /api/promoter/track         # 記錄推廣人來源（加入時呼叫）
GET  /api/promoter/stats         # Admin 推廣人績效查詢
POST /api/promoter/award-cp      # 批量發放CP（Admin操作）
POST /api/checkin                # 每日打卡記錄
GET  /api/member/home            # 首頁所需資料彙總
```

---

## 十三、開發優先順序與任務清單

### Phase 0：技術債修復（立即，1週內）

- [ ] `daily_checkins.member_id` FK 改指向 `profiles(id)`
- [ ] `daily_ai_messages` FK 統一
- [ ] `profiles` 新增欄位 Migration 執行
- [ ] 新建 `promoters` 資料表
- [ ] 新建 `dr_marvin_reports` 資料表
- [ ] Supabase service role key rotate
- [ ] `.env.example` 更新

### Phase 1A：會員建立流程（第1–2週）

- [ ] LINE Webhook：識別 `ref` / `src` / `evt` 參數並寫入 profiles
- [ ] Step 1–3 資料填寫 Flex Message 流程
- [ ] `findOrCreateMember` 邏輯完整實作
- [ ] 生命靈數計算函數（birth_date → numerology_number）
- [ ] Rich Menu 版本切換（訪客版 → 會員版）
- [ ] 歡迎 Flex Message 依來源客製化

### Phase 1B：首頁與 AI 洞察（第2–3週）

- [ ] Claude API 知識庫整合（上傳典籍後）
- [ ] `/api/dr-marvin/insight` 洞察生成 API
- [ ] `/line/member-home` LIFF 首頁頁面實作
- [ ] 血型靈數洞察卡 UI 元件
- [ ] Dr. Marvin 引導提示卡（含 LE ×3 誘因）
- [ ] 八大功能格 UI（路由框架）

### Phase 1C：核心功能實作（第3–5週）

- [ ] 今日打卡（`/line/checkin`）完整實作
- [ ] My Dr. Marvin 15題問卷（`/line/assessment`）
- [ ] `/api/dr-marvin/analyze` 報告生成 API
- [ ] 我的報告（`/line/reports`）
- [ ] 我的帳戶（`/line/profile`）
- [ ] 七日啟動計畫計時與獎勵邏輯

### Phase 1D：推廣人系統（第3–4週，可平行）

- [ ] Admin 推廣人管理模組
- [ ] QR Code 生成功能
- [ ] 推廣績效報表
- [ ] CP 結算操作介面

### Phase 2：留存功能（第6–10週）

- [ ] 任務中心（`/line/tasks`）
- [ ] 推薦好友（`/line/referral`）
- [ ] 最新活動（`/line/events`）
- [ ] 植萃商城（`/line/shop`）完整購物流程
- [ ] P 點折抵機制
- [ ] 好友系統

---

## 十四、給 Codex 的實作指引

### 14.1 開發前必讀

1. 本規格書（PHYTOLOGIC_DIGITAL_SPEC_V2_0.md）**全文**
2. `MEMBER_SYSTEM_SPEC_V1_0.md`（技術現況）
3. `brand_guidelines.md`（視覺規範）
4. `PROJECT_HANDOFF.md`（部署規格）

### 14.2 絕對不能做的事

- 不得另設 LIFF 以外的會員入口網頁
- 不得在會員專區重複詢問已填寫的 Step 1–3 資料
- 不得讓 `SUPABASE_SERVICE_ROLE_KEY` 出現在前端任何檔案
- 不得修改 `vercel.json` 的路由設定而不同步更新本文件
- Rich Menu 不得超過三個入口
- 推廣人追蹤中不得允許自我推薦

### 14.3 命名規範

```javascript
// 推廣人識別碼
const PROMOTER_ID_FORMAT = 'P_{TYPE}_{REGION}{NUMBER}';
// 例：P_STORE_KH01, P_PARTNER_GYM01, P_MEMBER_A1B2C3

// referral_source 值
const REFERRAL_SOURCES = [
  'website', 'event_{year}_{city}_{seq}',
  'store_{city}_{code}', 'referral',
  'ig_ad', 'fb_ad', 'kol_{handle}'
];

// Dr. Marvin 報告 report_type
const REPORT_TYPES = ['quick', 'deep'];
// quick = 官網5題, deep = 會員15題
```

### 14.4 品牌視覺 Token（UI 實作必用）

```css
:root {
  --bg:       #F0EBE0;  /* 燕麥白，主體背景 */
  --paper:    #F7F4EE;  /* 紙白，卡片底色 */
  --forest:   #243A33;  /* 深森綠，主視覺 */
  --sage:     #87A192;  /* 霧鼠尾，輔助元素 */
  --ink:      #1F1D17;  /* 墨，主文字 */
  --clay:     #C28465;  /* 陶土赭，點綴 CTA */
  --amber:    #D8B07A;  /* 琥珀，暖意 */
  --line-green: #06C755; /* LINE 官方綠 */
}
```

### 14.5 每個新功能開發前的 Checklist

```
□ 確認 Phase 歸屬，Phase 0 問題未修復前不得跳到 Phase 1
□ 確認對應資料表與欄位已建立（Migration 已執行）
□ 確認 RLS policy 已設定
□ 確認 service role key 只在 api/*.js 使用
□ 確認 UI 使用品牌色彩 Token
□ 確認不重複收集已有的會員資料
□ 確認推廣人追蹤欄位正確寫入
```

---

## 版本記錄

| 版本 | 日期 | 更新內容 |
|------|------|---------|
| V1.0 | 2026-05-24 | MEMBER_SYSTEM_SPEC_V1_0.md 初版 |
| V2.0 | 2026-05-24 | 整合本次設計討論：三層架構確立、多元入口系統、推廣人追蹤、Rich Menu 三入口、首頁八大功能、Dr. Marvin 知識庫三支柱、My Dr. Marvin 15題規格、完整 Schema 更新、開發優先順序 |

---

> **給未來 Claude / Codex 讀者的說明**  
> 這份文件是植本邏輯數位生態系第一階段的唯一真相規格。  
> 所有設計決策均來自業主與 Claude 的完整討論，有其商業邏輯與用戶體驗依據。  
> 修改任何規格前，請先理解其背後的設計原因，不要因技術便利而破壞生態系的完整性。  
> **少，但剛好。簡，但完整。慢，但持久。**
