/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-bg": "#23273e",
        "dark-accent": "#2f343f",
        "secondary": "#353c4a",
        "accent": "#3e4452",
      },
    },
  },
  plugins: [],
};
