import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)"
      },
      colors: {
        // Mood color scale (low to high)
        "mood": {
          low: "hsl(var(--mood-low) / <alpha-value>)",
          "low-mid": "hsl(var(--mood-low-mid) / <alpha-value>)",
          mid: "hsl(var(--mood-mid) / <alpha-value>)",
          "mid-high": "hsl(var(--mood-mid-high) / <alpha-value>)",
          high: "hsl(var(--mood-high) / <alpha-value>)"
        },
        // Glass surface colors
        "surface": {
          10: "rgba(255, 255, 255, 0.10)",
          15: "rgba(255, 255, 255, 0.15)",
          20: "rgba(255, 255, 255, 0.20)"
        }
      }
    }
  },
  plugins: []
};

export default config;
