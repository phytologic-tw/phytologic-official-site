# 植本邏輯 PHYTOLOGIC｜最新開發進度

更新日期：2026-05-25  
專案路徑：`/Users/mangtonglee/Documents/Claude/Projects/phytologic-core/01.植本邏輯/phytologic-website`  
正式站台：`https://www.phytologic.tw`  
GitHub：`phytologic-tw/phytologic-official-site`  
目前分支：`main`

---

## 一、目前部署狀態

- GitHub main 已推送最新版本。
- Vercel production 已可正常回應。
- `GET https://www.phytologic.tw/api/line-webhook` 回 200。
- `POST https://www.phytologic.tw/api/promoter?action=track` 已回 200。
- Vercel Hobby plan Serverless Function 上限問題已排除。

目前 production health check 顯示：

```json
{
  "status": "ok",
  "supabaseUrlConfigured": true,
  "supabaseKeyType": "legacy-jwt",
  "supabaseJwtRole": "service_role",
  "lineSecretConfigured": true,
  "lineTokenConfigured": true,
  "memberRichMenuConfigured": false
}
```

`memberRichMenuConfigured:false` 代表 Vercel 尚未設定 `LINE_MEMBER_RICH_MENU_ID`。目前三入口 Rich Menu 已設定為 default，因此會員仍可使用；若未來要做「訪客版 / 會員版」切換，再補此 env。

---

## 二、最新 Commit 紀錄

| Commit | 內容 |
|---|---|
| `8b8f668` | Expand LINE webhook member actions |
| `de906c2` | Consolidate promoter API for Vercel Hobby limit |
| `c7e5f5e` | Enable LINE shop entry |
| `c62ecac` | Add Dr Marvin daily insight API |
| `18b72e4` | Add admin promoter management |
| `ebc6a13` | Add LINE referral page |
| `ec738e3` | Expand LINE task center |
| `8d4872b` | Refresh LINE profile account page |
| `08b2ffb` | Improve LINE webhook welcome flow |
| `031fc8e` | Add LINE rich menu three-entry foundation |
| `b8d7279` | Implement phase 1 member home and checkin foundation |
| `503571f` | Add Dr Marvin assessment and reports |

---

## 三、已完成並部署

### 1. Supabase Phase 1 Migration

已在 Supabase SQL Editor 執行成功：

```txt
supabase/phase1_migration.sql
```

已新增或修正：

- `profiles` 會員欄位
- `promoters`
- `dr_marvin_reports`
- `daily_checkins` FK / 欄位
- `daily_ai_messages` 相容欄位
- `joined_at`
- service role policies

### 2. 會員建檔與推廣來源

已完成：

- `api/_member-utils.js`
- `api/line-member.js`
- `api/promoter.js`

支援參數：

- `ref`
- `src`
- `evt`

寫入欄位：

- `promoter_id`
- `promoter_type`
- `referral_source`
- `event_id`
- `joined_at`
- `birth_date` / `birthdate`
- `gender`
- `health_concerns`
- `registration_completed_at`
- `seven_day_start_date`

### 3. LINE Rich Menu 三入口

已完成：

- `api/line-setup.js`
- `public/phytologic_richmenu_v5.png`
- `public/phytologic_richmenu_v5.svg`

三入口：

| 入口 | 路由 |
|---|---|
| 會員專區 | `/line/member-home` |
| My Dr. Marvin | `/line/assessment` |
| 最新活動 | `/line/events` |

production 已執行：

```txt
POST https://www.phytologic.tw/api/line-setup
```

LINE 回傳成功：

```txt
richmenu-77571d6e5c8caf6bf9292bb1f708ffd9
```

### 4. LINE Webhook 與 Welcome Flow

已完成：

- `follow` 事件建立或讀取 `profiles`
- 依來源產生歡迎 Flex Message
- 文字關鍵字回覆
- 會員選單 Flex Message
- postback action 統一處理
- LIFF 八大功能入口回覆
- 預留會員版 Rich Menu link：`LINE_MEMBER_RICH_MENU_ID`

目前支援 postback action：

```txt
member_home
assessment
events
checkin
reports
tasks
profile
referral
shop
member_menu
help
my_report
profile_complete
```

目前支援文字關鍵字入口：

- 會員 / 建檔 / 加入會員
- 打卡
- 任務 / 七日 / 獎勵
- 活動 / 優惠 / 公告
- 推薦好友 / 推薦碼 / 分享
- 帳戶 / 個人資料 / 點數 / LE / CP
- 商城 / 購買 / 訂購
- 檢測 / Marvin / 深度 / 問卷
- 報告 / 結果
- 飲品 / 推薦

