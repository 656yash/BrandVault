/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CDB4DB',
        'pink-soft': '#FFC8DD',
        'pink-rose': '#FFAFCC',
        'blue-sky': '#BDE0FE',
        'blue-soft': '#A2D2FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'adwise-gradient': 'linear-gradient(135deg, #CDB4DB 0%, #FFC8DD 25%, #FFAFCC 50%, #BDE0FE 75%, #A2D2FF 100%)',
        'adwise-btn': 'linear-gradient(135deg, #FFAFCC, #A2D2FF)',
        'adwise-sidebar': 'linear-gradient(180deg, #CDB4DB, #A2D2FF)',
      },
    },
  },
  plugins: [],
}
