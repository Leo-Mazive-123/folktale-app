/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // enables class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // for line-clamp-4 in tales preview
  ],
};