### 5. 會員首頁

已完成：

- `/line/member-home`
- `src/pages/line/LineMemberHomePage.jsx`
- `api/member/home.js`

包含：

- 會員資訊
- LE / CP / 健康分
- 今日洞察 fallback
- My Dr. Marvin 引導
- 八大功能入口
- 今日洞察自動呼叫 `/api/dr-marvin/insight`

### 6. 今日打卡

已完成：

- `api/checkin.js`
- `src/lib/memberProfile.js` 的 `doCheckin()`
- `src/pages/line/LineCheckinPage.jsx`

打卡支援：

- 飲品選擇
- 心情 1-5
- 活力 1-5
- 今日感受
- 備註

後端更新：

- `daily_checkins`
- `profiles.le_points`
- `profiles.health_score`
- `profiles.streak_days`
- `profiles.last_checkin_date`
- `profiles.total_checkins`

LE 規則：

- 基礎 `+10`
- 連續 3 天 `x1.5`
- 連續 7 天 `x2`
- 七日啟動計畫期間 `x3`

production 測試結果：

```json
{
  "success": true,
  "leAwarded": 30,
  "multiplier": 3,
  "multiplierReason": "seven_day_start",
  "streakDays": 1
}
```

測試會員：

```txt
Utestcodex20260524082617
```

### 7. My Dr. Marvin 深度檢測

已完成：

- `api/dr-marvin/analyze.js`
- `src/pages/line/LineAssessmentPage.jsx`
- `/line/assessment`

完成後會：

- 寫入 `dr_marvin_reports`
- 更新 `profiles.health_score`
- 更新 `profiles.recommended_product`
- 更新 `profiles.last_report_id`
- 獎勵 `+100 LE`

production 測試結果：

```txt
report id: 110f698c-5ace-4969-8116-8f96225c9cc3
health_score: 66
recommended_product: 桂香植萃
reward: +100 LE
```

### 8. 我的報告

已完成：

- `api/member/reports.js`
- `src/pages/line/LineReportsPage.jsx`
- `/line/reports`

可顯示：

- 最新 Dr. Marvin 報告
- 五維健康分數
- 報告內容
- 歷史紀錄
- 官網初篩 `quick_reports`

production 測試結果：

```txt
reportsCount: 1
```

### 9. 我的帳戶

已完成：

- `src/pages/line/LineProfilePage.jsx`
- `/line/profile`

包含：

- 會員身份
- LE / CP / P
- 健康狀態
- 會員資料欄位
- 推廣來源與活動來源
- 前往活動 / 推薦好友入口

### 10. 任務中心

已完成：

- `src/pages/line/LineTasksPage.jsx`
- `/line/tasks`

包含：

- 七日啟動計畫
- 每日任務
- 每週任務
- 任務完成狀態
- LE / CP 獎勵展示
- badge / streak 資訊

### 11. 推薦好友

已完成：

- `src/pages/line/LineReferralPage.jsx`
- `/line/referral`
- Phase 1.5 推薦 CP 防濫用基礎

包含：

- 會員推薦碼
- LINE 分享連結
- 複製推薦連結
- 推薦規則與狀態資訊
- `supabase/phase1_5_referral_rewards.sql` 建立 `referral_reward_logs`
- `api/line-member.js` 在會員完成建檔時自動檢查推薦來源
- 自動阻擋自推、避免同一被推薦會員重複領獎
- `P_MEMBER_` 推薦完成建檔後自動發放 CP；活動 / 門市 / 合作來源會進入待人工處理紀錄

### 12. 最新活動

已完成：

- `src/pages/line/LineEventsPage.jsx`
- `/line/events`

已接入 Rich Menu 第三入口。

### 13. 植萃商城入口

已完成：

- `src/pages/line/LineShopPage.jsx`
- `/line/shop`
- `api/member/home.js` 中 `shop` 狀態已由 `preview` 改為 `ready`

目前是商城入口與導購頁，完整購物流程仍屬後續階段。

### 14. Admin 推廣人管理

已完成：

- `src/components/admin/AdminDashboard.jsx`
- `api/promoter.js`

功能包含：

- 推廣人列表
- 新增 / 編輯 / 刪除推廣人
- 啟用 / 停用
- 推廣人統計
- CP 結算
- 自動產生 LINE 推廣連結

