// api/line-webhook.js
// LINE Messaging API Webhook
// 功能：接收使用者訊息、查詢報告編號、回傳完整分析

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY;
const REPORT_SELECT = "id, inflammation_level, total_score, recommended_products, ai_analysis";
const REPORT_SELECT_WITH_SHORT_CODE = `${REPORT_SELECT}, short_code`;

let supabaseAdmin;

export const config = {
  api: {
    bodyParser: false,
  },
};

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase server configuration.");
  }

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabaseAdmin;
}

function getKeyType(key) {
  if (!key) return "missing";
  if (key.startsWith("eyJ")) return "legacy-jwt";
  if (key.startsWith("sb_secret_")) return "secret";
  return "unknown";
}

function readRawBody(req) {
  if (typeof req.body === "string") return Promise.resolve(req.body);
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body.toString("utf8"));
  if (req.body && typeof req.body === "object") return Promise.resolve(JSON.stringify(req.body));

  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function getUuidRangeFromShortCode(shortCode) {
  if (!/^[0-9A-F]{8}$/i.test(shortCode)) return null;

  const lowerPrefix = shortCode.toLowerCase();
  const nextPrefixNumber = Number.parseInt(lowerPrefix, 16) + 1;
  const lower = `${lowerPrefix}-0000-0000-0000-000000000000`;

  if (nextPrefixNumber > 0xffffffff) {
    return {
      lower,
      upper: "ffffffff-ffff-ffff-ffff-ffffffffffff",
      upperInclusive: true,
    };
  }

  const upperPrefix = nextPrefixNumber.toString(16).padStart(8, "0");
  return {
    lower,
    upper: `${upperPrefix}-0000-0000-0000-000000000000`,
    upperInclusive: false,
  };
}

async function findReportByCode(supabase, shortCode) {
  const { data: shortCodeReport, error: shortCodeError } = await supabase
    .from("assessment_reports")
    .select(REPORT_SELECT_WITH_SHORT_CODE)
    .eq("short_code", shortCode)
    .maybeSingle();

  if (shortCodeError) {
    console.error("[Webhook] short_code lookup failed:", {
      code: shortCodeError.code,
      message: shortCodeError.message,
      details: shortCodeError.details,
    });
  }

  if (shortCodeReport) return shortCodeReport;

  const uuidRange = getUuidRangeFromShortCode(shortCode);
  if (!uuidRange) {
    if (shortCodeError) throw shortCodeError;
    return null;
  }

  let idPrefixQuery = supabase
    .from("assessment_reports")
    .select(REPORT_SELECT)
    .gte("id", uuidRange.lower)
    .order("id", { ascending: true })
    .limit(1);

  idPrefixQuery = uuidRange.upperInclusive
    ? idPrefixQuery.lte("id", uuidRange.upper)
    : idPrefixQuery.lt("id", uuidRange.upper);

  const { data: idPrefixReports, error: idPrefixError } = await idPrefixQuery;

  if (idPrefixError) {
    console.error("[Webhook] id prefix lookup failed:", {
      code: idPrefixError.code,
      message: idPrefixError.message,
      details: idPrefixError.details,
    });
    throw idPrefixError;
  }

  return idPrefixReports?.[0] || null;
}

// 驗證 LINE Webhook 簽章
function verifySignature(body, signature) {
  if (!CHANNEL_SECRET) return false;
  if (!signature) return false;
  const hash = crypto
    .createHmac("SHA256", CHANNEL_SECRET)
    .update(body)
    .digest("base64");
  return hash === signature;
}

// 傳送 LINE 回覆訊息
async function replyMessage(replyToken, messages) {
  if (!CHANNEL_ACCESS_TOKEN) {
    throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN.");
  }

  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LINE reply failed: ${response.status} ${text}`);
  }
}

// 格式化完整健康報告訊息
function formatReport(report) {
  const level = report.inflammation_level || "未知";
  const score = report.total_score || 0;
  const products = Array.isArray(report.recommended_products)
    ? report.recommended_products.join("、")
    : report.recommended_products || "";
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
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      supabaseUrlConfigured: Boolean(SUPABASE_URL),
      supabaseKeyType: getKeyType(SUPABASE_SERVICE_ROLE_KEY),
      lineSecretConfigured: Boolean(CHANNEL_SECRET),
      lineTokenConfigured: Boolean(CHANNEL_ACCESS_TOKEN),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await readRawBody(req);

  // 驗證簽章
  const signature = req.headers["x-line-signature"];
  if (!verifySignature(rawBody, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  let payload;
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch (err) {
    console.error("[Webhook] Invalid JSON body:", err);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const events = payload.events || [];

  for (const event of events) {
    if (event.type === "follow") {
      await replyMessage(event.replyToken, [
        {
          type: "text",
          text: "🌿 歡迎加入植本邏輯！\n\n您好，我是派森 AI 健康顧問。\n\n如果您已完成官網快篩，請直接傳送您的 8 碼報告編號（例如：A1B2C3D4），即可收到完整個人化健康報告。\n\n輸入「報告」可重新查詢。",
        },
      ]);
      continue;
    }

    if (event.type !== "message" || event.message.type !== "text") continue;

    const userMessage = event.message.text.trim();
    const replyToken = event.replyToken;

    // 使用者輸入報告編號（8碼英數字）
    if (/^[A-Z0-9]{8}$/i.test(userMessage)) {
      try {
        const supabase = getSupabaseAdmin();
        const shortCode = userMessage.toUpperCase();
        const report = await findReportByCode(supabase, shortCode);

        if (!report) {
          await replyMessage(replyToken, [
            { type: "text", text: `找不到編號「${shortCode}」的報告。\n\n請確認編號是否正確，或前往官網重新進行派森分析：\nhttps://phytologic.tw` },
          ]);
        } else {
          const userId = event.source.userId;
          let memberId = null;

          const { data: existingProfile, error: profileLookupError } = await supabase
            .from("profiles")
            .select("id")
            .eq("line_user_id", userId)
            .maybeSingle();

          if (profileLookupError) {
            console.error("[Webhook] profiles lookup failed:", profileLookupError.message);
          } else if (existingProfile) {
            memberId = existingProfile.id;
          } else {
            const { data: newProfile, error: profileError } = await supabase
              .from("profiles")
              .insert({
                line_user_id: userId,
                role: "user",
                line_linked_at: new Date().toISOString(),
              })
              .select("id")
              .single();

            if (profileError) {
              console.error("[Webhook] profiles insert failed:", profileError.message);
            } else {
              memberId = newProfile.id;
            }
          }

          const { error: patchError } = await supabase
            .from("assessment_reports")
            .update({
              line_user_id: event.source.userId,
              line_sent_at: new Date().toISOString(),
              member_id: memberId,
            })
            .eq("id", report.id);

          if (patchError) {
            console.error("[Webhook] PATCH assessment_reports failed:", patchError.message);
          }

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
