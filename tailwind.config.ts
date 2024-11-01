import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: "true",
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        "13": "0.8125rem",
        "14": "0.875rem",
        "16": "1rem",
        "18": "1.125rem",
        "20": "1.25rem",
        "24": "1.5rem",
        "32": "2rem",
      },
      lineHeight: {
        "20": "1.25rem",
        "24": "1.5rem",
        "28": "1.75rem",
        "36": "2.25rem",
      },
      fontWeight: {
        "300": "300",
        "400": "400",
        "500": "500",
        "600": "600",
        "700": "700",
      },
      boxShadow: {
        "card-shadow": "0px 6px 18px 0px #0000000F",
      },
      colors: {
        primary: "#206FB6",
        "primary-light": "#9774FA",
        secondary: "#41CFB7",
        background: "#FAFBFF",
        error: "#F6220E",
        warning: "#F7A809",
        "light-blue": {
          "50": "#E7F2FE",
          "100": "#CFE4FD",
          "200": "#9FCAFB",
          "300": "#6FAFF9",
          "400": "#3F95F7",
          "500": "#0F7AF5",
          "600": "#0C62C5",
          "700": "#063265",
          "800": "#063265",
          "900": "#101828",
        },
        blue: {
          "50": "#E9F9FF",
          "100": "#CFE4FD",
          "200": "#9FCAFB",
          "300": "#6FAFF9",
          "400": "#3F95F7",
          "500": "#0F7AF5",
          "600": "#0C62C5",
          "700": "#063265",
          "800": "#063265",
          "900": "#101828",
        },
        "neutral-gray": {
          "50": "#F9FAFB",
          "100": "#F2F4F7",
          "200": "#EAECF0",
          "300": "#D0D5DD",
          "400": "#98A2B3",
          "500": "#667085",
          "600": "#475467",
          "700": "#344054",
          "800": "#1D2939",
          "900": "#101828",
        },
        black: {
          default: "#050E16",
          "50": "#FBFBFB",
          "100": "#F2F4F7",
          "200": "#EAECF0",
          "300": "#D0D5DD",
          "400": "#A0A4AD",
          "500": "#667085",
          "600": "#585C67",
          "700": "#344054",
          "800": "#2D3340",
          "900": "#171B26",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
