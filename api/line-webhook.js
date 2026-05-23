// api/line-webhook.js
// LINE Messaging API Webhook
// 功能：接收使用者訊息、查詢報告編號、回傳完整分析

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import {
  buildFullReportPrompt,
  calcLifeNumber,
  calcZodiac,
  getBloodTypeTrait,
  getLifeNumberTrait,
} from "./prompts.js";

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY;
const DEFAULT_LIFF_ID = process.env.VITE_LINE_LIFF_ID || "2010068530-ddmtwm5t";
const LIFF_ENTRY_URL =
  process.env.LINE_LIFF_ENTRY_URL ||
  `https://liff.line.me/${DEFAULT_LIFF_ID}`;
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

function getJwtRole(key) {
  if (!key?.startsWith("eyJ")) return null;

  try {
    const [, payload] = key.split(".");
    if (!payload) return null;
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = Buffer.from(normalizedPayload, "base64").toString("utf8");
    return JSON.parse(decodedPayload).role || null;
  } catch {
    return "unreadable";
  }
}

function buildMemberEntryMessage() {
  return {
    type: "template",
    altText: "建立植本邏輯會員資料",
    template: {
      type: "buttons",
      title: "植本邏輯會員建檔",
      text: "點擊下方按鈕進入 LIFF 建檔頁面，完成後即可查看今日健康狀態與七天修補計畫。",
      actions: [
        {
          type: "uri",
          label: "立即建立會員資料",
          uri: LIFF_ENTRY_URL,
        },
      ],
    },
  };
}

function isMemberEntryKeyword(message) {
  return ["會員", "建檔", "加入會員", "member"].some((keyword) =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
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
  const uuidRange = getUuidRangeFromShortCode(shortCode);

  if (uuidRange) {
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
      idPrefixError.stage = "id_prefix";
      console.error("[Webhook] id prefix lookup failed:", {
        code: idPrefixError.code,
        message: idPrefixError.message,
        details: idPrefixError.details,
      });
      throw idPrefixError;
    }

    if (idPrefixReports?.[0]) return idPrefixReports[0];
  }

  const { data: shortCodeReport, error: shortCodeError } = await supabase
    .from("assessment_reports")
    .select(REPORT_SELECT_WITH_SHORT_CODE)
    .eq("short_code", shortCode)
    .maybeSingle();

  if (shortCodeError) {
    shortCodeError.stage = "short_code";
    console.error("[Webhook] short_code lookup failed:", {
      code: shortCodeError.code,
      message: shortCodeError.message,
      details: shortCodeError.details,
    });
    throw shortCodeError;
  }

  return shortCodeReport;
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

async function pushMessage(to, messages) {
  if (!CHANNEL_ACCESS_TOKEN) {
    throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN.");
  }

  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ to, messages }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LINE push failed: ${response.status} ${text}`);
  }
}

function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(new Date());
}

function extractJson(text) {
  const clean = String(text || "").replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI response did not contain JSON.");
  return JSON.parse(clean.slice(start, end + 1));
}

async function callAnthropicJson(prompt, maxTokens = 4000) {
  if (!ANTHROPIC_API_KEY) throw new Error("Missing ANTHROPIC_API_KEY.");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Anthropic failed: ${JSON.stringify(data)}`);
  const text = data.content?.map((content) => content.text || "").join("") || "";
  return extractJson(text);
}

function compact(value, fallback = "資料整理中") {
  if (value == null) return fallback;
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : Object.values(item || {}).filter(Boolean).join("：")))
      .filter(Boolean)
      .join("\n");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, item]) => item != null && item !== "")
      .map(([key, item]) => `${key}：${compact(item, "")}`)
      .filter(Boolean)
      .join("\n");
  }
  return String(value);
}

function textBlock(text, size = "sm", weight = "regular") {
  return {
    type: "text",
    text: String(text || "資料整理中").slice(0, 900),
    wrap: true,
    size,
    weight,
    color: weight === "bold" ? "#123828" : "#49675A",
  };
}

