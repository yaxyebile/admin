module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fb923c', // orange-400
          light: '#fdba74',  // orange-300
          dark: '#ea580c',   // orange-600
        },
      },
      fontFamily: {
        sans: ['Mada', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 