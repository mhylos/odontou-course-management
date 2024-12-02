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
        edit: "#d6a419",
        delete: "#c55b70",
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
  
};
export default config;
