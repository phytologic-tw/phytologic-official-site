const LINE_PLACEHOLDER = "https://lin.ee/REPLACE_WITH_REAL_LINE_URL";

export const LINE_OFFICIAL_URL =
  import.meta.env.VITE_LINE_OA_URL ||
  import.meta.env.VITE_LINE_OFFICIAL_URL ||
  import.meta.env.VITE_LINE_CTA_URL ||
  LINE_PLACEHOLDER;

export function handleOpenLine() {
  if (LINE_OFFICIAL_URL === LINE_PLACEHOLDER) {
    alert("官方 LINE 連結尚未設定，請稍後再試。");
    return;
  }
  window.open(LINE_OFFICIAL_URL, "_blank", "noopener,noreferrer");
}
