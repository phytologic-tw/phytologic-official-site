import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import LineQRCode from "./LineQRCode";
import { handleOpenLine } from "./lineConfig";

export default function LineCTA({ compact = false }) {
  return (
    <div className={`border border-brand-border-gold/70 bg-white/70 shadow-xl shadow-brand-dark/10 backdrop-blur ${compact ? "rounded-2xl p-5" : "rounded-[2rem] p-6 md:p-8"}`}>
      <div className="grid gap-6 md:grid-cols-[1fr_132px] md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-line/10 px-4 py-2 text-sm font-semibold text-[#087E3A]">
            <MessageCircle className="h-4 w-4" /> LINE 官方會員
          </div>
          <h3 className={`${compact ? "text-2xl" : "text-3xl md:text-4xl"} font-semibold text-brand-dark`}>加入植本邏輯官方 LINE</h3>
          <p className="mt-3 text-lg font-medium text-[#1E6B43]">解鎖完整 AI 健康分析報告</p>
          <div className="mt-5 grid gap-2 text-sm leading-6 text-brand-mid sm:grid-cols-2">
            <span>✓ 個人化發炎分析</span>
            <span>✓ 專屬植物機能飲推薦</span>
            <span>✓ 每日健康建議</span>
            <span>✓ 最新活動與健康資訊</span>
          </div>
          <button type="button" onClick={handleOpenLine} className="mt-6 inline-flex items-center gap-2 rounded-full bg-line px-7 py-3.5 font-semibold text-white shadow-lg shadow-line/20 transition hover:-translate-y-0.5 hover:bg-line-hover">
            立即加入 LINE <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <LineQRCode className="mx-auto w-32 md:w-full" />
      </div>
    </div>
  );
}
