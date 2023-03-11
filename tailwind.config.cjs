/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-bg": "#282c34",
        "dark-accent": "#2f343f",
        "secondary": "#353c4a",
        "accent": "#3e4452",
        "accent2": "#2c313a",
        "dark-bg": "#1e2227",
        "light-bg": "#23272e",
        "blue-accent": "#4e85b4",
        "blue-accent-light": "#60a3dd",
      },
    },
  },
  plugins: [],
};
