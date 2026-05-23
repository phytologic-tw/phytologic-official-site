// src/pages/line/LineMemberLayout.jsx
// 所有 /line/* 頁面共用的 Layout：頂部品牌欄 + 底部導航列

import React from "react";

const logo = "/logo.png";

const NAV_ITEMS = [
  { path: "/line/today",      label: "今日",   icon: "☀️" },
  { path: "/line/assessment", label: "分析",   icon: "🌿" },
  { path: "/line/checkin",    label: "飲用",   icon: "✓"  },
  { path: "/line/profile",    label: "我的",   icon: "⊙"  },
  { path: "/line/tasks",      label: "任務",   icon: "◈"  },
];

export default function LineMemberLayout({ children, route, go, member }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      {/* 頂部品牌欄 */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-brand-border-warm bg-white/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <img src={logo} alt="植本邏輯" className="h-7 w-7 object-contain" />
          <span className="text-sm font-semibold tracking-wide text-brand-dark">植本邏輯</span>
        </div>
        {member && (
          <div className="flex items-center gap-2">
            {member.picture_url && (
              <img
                src={member.picture_url}
                alt={member.display_name}
                className="h-7 w-7 rounded-full object-cover"
              />
            )}
            <div className="text-right">
              <p className="text-xs font-medium text-brand-dark">{member.display_name || "會員"}</p>
              <p className="text-[10px] text-brand-gold-deep">{member.level || "L1"} {member.title}</p>
            </div>
          </div>
        )}
      </header>

      {/* 主要內容 */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* 底部導航列（仿 Rich Menu）*/}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border-warm bg-white/95 backdrop-blur-sm">
        <div className="grid grid-cols-5">
          {NAV_ITEMS.map(({ path, label, icon }) => {
            const isActive = route === path;
            return (
              <button
                key={path}
                onClick={() => go(path)}
                className={`flex flex-col items-center justify-center py-2 text-xs transition ${
                  isActive
                    ? "text-brand-dark"
                    : "text-brand-gold-deep"
                }`}
              >
                <span className={`mb-0.5 text-lg leading-none ${isActive ? "opacity-100" : "opacity-60"}`}>
                  {icon}
                </span>
                <span className={`text-[10px] font-medium ${isActive ? "text-brand-dark" : "text-[#9A8C68]"}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="mt-0.5 h-0.5 w-4 rounded-full bg-brand-dark" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
