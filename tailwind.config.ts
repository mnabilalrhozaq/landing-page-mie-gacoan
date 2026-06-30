import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C2547A",   // Pink Magenta — heading, CTA
        secondary: "#4DC8D0", // Tosca — accent, divider
        accent: "#F0D050",    // Kuning — ornamen dekoratif
        dark: "#1a1a2e",      // Navy dark — footer, admin sidebar
        light: "#fafafa",     // Background section alternatif
      },
      fontFamily: {
        heading: ["var(--font-amatic)", "cursive"],
        body: ["var(--font-jakarta)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
