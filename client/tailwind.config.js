/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F2',
        card: '#FDFBF7',
        ink: '#4A3B32',
        'ink-soft': '#8a7a6d',
        'ink-faint': '#c9b9ac',
        matcha: { DEFAULT: '#E2F0D9', deep: '#9CC08A', text: '#5c7a4d' },
        sakura: { DEFAULT: '#FCE4E6', deep: '#E8A6AD', text: '#b06770' },
        lavender: { DEFAULT: '#E8DAEF', deep: '#B99CD0', text: '#7a5a95' },
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        mochi: '20px',
        'mochi-lg': '24px',
      },
      boxShadow: {
        soft: '0 6px 20px rgba(74, 59, 50, 0.07)',
        'soft-lg': '0 10px 30px rgba(74, 59, 50, 0.08)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        squish: {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(0.75, 1.2)' },
          '60%': { transform: 'scale(1.15, 0.85)' },
          '100%': { transform: 'scale(1)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.85) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        squish: 'squish 0.35s cubic-bezier(.34,1.56,.64,1)',
        'pop-in': 'popIn 0.35s cubic-bezier(.34,1.56,.64,1)',
      },
    },
  },
  plugins: [],
};
