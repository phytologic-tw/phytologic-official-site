import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import LineMemberLayout from "./LineMemberLayout";
import { getNumberCardTheme } from "../../lib/numberCardTheme";

const CARD_CATEGORIES = [
  { id: "food", label: "食", title: "今日飲食能量" },
  { id: "clothing", label: "衣", title: "今日穿著頻率" },
  { id: "living", label: "住", title: "今日居住場域" },
  { id: "movement", label: "行", title: "今日行動節奏" },
  { id: "learning", label: "育", title: "今日學習養分" },
  { id: "joy", label: "樂", title: "今日愉悅能量" },
];

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function formatToday() {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
  }).format(new Date());
}

export default function LineCardsPage({ route, go }) {
  const [member] = useState(readStoredMember);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawingCategory, setDrawingCategory] = useState("");
  const [flippingCategory, setFlippingCategory] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const cardsByCategory = useMemo(
    () => Object.fromEntries(cards.map((card) => [card.category, card])),
    [cards]
  );

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
        const response = await fetch("/api/member?resource=number-card-today", {
          headers: { "x-line-user-id": storedMember.line_user_id },
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "today_cards_failed");
        setCards(result.cards || []);
      } catch (error) {
        console.error("[LineCardsPage] load failed:", error);
        setErrorMsg("今日卡牌暫時無法載入，請稍後再試。");
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [go]);

  if (!member?.line_user_id) return null;

  async function drawCategory(category) {
    const existing = cardsByCategory[category];
    if (existing) {
      go(`/line/cards/detail/${existing.id}`);
      return;
    }

    setErrorMsg("");
    setDrawingCategory(category);
    setFlippingCategory(category);
    try {
      const response = await fetch("/api/member?resource=number-card-draw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-line-user-id": member.line_user_id,
        },
        body: JSON.stringify({ category }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "draw_failed");

      setCards((current) => {
        const withoutCategory = current.filter((card) => card.category !== result.card.category);
        return [...withoutCategory, result.card].sort((a, b) => {
          const aIndex = CARD_CATEGORIES.findIndex((item) => item.id === a.category);
          const bIndex = CARD_CATEGORIES.findIndex((item) => item.id === b.category);
          return aIndex - bIndex;
        });
      });
    } catch (error) {
      console.error("[LineCardsPage] draw failed:", error);
      setErrorMsg("這張卡暫時無法翻開，請稍後再試。");
    } finally {
      setDrawingCategory("");
      window.setTimeout(() => setFlippingCategory(""), 620);
    }
  }

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <style>{`
        .number-card-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .number-card-slot {
          aspect-ratio: 3 / 4;
          border: 0;
          padding: 0;
          background: transparent;
          perspective: 900px;
          font-family: 'Noto Serif TC', Georgia, serif;
          cursor: pointer;
        }
        .number-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.58s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .number-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .number-card-face {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          overflow: hidden;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .number-card-back {
          background: #2D5016;
          border: 1px solid rgba(201,169,110,0.36);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 8px;
        }
        .number-card-back::before,
        .number-card-front::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, rgba(201,169,110,0.055) 0px, rgba(201,169,110,0.055) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(60deg, rgba(201,169,110,0.055) 0px, rgba(201,169,110,0.055) 1px, transparent 1px, transparent 20px);
          pointer-events: none;
        }
        .number-card-front {
          transform: rotateY(180deg);
          border: 1px solid rgba(201,169,110,0.28);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 14px;
        }
        .number-card-face-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

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
        <span style={{ fontSize: 12, color: "#8A9A6A" }}>{formatToday()}</span>
      </header>

      <div style={{ padding: "0 20px 28px" }}>
        <section style={{ marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#5A6A4A" }}>
            今日已翻 <strong style={{ color: "#C9A96E" }}>{cards.length}</strong> / 6 張。點擊任一面向翻開今日數字。
          </p>
        </section>

        {loading ? (
          <div style={{ minHeight: 260, display: "grid", placeItems: "center", color: "#3D5A30", gap: 10 }}>
            <Loader2 size={28} className="animate-spin" />
            <p style={{ margin: 0, fontSize: 13 }}>讀取今日卡牌</p>
          </div>
        ) : (
          <>
            {errorMsg ? (
              <div style={{ marginBottom: 12, border: "1px solid #F0CACA", borderRadius: 12, padding: 12, color: "#A34848", background: "#FFF" }}>
                {errorMsg}
              </div>
            ) : null}

            <section className="number-card-grid">
              {CARD_CATEGORIES.map((category) => {
                const card = cardsByCategory[category.id];
                const isDrawing = drawingCategory === category.id;
                const isFlipped = Boolean(card) || flippingCategory === category.id;
                const theme = getNumberCardTheme(card?.card_number);

                return (
                  <button
                    key={category.id}
                    type="button"
                    className="number-card-slot"
                    disabled={isDrawing}
                    onClick={() => drawCategory(category.id)}
                    aria-label={`${category.label} ${card ? `第 ${card.card_number} 號` : "尚未翻開"}`}
                  >
                    <div className={`number-card-inner ${isFlipped ? "flipped" : ""}`}>
                      <div className="number-card-face number-card-back">
                        <div className="number-card-face-content">
                          {isDrawing ? (
                            <Loader2 size={28} className="animate-spin" color="rgba(255,255,255,0.75)" />
                          ) : (
                            <p style={{ margin: 0, fontSize: 52, lineHeight: 1, color: "#C9A96E", fontWeight: 700 }}>?</p>
                          )}
                          <p style={{ margin: "10px 0 2px", fontSize: 18, fontWeight: 700 }}>{category.label}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.68)" }}>{category.title}</p>
                        </div>
                      </div>
                      <div
                        className="number-card-face number-card-front"
                        style={{ background: theme.bg, color: theme.fg, borderColor: theme.border }}
                      >
                        <div className="number-card-face-content">
                          <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{category.label}</p>
                          <p style={{ margin: "10px 0", fontSize: 82, lineHeight: 0.95, fontWeight: 700, color: theme.accent }}>
                            {card?.card_number || "?"}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, opacity: 0.76 }}>{card ? "查看詳細" : "翻牌中"}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </section>
          </>
        )}
      </div>
    </LineMemberLayout>
  );
}
