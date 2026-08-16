const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map grays to deep teals/slate for the "Ethereal Frost" background
        gray: {
          ...colors.slate,
          800: '#0f3f4a', // Dark Teal for cards
          900: '#062029', // Deep Teal for backgrounds
          950: '#021319', // Almost black teal
        },
        // Map greens/emeralds to Ice White / Mint Green
        green: colors.teal,
        emerald: colors.cyan,
        // Map purples/blues to cool icy tones
        purple: colors.sky,
        blue: colors.cyan,
        red: colors.rose,
      }
    },
  },
  plugins: [],
}
