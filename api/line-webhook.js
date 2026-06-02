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
} from "./_prompts.js";
import { normalizeAttribution, pickDefinedEntries } from "./_member-utils.js";
import { getProducts } from "./_products.js";

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
const MEMBER_RICH_MENU_ID = process.env.LINE_MEMBER_RICH_MENU_ID || "";
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

function buildLiffUrl(pathname = "/line/entry", attribution = {}) {
  const stateParams = new URLSearchParams();
  const normalizedAttribution = normalizeAttribution(attribution);
  if (normalizedAttribution.promoter_id) stateParams.set("ref", normalizedAttribution.promoter_id);
  if (normalizedAttribution.referral_source) stateParams.set("src", normalizedAttribution.referral_source);
  if (normalizedAttribution.event_id) stateParams.set("evt", normalizedAttribution.event_id);

  const query = stateParams.toString();
  const state = query ? `${pathname}?${query}` : pathname;
  return `${LIFF_ENTRY_URL}?liff.state=${encodeURIComponent(state)}`;
}

const LIFF_ACTIONS = {
  member_home: {
    title: "植本邏輯會員專區",
    body: "查看今日洞察、LE / CP、打卡入口與 My Dr. Marvin 的最新狀態。",
    label: "前往會員專區",
    path: "/line/member-home",
  },
  assessment: {
    title: "My Dr. Marvin",
    body: "完成 25 題深度檢測，整理你的七大系統健康分數、生活線索與植萃方向。",
    label: "開始深度檢測",
    path: "/line/assessment",
  },
  events: {
    title: "最新活動",
    body: "查看植本邏輯近期活動、會員優惠與體驗資訊。",
    label: "查看最新活動",
    path: "/line/events",
  },
  checkin: {
    title: "今日打卡",
    body: "記錄今天的飲用、心情、活力與身體感受，累積 LE 幸運能量值。",
    label: "前往今日打卡",
    path: "/line/checkin",
  },
  reports: {
    title: "我的報告",
    body: "查看最新 Dr. Marvin 報告、五維分數與歷史健康紀錄。",
    label: "查看我的報告",
    path: "/line/reports",
  },
  tasks: {
    title: "任務中心",
    body: "完成每日、每週與七日啟動任務，累積 LE 與會員成長進度。",
    label: "查看任務中心",
    path: "/line/tasks",
  },
  profile: {
    title: "我的帳戶",
    body: "查看會員身份、點數、健康資料、加入來源與推薦資訊。",
    label: "查看我的帳戶",
    path: "/line/profile",
  },
  referral: {
    title: "推薦好友",
    body: "取得你的推薦碼與 LINE 分享連結，邀請朋友一起開始健康旅程。",
    label: "取得推薦連結",
    path: "/line/referral",
  },
  shop: {
    title: "植萃商城",
    body: "查看五色植萃與冷鏈訂購資訊，後續可串接 P 點消費流程。",
    label: "前往植萃商城",
    path: "/line/shop",
  },
};

function getWelcomeCopy(attribution = {}) {
  const source = String(attribution.referral_source || "").trim();
  const promoterType = String(attribution.promoter_type || "").trim();

  if (source === "website") {
    return {
      title: "你的健康快篩報告在這裡",
      body: "完成會員資料後，就能回到會員專區查看完整的 AI 健康分析與個人化建議。",
      label: "完成會員資料",
    };
  }

  if (source.startsWith("event_") || promoterType === "event" || attribution.event_id) {
    return {
      title: "謝謝你在活動現場與我們相遇",
      body: "完成會員資料後，我們會保留你的活動來源，後續體驗包或活動資格也會以這份資料為準。",
      label: "確認活動資格",
    };
  }

  if (source.startsWith("store_") || promoterType === "store") {
    return {
      title: "歡迎加入植本邏輯會員",
      body: "完成會員資料後，系統會保留你的門市來源，未來消費與會員回饋會更好追蹤。",
      label: "建立會員資料",
    };
  }

  return {
    title: "歡迎加入植本邏輯",
    body: "從今天開始，讓 Dr. Marvin 陪你記錄飲用、追蹤報告，建立一套可以長期維持的健康日常。",
    label: "開始會員旅程",
  };
}

