import { createClient } from "@supabase/supabase-js";
import { buildDailyPlanPrompt } from "../src/server/prompts.js";

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

let supabaseAdmin;

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

function getTaiwanToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(new Date());
}

function getPlanDay(startDate, today) {
  const start = new Date(`${startDate}T00:00:00+08:00`);
  const current = new Date(`${today}T00:00:00+08:00`);
  const diff = Math.floor((current - start) / 86400000);
  return diff + 1;
}

function extractJson(text) {
  const clean = String(text || "").replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI response did not contain JSON.");
  return JSON.parse(clean.slice(start, end + 1));
}

async function callAnthropicJson(prompt) {
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
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`Anthropic failed: ${JSON.stringify(data)}`);
  const text = data.content?.map((content) => content.text || "").join("") || "";
  return extractJson(text);
}

async function pushMessage(to, messages) {
  if (!CHANNEL_ACCESS_TOKEN) throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN.");

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

function lineText(value, fallback = "今日任務整理中") {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join("\n");
  return Object.values(value).filter(Boolean).join("\n");
}

function buildDailyMessage(profile, planDay, content) {
  return [
    {
      type: "flex",
      altText: `七天修補計畫 Day ${planDay}`,
      contents: {
        type: "bubble",
        styles: { body: { backgroundColor: "#F9F5EA" } },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: `Day ${planDay} 七天修補計畫`,
              weight: "bold",
              size: "lg",
              color: "#123828",
            },
            { type: "text", text: lineText(content.greeting), wrap: true, size: "sm", color: "#49675A" },
            { type: "separator", margin: "md", color: "#E7DDBF" },
            { type: "text", text: "今日任務", weight: "bold", size: "sm", color: "#123828" },
            { type: "text", text: lineText(content.today_mission), wrap: true, size: "sm", color: "#49675A" },
            { type: "text", text: lineText(content.product_highlight), wrap: true, size: "sm", color: "#1E6B43" },
            { type: "text", text: lineText(content.expected_feeling), wrap: true, size: "sm", color: "#49675A" },
            { type: "text", text: lineText(content.le_reminder), wrap: true, size: "xs", color: "#8B7A4C" },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#123828",
              action: {
                type: "uri",
                label: "完成今日打卡",
                uri: "https://www.phytologic.tw/line/checkin",
              },
            },
          ],
        },
      },
    },
  ];
}

async function recordDailyMessage(supabase, profile, today, content) {
  const { error } = await supabase
    .from("daily_ai_messages")
    .upsert(
      {
        member_id: profile.id,
        sent_date: today,
        message_type: "plan",
        content,
        sent_at: new Date().toISOString(),
      },
      { onConflict: "member_id,sent_date,message_type" }
    );

  if (error) throw error;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const today = getTaiwanToday();

  try {
    const supabase = getSupabaseAdmin();
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id,line_user_id,nickname,line_display_name,seven_day_start_date,seven_day_bonus_done,seven_day_plan,streak_days,le_points")
      .not("seven_day_start_date", "is", null)
      .eq("seven_day_bonus_done", false);

    if (error) throw error;

    const results = [];
    for (const profile of profiles || []) {
      if (!profile.line_user_id) continue;

      const planDay = getPlanDay(profile.seven_day_start_date, today);
      if (planDay < 1 || planDay > 7) continue;

      const days = Array.isArray(profile.seven_day_plan?.days) ? profile.seven_day_plan.days : [];
      const dayPlan = days.find((day) => Number(day.day) === planDay) || days[planDay - 1];
      if (!dayPlan) continue;

      try {
        const prompt = buildDailyPlanPrompt({
          nickname: profile.nickname || profile.line_display_name || "健康夥伴",
          planDay,
          dayPlan,
          streakDays: profile.streak_days ?? 0,
          lePoints: profile.le_points ?? 0,
        });

        const content = await callAnthropicJson(prompt);
        await pushMessage(profile.line_user_id, buildDailyMessage(profile, planDay, content));
        await recordDailyMessage(supabase, profile, today, { plan_day: planDay, ...content });
        results.push({ profileId: profile.id, status: "sent", planDay });
      } catch (err) {
        console.error("[daily-push] member push failed:", profile.id, err);
        results.push({ profileId: profile.id, status: "failed", error: err.message });
      }
    }

    return res.status(200).json({ status: "ok", date: today, count: results.length, results });
  } catch (error) {
    console.error("[daily-push] failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
