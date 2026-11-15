/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spiritual: {
          bg: '#0a0d18',
          card: '#11162b',
          border: '#232b4e',
          accent: '#8b5cf6',
          gold: '#f59e0b',
          goldLight: '#fde68a',
          neonCyan: '#06b6d4',
          neonPink: '#ec4899',
          danger: '#ef4444',
          success: '#10b981'
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.6))' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 5px rgba(139, 92, 246, 0.4))' },
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0) rotate(-1deg)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0) rotate(2deg)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0) rotate(-4deg)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0) rotate(4deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
