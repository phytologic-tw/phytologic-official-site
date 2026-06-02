import React from "react";
import LineMemberLayout from "./LineMemberLayout";

const PRODUCTS = [
  { id: "green-latte", name: "植本綠拿鐵 經典款", tag: "Green Latte · 植本主力", emoji: "🍵" },
  { id: "energy-boost", name: "能量植萃 升級版", tag: "Energy · 機能強化", emoji: "🌺" },
  { id: "detox", name: "植本淨化 排毒力", tag: "Detox · 機能淨化", emoji: "🍃" },
  { id: "sleep", name: "深眠植物飲", tag: "Sleep · 夜間修復", emoji: "🌙" },
];

function readStoredMember() {
  try {
    const stored = sessionStorage.getItem("line_member");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function EncyclopediaListPage({ route, go }) {
  const member = readStoredMember();

  return (
    <LineMemberLayout route={route} go={go} member={member}>
      <div style={{ background: "#F9F5EA", minHeight: "100dvh" }}>
        <button
          type="button"
          onClick={() => go("/line/member-home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "16px 20px 12px",
            border: 0,
            background: "transparent",
            cursor: "pointer",
            fontFamily: "'Noto Serif TC', Georgia, serif",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A30" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span style={{ fontSize: 14, color: "#3D5A30", fontWeight: 600 }}>返回首頁</span>
        </button>

        <div style={{ background: "#2D5016", padding: "20px 20px 24px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "white" }}>植本百科</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
            每一款產品背後的植化素科學與原料故事
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px 20px" }}>
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => go(`/line/encyclopedia/${product.id}`)}
              style={{
                background: "white",
                border: 0,
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                textAlign: "left",
                fontFamily: "'Noto Serif TC', Georgia, serif",
              }}
            >
              <div style={{
                height: 100,
                background: "#E8F0E0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
              }}>
                {product.emoji}
              </div>
              <div style={{ padding: "10px 12px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A2F15", lineHeight: 1.35 }}>{product.name}</div>
                <div style={{ fontSize: 10, color: "#8A9A6A", marginTop: 2 }}>{product.tag}</div>
                <div style={{
                  display: "inline-block",
                  background: "#E8F0E0",
                  color: "#3D5A30",
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 999,
                  marginTop: 6,
                }}>
                  📖 百科可覽
                </div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ height: "calc(16px + env(safe-area-inset-bottom))" }} />
      </div>
    </LineMemberLayout>
  );
}
