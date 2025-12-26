/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#F97316",
        "primary-hover": "#EA580C",
        "frontier-black": "#050505",
        "frontier-dark": "#0F0F0F",
        "frontier-card": "#18181b",
        "terminal-green": "#4ade80",
      },
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #374151 1px, transparent 1px), linear-gradient(to bottom, #374151 1px, transparent 1px)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
