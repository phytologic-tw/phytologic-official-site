const LINE_FALLBACK_URL = "https://lin.ee/YpVA4C8";

export const LINE_OFFICIAL_URL =
  import.meta.env.VITE_LINE_OA_URL ||
  import.meta.env.VITE_LINE_OFFICIAL_URL ||
  import.meta.env.VITE_LINE_CTA_URL ||
  LINE_FALLBACK_URL;

export function handleOpenLine() {
  if (!LINE_OFFICIAL_URL) {
    alert("官方 LINE 連結尚未設定，請稍後再試。");
    return;
  }
  window.open(LINE_OFFICIAL_URL, "_blank", "noopener,noreferrer");
}
