const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...fontFamily.sans],
        display: ["Manrope", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#00334d",
          container: "#004b6e",
        },
        secondary: {
          DEFAULT: "#006a6a",
          container: "#007a7a",
        },
        surface: {
          DEFAULT: "#f7f9ff",
          variant: "#dfe3e8",
          lowest: "#ffffff",
          low: "#f1f4fa",
          high: "#ebeef4",
          highest: "#dfe3e8",
        },
        "on-surface": "#181c20",
        "on-surface-variant": "#43474e",
        outline: {
          DEFAULT: "#71787f",
          variant: "#c1c7cf",
        },
        semantic: {
          emerald: "#10b981",
          lime: "#84cc16",
          blue: "#3b82f6",
          orange: "#f97316",
          crimson: "#ef4444",
        },
      },
      borderRadius: {
        DEFAULT: "8px",
        secondary: "4px",
        container: "12px",
        md: "6px",
        sm: "2px",
      },
      boxShadow: {
        ambient: "0 32px 64px -12px rgba(0, 51, 77, 0.06)",
        card: "0 8px 24px -8px rgba(0, 51, 77, 0.08)",
      },
      spacing: {
        "form-field": "24px",
        section: "32px",
      },
    },
  },
  plugins: [],
};
