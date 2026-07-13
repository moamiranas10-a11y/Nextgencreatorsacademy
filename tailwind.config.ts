import type { Config } from "tailwindcss";

// Brand palette: warm gold/bronze — distinct from generic blue/violet SaaS
// defaults, ties into "premium academy" positioning for Urdu creators.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FBF6EC",
          100: "#F5E9CE",
          200: "#EAD09C",
          300: "#DEB66A",
          400: "#D19E45",
          500: "#B98330",
          600: "#9C6B26",
          700: "#7D551F",
          800: "#5F4118",
          900: "#4A3313",
          950: "#2B1D0A",
        },
      },
      backgroundImage: {
        "path-gradient": "linear-gradient(90deg, #D19E45 0%, #22D3AA 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
