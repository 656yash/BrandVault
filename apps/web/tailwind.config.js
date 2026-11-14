/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#050507',
          900: '#08080a',
          850: '#0d0d11',
          800: '#121217',
          750: '#17171e',
          700: '#1f1f28',
          600: '#2b2b38',
        },
        gold: {
          300: '#fde047',
          400: '#facc15',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'dot-matrix': 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
        'chrome-sheen': 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 45%, #94a3b8 70%, #475569 100%)',
        'gold-sheen': 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
      },
    },
  },
  plugins: [],
}
