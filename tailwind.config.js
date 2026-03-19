/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "unc-blue": "#0D2B6E",
        "unc-blue-light": "#1A3E8F",
        "unc-green": "#10B981",
      },
    },
  },
  plugins: [],
};