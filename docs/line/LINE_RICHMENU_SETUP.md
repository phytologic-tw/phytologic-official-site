# LINE Rich Menu 按鈕 URL 設定指南

## 問題根因

Rich Menu 六個按鈕如果全部導向同一個官網 URL，使用者點任何按鈕都會回到官網，而不是進入對應的 LIFF 會員頁。

## 正確設定

在 LINE Developers Console -> Messaging API -> Rich menu，將每個按鈕 action 設為 URI：

| 按鈕 | Action Type | URI |
|------|-------------|-----|
| 今日 | URI | `https://liff.line.me/{LIFF_ID}/line/today` |
| 分析 | URI | `https://liff.line.me/{LIFF_ID}/line/analysis` |
| 飲用 | URI | `https://liff.line.me/{LIFF_ID}/line/checkin` |
| 我的 | URI | `https://liff.line.me/{LIFF_ID}/line/profile` |
| 任務 | URI | `https://liff.line.me/{LIFF_ID}/line/tasks` |
| 商城 | URI | `https://liff.line.me/{LIFF_ID}/line/shop` |

## LIFF_ID 位置

LINE Developers Console -> Provider -> Channel -> LIFF 頁籤 -> 選擇 LIFF App -> 複製 LIFF ID。

## LIFF Endpoint URL

LIFF App 的 Endpoint URL 必須設為：

```text
https://www.phytologic.tw/line/entry
```

所有 `/line/*` 子路徑都由前端 router 處理。

## 備註

Rich Menu 建議直接使用 URI action。若改用 postback action，Webhook 需要另外處理 postback 並回覆對應 LIFF URL。