function buildMemberEntryMessage(attribution = {}) {
  const copy = getWelcomeCopy(attribution);
  return {
    type: "flex",
    altText: copy.title,
    contents: {
      type: "bubble",
      styles: {
        body: { backgroundColor: "#F9F5EA" },
        footer: { backgroundColor: "#F9F5EA" },
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "PHYTOLOGIC",
            size: "xs",
            weight: "bold",
            color: "#8C7A53",
          },
          {
            type: "text",
            text: copy.title,
            wrap: true,
            size: "lg",
            weight: "bold",
            color: "#243A33",
          },
          {
            type: "text",
            text: copy.body,
            wrap: true,
            size: "sm",
            color: "#49675A",
            margin: "sm",
          },
          {
            type: "separator",
            margin: "md",
            color: "#E7DDBF",
          },
          {
            type: "text",
            text: "三個入口會在下方選單開啟：會員專區、My Dr. Marvin、最新活動。",
            wrap: true,
            size: "xs",
            color: "#8C7A53",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#243A33",
            action: {
              type: "uri",
              label: copy.label,
              uri: buildLiffUrl("/line/entry", attribution),
            },
          },
        ],
      },
    },
  };
}

function buildMemberHomeMessage() {
  return {
    type: "flex",
    altText: "植本邏輯會員專區",
    contents: {
      type: "bubble",
      styles: { body: { backgroundColor: "#F9F5EA" }, footer: { backgroundColor: "#F9F5EA" } },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          textBlock("植本邏輯會員專區", "lg", "bold"),
          textBlock("進入會員首頁後，可以查看 LE / CP、今日洞察、打卡與 My Dr. Marvin。", "sm"),
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#243A33",
            action: {
              type: "uri",
              label: "前往會員專區",
              uri: buildLiffUrl("/line/member-home"),
            },
          },
        ],
      },
    },
  };
}

function buildOpenLiffMessage(actionKey, attribution = {}) {
  const action = LIFF_ACTIONS[actionKey] || LIFF_ACTIONS.member_home;
  return buildFlex(action.title, [
    { title: "LINE 會員入口", text: action.body },
  ], {
    type: "uri",
    label: action.label,
    uri: buildLiffUrl(action.path, attribution),
  });
}

function buildMemberMenuMessage(attribution = {}) {
  const primaryRows = [
    ["member_home", "assessment"],
    ["checkin", "reports"],
    ["tasks", "profile"],
    ["referral", "events"],
  ];

  return {
    type: "flex",
    altText: "植本邏輯會員選單",
    contents: {
      type: "bubble",
      styles: {
        body: { backgroundColor: "#F9F5EA" },
        footer: { backgroundColor: "#F9F5EA" },
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          textBlock("植本邏輯會員選單", "lg", "bold"),
          textBlock("選擇你現在要前往的會員功能。", "sm"),
          { type: "separator", margin: "md", color: "#E7DDBF" },
          ...primaryRows.map((row) => ({
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            contents: row.map((key) => ({
              type: "button",
              style: "secondary",
              height: "sm",
              action: {
                type: "uri",
                label: LIFF_ACTIONS[key].label.replace("前往", "").replace("查看", "").slice(0, 12),
                uri: buildLiffUrl(LIFF_ACTIONS[key].path, attribution),
              },
            })),
          })),
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#243A33",
            action: {
              type: "uri",
              label: "前往植萃商城",
              uri: buildLiffUrl(LIFF_ACTIONS.shop.path, attribution),
            },
          },
        ],
      },
    },
  };
}

function buildReportLookupMessage() {
  return buildFlex("查詢健康報告", [
    {
      title: "已經有報告編號",
      text: "請直接輸入 8 碼報告編號，例如 AB12CD34。",
    },
    {
      title: "想看會員報告",
      text: "也可以進入會員專區查看 My Dr. Marvin 深度報告與歷史紀錄。",
    },
  ], {
    type: "uri",
    label: "前往我的報告",
    uri: buildLiffUrl("/line/reports"),
  });
}

