/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#274991',      // Bleu marine
        'secondary': '#3C83C4',    // Bleu ciel
        'accent': '#66C7C7',       // Turquoise/Menthe
        'background': '#F5F5F5',   // Blanc/Gris très clair
        'neutral': '#D9D9D9',      // Gris clair
        'dark': '#333333',         // Noir/Gris foncé
        'sand': '#E0C9A6',         // Beige/Sable
        'coral': '#FF7F50',        // Orange/Corail
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
