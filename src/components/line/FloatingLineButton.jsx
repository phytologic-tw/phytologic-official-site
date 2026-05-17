import React from "react";
import { MessageCircle } from "lucide-react";

const lineUrl = import.meta.env.VITE_LINE_OA_URL || import.meta.env.VITE_LINE_OFFICIAL_URL || import.meta.env.VITE_LINE_CTA_URL || "https://lin.ee/YpVA4C8";

export default function FloatingLineButton() {
  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="加入植本邏輯官方 LINE"
      className="fixed bottom-5 right-5 z-[70] flex h-16 w-16 items-center justify-center rounded-full bg-[#06C755] text-white shadow-2xl shadow-[#06C755]/30 transition hover:-translate-y-1 hover:scale-105 md:hidden"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
