import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-mode="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@cloudflare/kumo/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      colors: {
        kumo: {
          canvas: "var(--kumo-canvas)",
          base: "var(--kumo-base)",
          elevated: "var(--kumo-elevated)",
          recessed: "var(--kumo-recessed)",
          control: "var(--kumo-control)",
          tint: "var(--kumo-tint)",
          line: "var(--kumo-line)",
          hairline: "var(--kumo-hairline)",
          default: "var(--kumo-default)",
          subtle: "var(--kumo-subtle)",
          strong: "var(--kumo-strong)",
          brand: "#F6821F",
          "brand-hover": "#e57416",
        },
      },
      lineHeight: {
        lh: "1.4",
      },
    },
  },
  plugins: [],
};

export default config;
