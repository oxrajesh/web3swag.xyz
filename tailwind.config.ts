import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fire code"],
      },
      fontSize: {
        sm: "0.875rem", // 14px
        base: "1rem", // 16px (default)
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
      },
      colors: {
        dark: {
          DEFAULT: "#008080", // Set the default dark mode background color
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
export default config;