為了符合 Vercel Hobby plan 上限，已將原本多個 promoter route 合併成：

```txt
/api/promoter?action=manage
/api/promoter?action=stats
/api/promoter?action=award-cp
/api/promoter?action=track
```

### 15. Dr. Marvin 今日洞察 API

已完成：

- `api/dr-marvin/insight.js`
- `api/member/home.js` 新增 `daily_insight_generated`
- `LineMemberHomePage.jsx` 首次進入時會呼叫 `/api/dr-marvin/insight`

若 Claude API 無法使用，前端仍保留 fallback 洞察。

---

## 四、Vercel Hobby Function 上限修正

問題：

```txt
No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan.
```

修正方式：

- 將 `api/promoter/manage.js`
- `api/promoter/stats.js`
- `api/promoter/award-cp.js`
- `api/promoter/track.js`
- `api/promoter/_admin.js`

合併為：

```txt
api/promoter.js
```

並將 helper：

```txt
api/prompts.js
```

改名為：

```txt
api/_prompts.js
```

目前 `api` 底下實際 route handler 維持在 Hobby plan 可部署範圍內。

---

## 五、目前仍未完成

### LINE / LIFF

- 訪客版 Rich Menu 尚未建立。
- 會員版 Rich Menu 自動 link 需設定 `LINE_MEMBER_RICH_MENU_ID`。
- LINE webhook 尚未做真正 AI 對話。
- follow welcome Flex Message 已依來源分類，但 LINE 加入 URL 的 `ref/src/evt` 是否能穩定由 LINE 傳回仍需實機驗證。
- `profile_complete` postback 已保留，但 LIFF 建檔完成後是否觸發 postback 仍需串接。

### 會員功能

- `/line/shop` 仍是入口頁，尚未有完整購物車、訂單、P 點折抵、冷鏈物流流程。
- 任務中心已補 Phase 1.5 領獎基礎：`supabase/phase1_5_task_claims.sql`、`api/member/home.js` POST 領獎、`/line/tasks` 顯示可領取 / 已領取狀態。Production 需先執行 SQL migration 後才能正式領獎。
- 推薦好友已補建檔完成後的 CP 防濫用與 log；production 需先執行 `supabase/phase1_5_referral_rewards.sql`，再做實機推薦流程驗收。首購轉換與 CSV 結算仍屬後續升級。

### Admin

- 推廣人管理已完成 MVP。
- 尚未做 CSV 匯出。
- 尚未做日期區間篩選。
- 尚未串消費 / 首購資料。

### AI

- `/api/dr-marvin/insight` 已完成。
- Dr. Marvin LINE 聊天頻道 AI 問答尚未完成。
- RAG / pgvector / prompt version log 尚未完成。

### 安全與環境

- `SUPABASE_SERVICE_ROLE_KEY` 曾在對話中曝光，建議後續 rotate，並更新 Vercel production env。
- `LINE_MEMBER_RICH_MENU_ID` 尚未設定。

---

## 六、目前本機 Git 狀態注意事項

本機仍有既有未追蹤項目，依 Bryan 指示不要隨意加入：

```txt
backups/
phytologic_richmenu_v4.png
會員系統第七版本純文字版.txt
```

目前不應 `git add .`。

---

## 七、下一步建議順序

1. 補 `LINE_MEMBER_RICH_MENU_ID` 到 Vercel env，或先決定是否需要訪客版 / 會員版 Rich Menu 切換。
2. 將 `supabase/phase1_5_task_claims.sql` 與 `supabase/phase1_5_referral_rewards.sql` 套用到 Supabase production，實測任務領獎與推薦 CP。
3. 實機測試 LINE follow / keyword / postback / Rich Menu 三入口。
4. 完整化 `/line/shop` 購物流程。
5. 任務系統升級為完整模板 / 週期重置 / 後台設定。
6. 推薦好友成效追蹤升級：日期區間、首購轉換、CSV 結算報表。
7. Admin 推廣統計加日期區間、CSV 匯出、消費追蹤。
8. Dr. Marvin LINE AI 問答。

---

## 八、驗證紀錄

已執行：

```bash
npm run build
```

結果：

```txt
✓ built
```

production 已驗證：

```bash
curl -i https://www.phytologic.tw/api/line-webhook
curl -i -X POST "https://www.phytologic.tw/api/promoter?action=track"
```

結果：

- `/api/line-webhook` 回 200
- `/api/promoter?action=track` POST 回 200
