// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f9f506",
        "primary-hover": "#e6e205",
        "background-light": "#f8f8f5",
        "background-dark": "#23220f",
        "surface-light": "#ffffff",
        "surface-dark": "#2c2b15",
        "text-main": "#181811",
        "text-muted": "#6b6b60",
        "text-light": "#8c8b5f",
      },
      fontFamily: {
        display: ["SplineSans_700Bold"],
        body: ["NotoSans_400Regular"],
      },
    },
  },
  plugins: [],
};