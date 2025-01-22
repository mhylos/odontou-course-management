import type { Config } from "tailwindcss";
import { addDynamicIconSelectors } from "@iconify/tailwind";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004C93",
        secondary: "#0078B6",
      },
      keyframes: {
        "sideform-slide-in": {
          "0%": {
            right: "-100%",
          },
          "100%": {
            right: "0",
          },
        },
        "sideform-slide-out": {
          "0%": {
            right: "0",
          },
          "100%": {
            right: "-100%",
          },
        },
      },
      animation: {
        "sideform-slide-in": "sideform-slide-in 0.3s forwards",
        "sideform-slide-out": "sideform-slide-out 0.3s forwards",
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};
export default config;
