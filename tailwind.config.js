export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // 主色
          dark: "#1C3D2B",
          mid: "#49675A",
          muted: "#7D8D7F",
          nav: "#355548",

          // 強調色
          gold: "#C8A96E",
          "gold-deep": "#B89B5E",
          "gold-warm": "#D8C99C",

          // 背景與介面
          bg: "#F9F5EA",
          surface: "#FDFBF6",
          "surface-2": "#F5F2EB",
          border: "#E5E0D5",
          "border-warm": "#E7DDBF",
          "border-gold": "#D8C99C",

          // 錯誤 / 警告
          error: "#9A3C2D",
          "error-bg": "#FFF7F5",
          "error-border": "#E8B4A8",
        },
        line: {
          DEFAULT: "#06C755",
          hover: "#05B64D",
        },
      },
      letterSpacing: {
        "brand-wide": "0.18em",
        "brand-wider": "0.24em",
        "brand-widest": "0.35em",
      },
    },
  },
  plugins: [],
};
