// src/pages/line/LineMemberLayout.jsx
// 所有 /line/* 頁面共用的 Layout（底部導覽列已移除）

import React from "react";
import { Bell } from "lucide-react";

const logo = "/logo.png";

export default function LineMemberLayout({ children, route, go, member }) {
  const displayName = member?.display_name || member?.line_display_name || "會員";
  const levelNum = String(member?.level || "L1").replace(/[^0-9]/g, "") || "1";

  return (
    <div style={{
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      background: "#F5F0E8",
      fontFamily: "'Noto Serif TC', Georgia, serif",
    }}>
      {/* Zone 1 — Header */}
      <header style={{
        flexShrink: 0,
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        background: "#F5F0E8",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src={logo} alt="植本邏輯" style={{ height: "28px", width: "28px", objectFit: "contain" }} />
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#1A2F15" }}>植本邏輯</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            type="button"
            style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", lineHeight: 0 }}
          >
            <Bell size={20} color="#1A2F15" strokeWidth={1.8} />
          </button>
          <div style={{ position: "relative" }}>
            {member?.picture_url ? (
              <img
                src={member.picture_url}
                alt={displayName}
                style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  objectFit: "cover", border: "2px solid #C9A96E", display: "block",
                }}
              />
            ) : (
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#E8F0E0", border: "2px solid #C9A96E",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 600, color: "#3D5A30",
              }}>
                {displayName.charAt(0)}
              </div>
            )}
            <span style={{
              position: "absolute", bottom: "-2px", right: "-3px",
              background: "#C9A96E", color: "#fff",
              fontSize: "9px", fontWeight: 700,
              borderRadius: "999px", padding: "1px 4px",
              lineHeight: "14px", minWidth: "18px", textAlign: "center",
              border: "1.5px solid #F5F0E8",
            }}>
              L{levelNum}
            </span>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {children}
      </main>
    </div>
  );
}
