/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-bg": "#282c34",

            // "main-bg":"#002b36",
        "dark-accent": "#2f343f",
        "secondary": "#353c4a",
        "accent": "#3e4452",
        "accent2": "#2c313a",
        "dark-bg": "#1e2227"
      },
    },
  },
  plugins: [],
};