export function buildProductCardMessage(products = []) {
  const productText = products
    .map((product) => `${product.name}：${product.line_summary || product.theme}`)
    .join("\n");

  return buildFlex("植本邏輯五款植萃", [
    {
      title: "五色植萃",
      text: productText || "五款植萃依不同生活狀態提供日常營養補充。",
    },
    {
      title: "找到適合你的方向",
      text: "完成 My Dr. Marvin 深度檢測後，系統會整理更個人化的推薦飲品。",
    },
  ], {
    type: "uri",
    label: "開始 My Dr. Marvin",
    uri: buildLiffUrl("/line/assessment"),
  });
}

async function buildProductIntroMessage() {
  const products = await getProducts(getSupabaseAdmin(), { allowFallback: true });
  return buildProductCardMessage(products);
}

async function getLineProfile(userId) {
  if (!CHANNEL_ACCESS_TOKEN || !userId) return null;

  try {
    const response = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: { Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("[Webhook] LINE profile lookup failed:", error.message);
    return null;
  }
}

function getProfileAttribution(profile = {}) {
  return normalizeAttribution({
    ref: profile.promoter_id,
    promoter_type: profile.promoter_type,
    src: profile.referral_source,
    evt: profile.event_id,
  });
}

async function findOrCreateFollowProfile(supabase, userId) {
  const { data: existing, error: existingError } = await supabase
    .from("profiles")
    .select("id,line_user_id,line_display_name,line_picture_url,promoter_id,promoter_type,referral_source,event_id")
    .eq("line_user_id", userId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing;

  const lineProfile = await getLineProfile(userId);
  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert(pickDefinedEntries({
      line_user_id: userId,
      line_display_name: lineProfile?.displayName || null,
      line_picture_url: lineProfile?.pictureUrl || null,
      line_status_message: lineProfile?.statusMessage || null,
      role: "user",
      joined_at: new Date().toISOString(),
      line_linked_at: new Date().toISOString(),
    }))
    .select("id,line_user_id,line_display_name,line_picture_url,promoter_id,promoter_type,referral_source,event_id")
    .single();

  if (createError) throw createError;
  return created;
}

async function buildFollowWelcomeMessage(event) {
  const userId = event.source?.userId;
  if (!userId) return buildMemberEntryMessage();

  try {
    const supabase = getSupabaseAdmin();
    const profile = await findOrCreateFollowProfile(supabase, userId);
    return buildMemberEntryMessage(getProfileAttribution(profile));
  } catch (error) {
    console.error("[Webhook] follow profile handling failed:", error.message);
    return buildMemberEntryMessage();
  }
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

async function linkMemberRichMenu(userId) {
  if (!CHANNEL_ACCESS_TOKEN || !MEMBER_RICH_MENU_ID || !userId) return false;

  try {
    const response = await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu/${MEMBER_RICH_MENU_ID}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}` },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Webhook] member rich menu link failed:", response.status, text);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Webhook] member rich menu link failed:", error.message);
    return false;
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

export function buildReportFlexMessages(reportJson) {
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
      uri: buildLiffUrl("/line/checkin"),
    }),
    buildFlex("今日植萃推薦", [
      { title: compact(reportJson.section8_product?.name || reportJson.section8_product?.recommended_product || "推薦飲品"), text: compact(reportJson.section8_product?.primary_reason || reportJson.section8_product?.reason || "完成報告後，Dr. Marvin 會依你的身體線索推薦合適植萃。") },
      { title: "飲用提醒", text: compact(reportJson.section8_product?.how_to_use || reportJson.section8_product?.drink_timing || "建議依個人作息固定補充，並搭配每日打卡觀察身體感受。") },
    ], {
      type: "uri",
      label: "查看植萃商城",
      uri: buildLiffUrl("/line/shop"),
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
  return candidates.find(Boolean) || "使用者已完成官網 Dr. Marvin 快篩，詳細作答資料請依現有報告摘要推論。";
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
    await replyMessage(event.replyToken, [{ type: "text", text: "尚未找到您的 Dr. Marvin 快篩報告。請先到官網完成快篩，再回到 LINE 會員中心。" }]);
    return;
  }

  const cityClimate = await getCityClimate(supabase, profile.city);
  await replyMessage(event.replyToken, [{ type: "text", text: "Dr. Marvin 正在整合你的建檔資料與快篩報告，完整分析稍後送上。" }]);
  await linkMemberRichMenu(userId);
  const reportJson = await generateFullReport(supabase, profile, assessmentReport, cityClimate);
  await pushMessage(userId, buildReportFlexMessages(reportJson));
}

async function handlePostbackEvent(event) {
  const params = new URLSearchParams(event.postback?.data || "");
  const action = params.get("action") || "member_menu";

  if (action === "profile_complete") {
    try {
      await handleProfileComplete(event);
    } catch (err) {
      console.error("[Webhook] profile_complete failed:", err);
      await replyMessage(event.replyToken, [
        { type: "text", text: "完整報告生成暫時失敗，請稍後再試或聯繫植本邏輯客服。" },
      ]);
    }
    return;
  }

  if (action === "my_report") {
    await replyMessage(event.replyToken, [buildReportLookupMessage()]);
    return;
  }

  if (action === "member_menu" || action === "help") {
    await replyMessage(event.replyToken, [buildMemberMenuMessage()]);
    return;
  }

  if (LIFF_ACTIONS[action]) {
    await replyMessage(event.replyToken, [buildOpenLiffMessage(action)]);
    return;
  }

  await replyMessage(event.replyToken, [buildMemberMenuMessage()]);
}

function getKeywordAction(message) {
  const text = String(message || "").toLowerCase();
  const keywordRules = [
    { action: "assessment", keywords: ["marvin", "檢測", "深度", "問卷"] },
    { action: "checkin", keywords: ["打卡", "飲用", "簽到"] },
    { action: "reports", keywords: ["我的報告", "歷史紀錄", "健康分數"] },
    { action: "tasks", keywords: ["任務", "七日", "獎勵"] },
    { action: "profile", keywords: ["帳戶", "個人資料", "點數", "le", "cp"] },
    { action: "referral", keywords: ["推薦好友", "推薦碼", "分享"] },
    { action: "events", keywords: ["活動", "優惠", "公告"] },
    { action: "shop", keywords: ["商城", "購買", "訂購"] },
  ];

  return keywordRules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)))?.action || null;
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
      text: `🌿 Dr. Marvin 健康分析報告\n\n` +
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
      memberRichMenuConfigured: Boolean(MEMBER_RICH_MENU_ID),
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
      await replyMessage(event.replyToken, [await buildFollowWelcomeMessage(event)]);
      continue;
    }

    if (event.type === "postback") {
      await handlePostbackEvent(event);
      continue;
    }

    if (event.type !== "message" || event.message.type !== "text") continue;

    const userMessage = event.message.text.trim();
    const replyToken = event.replyToken;

    if (isMemberEntryKeyword(userMessage)) {
      await replyMessage(replyToken, [buildMemberMenuMessage()]);
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
            { type: "text", text: `找不到編號「${shortCode}」的報告。\n\n請確認編號是否正確，或前往官網重新進行 Dr. Marvin 分析：\nhttps://phytologic.tw` },
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
      await replyMessage(replyToken, [buildReportLookupMessage()]);
      continue;
    }

    const keywordAction = getKeywordAction(userMessage);
    if (keywordAction) {
      await replyMessage(replyToken, [buildOpenLiffMessage(keywordAction)]);
      continue;
    }

    if (userMessage.includes("飲品") || userMessage.includes("推薦")) {
      await replyMessage(replyToken, [await buildProductIntroMessage()]);
      continue;
    }

    // 預設回覆
    await replyMessage(replyToken, [buildMemberMenuMessage()]);
  }

  return res.status(200).json({ status: "ok" });
}
