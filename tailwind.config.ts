import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        panel: "#121212",
        "panel-2": "#181818",
        "panel-3": "#282828",
        line: "rgba(255,255,255,0.08)",
        accent: "#1ed760",
        accentSoft: "#1db954",
        warning: "#f59e0b"
      },
      boxShadow: {
        glow: "0 8px 24px rgba(0, 0, 0, 0.45)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"],
        display: ["system-ui", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"]
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top, rgba(110,231,183,0.18), transparent 32%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.16), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 24%)"
      }
    }
  },
  plugins: []
};

export default config;
