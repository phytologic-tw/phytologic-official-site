import React from "react";
import { Lock, MessageCircle } from "lucide-react";
import LineQRCode from "./LineQRCode";

const lineUrl = import.meta.env.VITE_LINE_OA_URL || import.meta.env.VITE_LINE_OFFICIAL_URL || import.meta.env.VITE_LINE_CTA_URL || "https://lin.ee/YpVA4C8";

export default function UnlockFullReportCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#D8C99C]/80 bg-[#123828] p-6 text-white shadow-xl shadow-[#123828]/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,201,156,.22),transparent_45%)]" />
      <div className="relative grid gap-5 md:grid-cols-[1fr_112px] md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-[#D8C99C]">
            <Lock className="h-4 w-4" /> 完整報告已鎖定
          </div>
          <h4 className="text-2xl font-semibold">加入官方 LINE 解鎖完整 AI 健康報告</h4>
          <p className="mt-3 leading-7 text-white/70">七大系統分析、完整生活建議、飲品推薦與 AI 個人化分析會在 LINE 會員體驗中開放。</p>
          <a href={lineUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#06C755] px-6 py-3 font-semibold text-white transition hover:bg-[#05B64D]">
            <MessageCircle className="h-4 w-4" /> 立即加入 LINE
          </a>
        </div>
        <LineQRCode className="mx-auto w-28" />
      </div>
    </div>
  );
}
