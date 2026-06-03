import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";
import { getNumberCardTheme } from "../../lib/numberCardTheme";

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

function getCardTitle(card) {
  return card?.ai_interpretation?.title || `第 ${card?.card_number || "?"} 號植本數字卡`;
}

function getCardSummary(card) {
  return card?.ai_interpretation?.summary || "今日解說正在整理中。";
}

export default function LineCardsPage({ route, go }) {
  const [member] = useState(readStoredMember);
  const [todayCard, setTodayCard] = useState(null);
  const [historyCards, setHistoryCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadCards() {
      const storedMember = readStoredMember();
      if (!storedMember?.line_user_id) {
        go("/line/entry");
        return;
      }

      setLoading(true);
      setErrorMsg("");
      try {
        const headers = { "x-line-user-id": storedMember.line_user_id };
        const [todayResponse, historyResponse] = await Promise.all([
          fetch("/api/member?resource=number-card-today", { headers }),
          fetch("/api/member?resource=number-card-history", { headers }),
        ]);

        const todayResult = await todayResponse.json();
        const historyResult = await historyResponse.json();
        if (!todayResponse.ok || !todayResult.success) {
          throw new Error(todayResult.error || "today_card_failed");
        }
        if (!historyResponse.ok || !historyResult.success) {
          throw new Error(historyResult.error || "history_failed");
        }

        setTodayCard(todayResult.card);
        setHistoryCards(historyResult.cards || []);
      } catch (error) {
        console.error("[LineCardsPage] load failed:", error);
        setErrorMsg("抽卡資料暫時無法載入，請稍後再試。");
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [go]);

  if (!member?.line_user_id) return null;

  const theme = getNumberCardTheme(todayCard?.card_number);

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={() => go("/line/member-home")}
          style={{ border: 0, background: "transparent", display: "inline-flex", alignItems: "center", gap: 6, color: "#1A2F15", fontSize: 13, fontWeight: 600 }}
        >
          <ArrowLeft size={17} />
          返回
        </button>
        <h1 style={{ margin: 0, fontSize: 16, color: "#1A2F15", fontWeight: 700 }}>植本卡牌</h1>
        <span style={{ width: 42 }} />
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
            <section>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1A2F15" }}>今日抽卡</p>
              {todayCard ? (
                <button
                  type="button"
                  onClick={() => go("/line/cards/today")}
                  style={{
                    width: "100%",
                    border: `1px solid ${theme.border}`,
                    borderRadius: 14,
                    background: theme.bg,
                    color: theme.fg,
                    padding: "18px 18px",
                    textAlign: "left",
                    display: "grid",
                    gridTemplateColumns: "86px minmax(0,1fr) 18px",
                    alignItems: "center",
                    gap: 12,
                    fontFamily: "'Noto Serif TC', Georgia, serif",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 54, lineHeight: 1, fontWeight: 700, color: theme.accent }}>{todayCard.card_number}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 12, opacity: 0.72, marginBottom: 6 }}>{theme.name} · {formatDate(todayCard.draw_date)}</span>
                    <span style={{ display: "block", fontSize: 18, lineHeight: 1.35, fontWeight: 700 }}>{getCardTitle(todayCard)}</span>
                    <span style={{ display: "block", marginTop: 8, fontSize: 12, lineHeight: 1.6, opacity: 0.82 }}>{getCardSummary(todayCard)}</span>
                  </span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <div style={{ borderRadius: 14, background: "#FFFFFF", padding: 18, color: "#5A6A4A" }}>
                  今日卡尚未建立，重新整理後會自動建立今日卡。
                </div>
              )}
            </section>

            <section style={{ marginTop: 24 }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1A2F15" }}>歷史紀錄</p>
              {historyCards.length ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {historyCards.map((card) => {
                    const itemTheme = getNumberCardTheme(card.card_number);
                    const isToday = card.id === todayCard?.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => go(isToday ? "/line/cards/today" : `/line/cards/history/${card.id}`)}
                        style={{
                          border: "1px solid rgba(138,154,106,0.18)",
                          borderRadius: 12,
                          background: "#FFFFFF",
                          padding: "12px 14px",
                          display: "grid",
                          gridTemplateColumns: "42px minmax(0,1fr) 18px",
                          alignItems: "center",
                          gap: 10,
                          textAlign: "left",
                          fontFamily: "'Noto Serif TC', Georgia, serif",
                        }}
                      >
                        <span style={{ width: 38, height: 38, borderRadius: 10, background: itemTheme.bg, color: itemTheme.accent, display: "grid", placeItems: "center", fontSize: 22, fontWeight: 700 }}>
                          {card.card_number}
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: "block", fontSize: 12, color: "#8A9A6A" }}>{formatDate(card.draw_date)}{isToday ? " · 今日" : ""}</span>
                          <span style={{ display: "block", marginTop: 3, fontSize: 14, fontWeight: 700, color: "#1A2F15", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {getCardTitle(card)}
                          </span>
                        </span>
                        <ChevronRight size={16} color="#8A9A6A" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ borderRadius: 12, background: "#FFFFFF", padding: 14, color: "#8A9A6A", fontSize: 13 }}>
                  尚無歷史紀錄。今日卡建立後會顯示在這裡。
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </LineMemberLayout>
  );
}
