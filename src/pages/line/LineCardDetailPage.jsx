import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";
import { getNumberCardTheme } from "../../lib/numberCardTheme";

const CATEGORY_META = {
  food: { label: "食", title: "今日飲食能量" },
  clothing: { label: "衣", title: "今日穿著頻率" },
  living: { label: "住", title: "今日居住場域" },
  movement: { label: "行", title: "今日行動節奏" },
  learning: { label: "育", title: "今日學習養分" },
  joy: { label: "樂", title: "今日愉悅能量" },
};

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getCardId(route = "") {
  const match = route.match(/^\/line\/cards\/detail\/([^/]+)$/);
  return match?.[1] || "";
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function normalizeInterpretation(card) {
  const source = card?.ai_interpretation || {};
  return {
    title: source.title || `${CATEGORY_META[card?.category]?.title || "今日植本卡牌"} · 第 ${card?.card_number || "?"} 號`,
    meaning: source.meaning || source.summary || "今日含義正在整理中。",
    advice: source.advice || source.lifestyle_advice || "今天先選擇一個可完成的小行動。",
    body_hint: source.body_hint || "請觀察睡眠、消化、精神與壓力狀態。",
    action: source.action || "補水、放慢速度，保留一段安靜休息。",
    avoid: source.avoid || "避免過度安排、過度刺激或忽略身體訊號。",
  };
}

export default function LineCardDetailPage({ route, go }) {
  const [member] = useState(readStoredMember);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCard() {
      const storedMember = readStoredMember();
      if (!storedMember?.line_user_id) {
        go("/line/entry");
        return;
      }

      const cardId = getCardId(route);
      if (!cardId) {
        setErrorMsg("找不到卡牌編號。");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg("");
      try {
        const response = await fetch(`/api/member?resource=number-card-detail&cardId=${encodeURIComponent(cardId)}`, {
          headers: { "x-line-user-id": storedMember.line_user_id },
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "card_detail_failed");
        setCard(result.card);
      } catch (error) {
        console.error("[LineCardDetailPage] load failed:", error);
        setErrorMsg("卡牌詳細內容暫時無法載入，請稍後再試。");
      } finally {
        setLoading(false);
      }
    }

    loadCard();
  }, [route, go]);

  if (!member?.line_user_id) return null;

  const meta = CATEGORY_META[card?.category] || { label: "植本", title: "今日植本卡牌" };
  const interpretation = normalizeInterpretation(card);
  const theme = getNumberCardTheme(card?.card_number);

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={() => go("/line/cards")}
          style={{ border: 0, background: "transparent", display: "inline-flex", alignItems: "center", gap: 6, color: "#1A2F15", fontSize: 13, fontWeight: 600 }}
        >
          <ArrowLeft size={17} />
          返回植本卡牌
        </button>
        <span style={{ fontSize: 12, color: "#8A9A6A" }}>{formatDate(card?.draw_date)}</span>
      </header>

      <div style={{ padding: "0 20px 28px" }}>
        {loading ? (
          <div style={{ minHeight: 260, display: "grid", placeItems: "center", color: "#3D5A30", gap: 10 }}>
            <Loader2 size={28} className="animate-spin" />
            <p style={{ margin: 0, fontSize: 13 }}>讀取卡牌</p>
          </div>
        ) : errorMsg ? (
          <div style={{ border: "1px solid #F0CACA", borderRadius: 12, padding: 14, color: "#A34848", background: "#FFF" }}>
            {errorMsg}
          </div>
        ) : (
          <>
            <section
              style={{
                borderRadius: 16,
                background: theme.bg,
                color: theme.fg,
                border: `1px solid ${theme.border}`,
                padding: 22,
                textAlign: "center",
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: 13, opacity: 0.75 }}>今日面向：{meta.label}</p>
              <p style={{ margin: 0, fontSize: 80, lineHeight: 1, color: theme.accent, fontWeight: 700 }}>{card?.card_number}</p>
              <p style={{ margin: "8px 0 0", fontSize: 13, opacity: 0.75 }}>今日數字：{card?.card_number}</p>
              <h1 style={{ margin: "14px 0 0", fontSize: 22, lineHeight: 1.35, fontWeight: 700 }}>{interpretation.title}</h1>
            </section>

            <section style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <DetailBlock title="今日含義" text={interpretation.meaning} />
              <DetailBlock title="今日建議" text={interpretation.advice} />
              <DetailBlock title="身體提醒" text={interpretation.body_hint} />
              <DetailBlock title="適合行動" text={interpretation.action} />
              <DetailBlock title="避免事項" text={interpretation.avoid} />
            </section>
          </>
        )}
      </div>
    </LineMemberLayout>
  );
}

function DetailBlock({ title, text }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid rgba(138,154,106,0.18)", borderRadius: 12, padding: 14 }}>
      <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 700, color: "#1A2F15" }}>{title}</p>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: "#3D5A30", whiteSpace: "pre-line" }}>{text}</p>
    </div>
  );
}