function buildFlex(title, blocks, button) {
  const contents = [
    textBlock(title, "lg", "bold"),
    { type: "separator", margin: "md", color: "#E7DDBF" },
    ...blocks.flatMap((block) => [textBlock(block.title, "sm", "bold"), textBlock(block.text, "sm")]),
  ];

  const bubble = {
    type: "bubble",
    styles: { body: { backgroundColor: "#F9F5EA" } },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents,
    },
  };

  if (button) {
    bubble.footer = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#123828",
          action: button,
        },
      ],
    };
  }

  return { type: "flex", altText: title, contents: bubble };
}

function buildReportFlexMessages(reportJson) {
  const plan = reportJson.section7_seven_day_plan || {};
  const planDays = Array.isArray(plan.days) ? plan.days : [];
  const planText = planDays
    .map((day) => `Day ${day.day} ${day.theme}｜${day.product_name || ""}`)
    .join("\n");

  return [
    buildFlex("生命能量解讀", [
      { title: "你的能量線索", text: compact(reportJson.section1_energy?.life_number_insight) },
      { title: "今日提醒", text: compact(reportJson.section1_energy?.today_energy_tip) },
    ]),
    buildFlex("發炎與體重管理", [
      { title: "發炎現況", text: compact(reportJson.section2_inflammation?.overall) },
      { title: "BMI 方向", text: compact(reportJson.section3_bmi) },
    ]),
    buildFlex("飲食、運動與生活", [
      { title: "飲食建議", text: compact(reportJson.section4_diet?.main_advice) },
      { title: "運動建議", text: compact(reportJson.section5_exercise?.recommended_types) },
      { title: "生活規律", text: compact(reportJson.section6_lifestyle) },
    ]),
    buildFlex("七天定製修補計畫", [
      { title: "計畫目標", text: compact(plan.intro) },
      { title: "七天總覽", text: planText || compact(plan.days) },
    ], {
      type: "uri",
      label: "前往今日打卡",
      uri: "https://www.phytologic.tw/line/checkin",
    }),
  ];
}

