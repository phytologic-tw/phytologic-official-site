import React from "react";
import { MessageCircle } from "lucide-react";
import { handleOpenLine } from "./lineConfig";

export default function FloatingLineButton() {
  return (
    <button
      type="button"
      onClick={handleOpenLine}
      aria-label="加入植本邏輯官方 LINE"
      className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full border border-[#A8BFA5]/70 bg-[#5F8F68]/88 text-[#F8F4EC] shadow-[0_18px_38px_rgba(60,82,62,0.18)] backdrop-blur-md transition duration-500 ease-out hover:-translate-y-px hover:bg-[#527F5B] md:hidden"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}
