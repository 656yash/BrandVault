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
          950: '#030305',
          900: '#070709',
          850: '#0a0a0f',
          800: '#101016',
          750: '#15151e',
          700: '#1b1b26',
          600: '#262635',
        },
        silver: {
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'dot-matrix': 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
        'chrome-sheen': 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 45%, #94a3b8 70%, #475569 100%)',
        'silver-glow': 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
        'glass-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
    },
  },
  plugins: [],
}
