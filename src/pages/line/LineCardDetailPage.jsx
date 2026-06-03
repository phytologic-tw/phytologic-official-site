import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";
import { getNumberCardTheme } from "../../lib/numberCardTheme";

const SECTION_LABELS = [
  ["food", "食"],
  ["clothing", "衣"],
  ["living", "住"],
  ["movement", "行"],
  ["learning", "育"],
  ["joy", "樂"],
];

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getHistoryCardId(route = "") {
  const match = route.match(/^\/line\/cards\/history\/([^/]+)$/);
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

function fallbackInterpretation(card) {
  return {
    title: `第 ${card?.card_number || "?"} 號植本數字卡`,
    summary: "今日解說正在整理中。",
    energy: "能量解析暫時無法載入，請稍後再回來查看。",
    body_hint: "請先觀察睡眠、消化、精神與壓力狀態。",
    lifestyle_advice: "今天先補水、補充原型植物性食物，並保留一段安靜休息。",
    sections: {
      food: "選擇原型食物與植物性比例高的餐點。",
      clothing: "穿著以舒適、透氣、容易活動為主。",
      living: "整理一個小角落，讓空間回到清爽。",
      movement: "用散步或伸展溫和啟動身體。",
      learning: "吸收少量能實踐的健康知識。",
      joy: "安排一件讓感官放鬆的小事。",
    },
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

      setLoading(true);
      setErrorMsg("");
      try {
        const headers = { "x-line-user-id": storedMember.line_user_id };
        const historyId = getHistoryCardId(route);
        const url = historyId
          ? `/api/member?resource=number-card-detail&cardId=${encodeURIComponent(historyId)}`
          : "/api/member?resource=number-card-today";
        const response = await fetch(url, { headers });
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

  const interpretation = card?.ai_interpretation || fallbackInterpretation(card);
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
            <p style={{ margin: 0, fontSize: 13 }}>抽卡中</p>
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
              <p style={{ margin: "0 0 8px", fontSize: 12, opacity: 0.72 }}>{theme.name}</p>
              <p style={{ margin: 0, fontSize: 78, lineHeight: 1, color: theme.accent, fontWeight: 700 }}>{card?.card_number}</p>
              <h1 style={{ margin: "14px 0 0", fontSize: 22, lineHeight: 1.35, fontWeight: 700 }}>{interpretation.title}</h1>
            </section>

            <section style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <DetailBlock title="今日總結" text={interpretation.summary} />
              <DetailBlock title="能量解析" text={interpretation.energy} />
              <DetailBlock title="身體提醒" text={interpretation.body_hint} />
              <DetailBlock title="生活建議" text={interpretation.lifestyle_advice} />
            </section>

            <section style={{ marginTop: 20 }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1A2F15" }}>六大面向</p>
              <div style={{ display: "grid", gap: 10 }}>
                {SECTION_LABELS.map(([key, label]) => (
                  <div key={key} style={{ background: "#FFFFFF", border: "1px solid rgba(138,154,106,0.18)", borderRadius: 12, padding: 14 }}>
                    <p style={{ margin: "0 0 7px", fontSize: 15, fontWeight: 700, color: "#1A2F15" }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: "#3D5A30" }}>
                      {interpretation.sections?.[key] || "今日建議正在整理中。"}
                    </p>
                  </div>
                ))}
              </div>
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
