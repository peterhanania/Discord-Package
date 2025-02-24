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
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      gradients: {
        'blue-gradient': ['from-blue-500', 'to-blue-600'],
      },
    },
  },
};
