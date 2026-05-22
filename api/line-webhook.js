// api/line-webhook.js
// LINE Messaging API Webhook
// 功能：接收使用者訊息、查詢報告編號、回傳完整分析

import crypto from "crypto";

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 驗證 LINE Webhook 簽章
function verifySignature(body, signature) {
  if (!CHANNEL_SECRET) return true; // dev mode
  const hash = crypto
    .createHmac("SHA256", CHANNEL_SECRET)
    .update(body)
    .digest("base64");
  return hash === signature;
}

// 呼叫 Supabase REST API（不用 SDK，避免 edge runtime 問題）
async function supabaseQuery(table, query) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

// 傳送 LINE 回覆訊息
async function replyMessage(replyToken, messages) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

// 格式化完整健康報告訊息
function formatReport(report) {
  const level = report.level || "未知";
  const score = report.total_score || 0;
  const products = (report.recommended_products || []).join("、");
  const analysis = report.ai_analysis
    ? report.ai_analysis.slice(0, 300) + (report.ai_analysis.length > 300 ? "..." : "")
    : "分析資料尚未產生";

  return [
    {
      type: "text",
      text: `🌿 派森健康分析報告\n\n` +
        `📊 發炎指數：${score} 分\n` +
        `⚡ 健康等級：${level}\n\n` +
        `💊 推薦飲品：${products || "請完成完整問卷"}\n\n` +
        `📝 個人分析：\n${analysis}\n\n` +
        `—\n植本邏輯 PHYTOLOGIC\nphytologic.tw`,
    },
  ];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 驗證簽章
  const signature = req.headers["x-line-signature"];
  const body = JSON.stringify(req.body);
  if (!verifySignature(body, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const events = req.body.events || [];

  for (const event of events) {
    if (event.type !== "message" || event.message.type !== "text") continue;

    const userMessage = event.message.text.trim();
    const replyToken = event.replyToken;

    // 使用者輸入報告編號（8碼英數字）
    if (/^[A-Z0-9]{8}$/i.test(userMessage)) {
      try {
        const reports = await supabaseQuery(
          "assessment_reports",
          `short_code=eq.${userMessage.toUpperCase()}&select=*&limit=1`
        );

        if (reports.length === 0) {
          await replyMessage(replyToken, [
            { type: "text", text: `找不到編號「${userMessage.toUpperCase()}」的報告。\n\n請確認編號是否正確，或前往官網重新進行派森分析：\nhttps://phytologic.tw` },
          ]);
        } else {
          const report = reports[0];
          // 標記已透過 LINE 發送
          await fetch(`${SUPABASE_URL}/rest/v1/assessment_reports?id=eq.${report.id}`, {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              line_user_id: event.source.userId,
              line_sent_at: new Date().toISOString(),
            }),
          });

          await replyMessage(replyToken, formatReport(report));
        }
      } catch (err) {
        console.error("[webhook] 查詢報告失敗:", err);
        await replyMessage(replyToken, [
          { type: "text", text: "系統暫時無法查詢，請稍後再試。" },
        ]);
      }
      continue;
    }

    // 關鍵字回覆
    if (userMessage.includes("報告") || userMessage.includes("結果")) {
      await replyMessage(replyToken, [
        { type: "text", text: "請輸入您的 8 碼報告編號（例如：AB12CD34），即可查詢完整健康分析。\n\n還沒做過分析？\nhttps://phytologic.tw" },
      ]);
      continue;
    }

    if (userMessage.includes("飲品") || userMessage.includes("推薦")) {
      await replyMessage(replyToken, [
        { type: "text", text: "🌿 植本邏輯五款植萃飲品\n\n⬜ 雪山植萃 — 抗發炎修復\n💚 青檸植萃 — 代謝促排\n🌹 玫瑰植萃 — 女性保養\n💛 桂香植萃 — 運動增肌\n💜 紫莓植萃 — 護眼抗氧化\n\n想了解哪一款適合你？\nhttps://phytologic.tw" },
      ]);
      continue;
    }

    // 預設回覆
    await replyMessage(replyToken, [
      {
        type: "text",
        text: "嗨！我是植本邏輯的健康助理 🌿\n\n您可以：\n• 輸入 8 碼報告編號查詢健康分析\n• 輸入「推薦」了解各款飲品\n• 前往官網進行派森分析\n\nhttps://phytologic.tw",
      },
    ]);
  }

  return res.status(200).json({ status: "ok" });
}
