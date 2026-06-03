export const NUMBER_CARD_THEME = {
  1: { name: "米白色", bg: "#F5F0E8", fg: "#1A2F15", accent: "#C9A96E", border: "rgba(201,169,110,0.42)" },
  2: { name: "植本綠", bg: "#2D5016", fg: "#FFFFFF", accent: "#C9A96E", border: "rgba(201,169,110,0.34)" },
  3: { name: "玫瑰紅", bg: "#C4607A", fg: "#FFFFFF", accent: "#F2D8DE", border: "rgba(242,216,222,0.52)" },
  4: { name: "金黃色", bg: "#D8B07A", fg: "#1A2F15", accent: "#FFF6D6", border: "rgba(120,85,30,0.25)" },
  5: { name: "紫莓色", bg: "#6E4A7E", fg: "#FFFFFF", accent: "#E7D7EF", border: "rgba(231,215,239,0.45)" },
  6: { name: "深森綠", bg: "#1A2F15", fg: "#FFFFFF", accent: "#C9A96E", border: "rgba(201,169,110,0.4)" },
  7: { name: "棕金色", bg: "#8A6A3F", fg: "#FFFFFF", accent: "#F0D8A8", border: "rgba(240,216,168,0.44)" },
  8: { name: "灰藍色", bg: "#607586", fg: "#FFFFFF", accent: "#DDE8EE", border: "rgba(221,232,238,0.48)" },
  9: { name: "墨綠色", bg: "#0E3A2D", fg: "#FFFFFF", accent: "#A9D3BC", border: "rgba(169,211,188,0.42)" },
};

export function getNumberCardTheme(number) {
  return NUMBER_CARD_THEME[Number(number)] || NUMBER_CARD_THEME[1];
}
