/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F7F4ED", // 温暖纸白，主背景
          pure: "#FFFFFF", // 纯白，代码区/卡片
          warm: "#EFEAE0", // 略深纸色，分区
          deep: "#E6E0D3", // 更深，分割
        },
        ink: {
          DEFAULT: "#1A1A18", // 近黑，主文字
          soft: "#5C5A52", // 次级文字
          mute: "#9A988F", // 弱化文字
          faint: "#C2BFB5", // 极弱
        },
        vermillion: {
          DEFAULT: "#E2451C", // 锻造朱，主强调
          deep: "#B8350F",
          soft: "#F2C3B5",
          tint: "#FAE6DF",
        },
        prussian: {
          DEFAULT: "#1B3A6B", // 普鲁士蓝，链接/信息
          deep: "#0F2545",
          soft: "#C7D2E0",
          tint: "#E8EDF5",
        },
        forest: {
          DEFAULT: "#2E6B2E", // 深绿，成功/diff add
          tint: "#E6EFE3",
        },
        line: {
          subtle: "rgba(26,26,24,0.10)",
          DEFAULT: "rgba(26,26,24,0.16)",
          strong: "rgba(26,26,24,0.28)",
          accent: "rgba(226,69,28,0.40)",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        meta: "0.14em",
      },
      boxShadow: {
        page: "0 1px 0 rgba(26,26,24,0.06), 0 24px 60px -32px rgba(26,26,24,0.18)",
        card: "0 1px 0 rgba(26,26,24,0.05), 0 8px 24px -16px rgba(26,26,24,0.12)",
        float: "0 24px 60px -28px rgba(26,26,24,0.22)",
        inset: "inset 0 0 0 1px rgba(26,26,24,0.12)",
      },
      backgroundImage: {
        "paper-grid":
          "linear-gradient(to right, rgba(26,26,24,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,26,24,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
        "draw-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "float-soft": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.05s steps(1) infinite",
        "draw-line": "draw-line 1s cubic-bezier(0.22,1,0.36,1) forwards",
        "float-soft": "float-soft 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
