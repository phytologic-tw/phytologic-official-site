# LINE 會員與完整報告流程

更新日期：2026-05-20

## 目前狀態

目前網站已完成 LINE 官方帳號導流與報告解鎖入口，但尚未實作 LINE Messaging API、LIFF 或 LINE Login。

現有 LINE 元件：

- `src/components/line/lineConfig.js`
- `src/components/line/FloatingLineButton.jsx`
- `src/components/line/LineQRCode.jsx`
- `src/components/line/LineCTA.jsx`
- `src/components/line/UnlockFullReportCard.jsx`

目前預設 LINE URL：

- `https://lin.ee/YpVA4C8`

可用環境變數覆蓋：

- `VITE_LINE_OA_URL`
- `VITE_LINE_OFFICIAL_URL`
- `VITE_LINE_CTA_URL`

QR Code 圖檔：

- `public/line-qrcode.png`
- `public/line-qrcode-small.png`
- `public/line-qrcode-medium.png`
- `public/line-qrcode-large.png`

## 現行使用者流程

1. 使用者在網站完成 Dr.Marvin 生理狀態快篩。
2. 前端產生簡易 AI 分析、產品推薦與生活建議。
3. 系統嘗試將報告寫入 `assessment_reports`。
4. 使用者看到報告編號與 LINE CTA。
5. 使用者點擊或掃描 QR Code 加入官方 LINE。

目前 `hasJoinedLine` 在前端為固定 false，完整報告區塊以解鎖入口呈現，尚未與 LINE 帳號狀態串接。

## Phase 1：報告編號導流

目標：

- 使用者完成快篩後取得報告編號。
- 使用者加入 LINE 後，可用報告編號取得完整分析。

待辦：

- 確認正式 LINE OA URL。
- 設計 LINE 內輸入報告編號的文案。
- 建立查詢 `assessment_reports` 的後端端點或 webhook。
- 格式化完整報告回傳內容。

## Phase 2：LINE Messaging API

目標：

- 官方 LINE 接收使用者訊息。
- 使用者輸入報告編號後，系統查詢 `assessment_reports`。
- 回傳完整報告摘要、產品建議與下一步引導。

預計需要：

- LINE Channel Access Token
- LINE Channel Secret
- `api/line-webhook.js`
- report id 驗證與查詢邏輯
- 防止任意讀取他人報告的保護機制

## Phase 3：LIFF / LINE Login

目標：

- 將 LINE userId 與快篩報告綁定。
- 使用者加入 LINE 或登入後自動取得自己的完整報告。
- 為會員、顧問服務與後續追蹤建立資料基礎。

預計 schema：

- `assessment_reports.line_user_id`
- `assessment_reports.line_sent_at`
- `line_members`

## 風險與注意事項

- 報告屬於健康相關個人資料，不應公開查詢。
- report id 需要避免過短或容易猜測。
- Webhook 需驗證 LINE signature。
- 完整報告文案需避免醫療診斷與療效宣稱。
- LINE Login、會員資料與行銷訊息需注意使用者同意。

