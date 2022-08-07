const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        md1: "1005px",
        xl: "1310px",
        xl1: "1278px",
        xl2: "1400px",
        xl3: "1669px",
        ...defaultTheme.screens,
      },
    },
  },
};
