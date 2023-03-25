const konstaConfig = require('konsta/config');
/** @type {import('tailwindcss').Config} */

module.exports = konstaConfig({
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      ios: 'Golos Text, sans-serif',
      material: 'Golos Text, sans-serif',
      sans: ['Golos Text', 'sans-serif'],
    },
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ]
});