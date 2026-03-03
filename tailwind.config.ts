import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ピックルボールブランドカラー（グリーン＆イエロー）
        "brand-dark": "#064e3b",   // ディープグリーン
        "brand-accent": "#eab308", // アクセントイエロー
        "brand-sub": "#ecfdf5",    // ライトグリーン背景

        // 共通
        "background-light": "#FAFAFA",
        "surface-light": "#FFFFFF",
        "border-light": "#E5E7EB",
        "text-main-light": "#333333",
        "text-sub-light": "#6B7280",

        // カテゴリ別テーマカラー
        "article-primary": "#f59e0b",
        "asset-facility": "#059669",
        "asset-gear": "#2563eb",
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Poppins"', 'sans-serif'],
        display: ['"Inter Tight"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        body: ['"Inter"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    }
  },
  plugins: [],
};
export default config;
