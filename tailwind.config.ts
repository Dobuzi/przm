import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        sky: "#dbeafe",
        ocean: "#0f4c81",
        riskLow: "#c7f9cc",
        riskMedium: "#f4d35e",
        riskHigh: "#ee6c4d",
        surface: "#f8fafc",
      },
      boxShadow: {
        panel: "0 18px 48px rgba(15, 23, 42, 0.14)",
      },
      fontFamily: {
        sans: ["'IBM Plex Sans KR'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