async function findLatestReportByLineUserId(supabase, lineUserId) {
  const { data, error } = await supabase
    .from("assessment_reports")
    .select("*")
    .eq("line_user_id", lineUserId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getCityClimate(supabase, city) {
  if (!city) return null;

  const { data, error } = await supabase
    .from("city_climate")
    .select("*")
    .eq("city", city)
    .maybeSingle();

  if (error) throw error;
  return data;
}

function buildWebAnswerSummary(report) {
  const candidates = [
    report.full_report?.answerSummary,
    report.full_report?.answer_summary,
    report.answer_summary,
    report.ai_analysis,
  ];
  return candidates.find(Boolean) || "使用者已完成官網派森快篩，詳細作答資料請依現有報告摘要推論。";
}

async function generateFullReport(supabase, profile, assessmentReport, cityClimate) {
  const lifeNumber = profile.life_number || calcLifeNumber(profile.birthdate);
  const zodiac = profile.zodiac && profile.zodiac_element
    ? { sign: profile.zodiac, element: profile.zodiac_element }
    : calcZodiac(profile.birthdate);
  const lifeNumberTrait = getLifeNumberTrait(lifeNumber);
  const bloodTypeTrait = getBloodTypeTrait(profile.blood_type);
  const recommendedProducts = assessmentReport.recommended_products;
  const recommendedProductId = Array.isArray(recommendedProducts) ? recommendedProducts[0] : recommendedProducts;

  const prompt = buildFullReportPrompt({
    gender: assessmentReport.gender || profile.gender || "未填寫",
    ageGroup: assessmentReport.age_group || profile.age_group || "未填寫",
    bmi: assessmentReport.bmi || profile.bmi || "未計算",
    workType: assessmentReport.work_type || profile.work_type || "未填寫",
    sleepQuality: assessmentReport.sleep_quality || profile.sleep_quality || "未填寫",
    exerciseHabit: assessmentReport.exercise_habit || profile.exercise_habit || "未填寫",
    nickname: profile.nickname || profile.line_display_name || "健康夥伴",
    birthdate: profile.birthdate,
    bloodType: profile.blood_type,
    city: profile.city,
    sleepHours: profile.sleep_hours,
    dietPattern: profile.diet_pattern,
    stressLevel: profile.stress_level,
    lifeNumber,
    lifeNumberTrait,
    zodiac: zodiac.sign,
    zodiacElement: zodiac.element,
    bloodTypeTrait,
    cityClimate: cityClimate || profile.city_climate || {},
    webSurveyTotal: assessmentReport.total_score || "未提供",
    webSurveyLevel: assessmentReport.inflammation_level || "未提供",
    webCategorySummary: compact(assessmentReport.system_scores || assessmentReport.full_report?.topSignals || assessmentReport.full_report?.top_signals),
    webAnswerSummary: buildWebAnswerSummary(assessmentReport),
    lineSurveyAnswers: assessmentReport.second_survey || {},
    recommendedProductId: recommendedProductId || profile.recommended_product || "snow",
    recommendedProductName: recommendedProductId || profile.recommended_product || "雪山植萃",
  });

  const reportJson = await callAnthropicJson(prompt, 4000);
  const memberData = reportJson.member_data_to_save || {};
  const sevenDayPlan = reportJson.section7_seven_day_plan || {};
  const today = getTaiwanToday();

  const profileUpdate = {
    ...memberData,
    city_climate: cityClimate || profile.city_climate || {},
    seven_day_plan: sevenDayPlan,
    last_report_id: assessmentReport.id,
    seven_day_start_date: today,
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", profile.id);

  if (profileError) throw profileError;

  const reportUpdate = {
    full_ai_report: reportJson,
    seven_day_plan: sevenDayPlan,
    report_sent_at: new Date().toISOString(),
  };

  const { error: reportError } = await supabase
    .from("assessment_reports")
    .update(reportUpdate)
    .eq("id", assessmentReport.id);

  if (reportError) throw reportError;

  return reportJson;
}

async function handleProfileComplete(event) {
  const userId = event.source?.userId;
  if (!userId) return;

  const supabase = getSupabaseAdmin();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("line_user_id", userId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) {
    await replyMessage(event.replyToken, [{ type: "text", text: "尚未找到您的會員資料，請先完成 LINE 建檔。" }]);
    return;
  }

  const assessmentReport = await findLatestReportByLineUserId(supabase, userId);
  if (!assessmentReport) {
    await replyMessage(event.replyToken, [{ type: "text", text: "尚未找到您的派森快篩報告。請先到官網完成快篩，再回到 LINE 會員中心。" }]);
    return;
  }

  const cityClimate = await getCityClimate(supabase, profile.city);
  await replyMessage(event.replyToken, [{ type: "text", text: "派森正在整合你的建檔資料與快篩報告，完整分析稍後送上。" }]);
  const reportJson = await generateFullReport(supabase, profile, assessmentReport, cityClimate);
  await pushMessage(userId, buildReportFlexMessages(reportJson));
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
      supabaseJwtRole: getJwtRole(SUPABASE_SERVICE_ROLE_KEY),
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
      await replyMessage(event.replyToken, [buildMemberEntryMessage()]);
      continue;
    }

    if (event.type === "postback") {
      const params = new URLSearchParams(event.postback?.data || "");
      if (params.get("action") === "profile_complete") {
        try {
          await handleProfileComplete(event);
        } catch (err) {
          console.error("[Webhook] profile_complete failed:", err);
          await replyMessage(event.replyToken, [
            { type: "text", text: "完整報告生成暫時失敗，請稍後再試或聯繫植本邏輯客服。" },
          ]);
        }
      }
      continue;
    }

    if (event.type !== "message" || event.message.type !== "text") continue;

    const userMessage = event.message.text.trim();
    const replyToken = event.replyToken;

    if (isMemberEntryKeyword(userMessage)) {
      await replyMessage(replyToken, [buildMemberEntryMessage()]);
      continue;
    }

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
        const errorCode = [err.stage, err.code].filter(Boolean).join(":") || "unknown";
        await replyMessage(replyToken, [
          { type: "text", text: `系統暫時無法查詢，請稍後再試。\n\n錯誤代碼：${errorCode}` },
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
