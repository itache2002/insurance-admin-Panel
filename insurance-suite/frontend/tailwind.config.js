/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter','ui-sans-serif','system-ui'] },
      colors: {
        bg: '#0b0f14',
        card: '#0f172a',
        border: '#1f2937',
        accent: '#60a5fa',
        accent2: '#34d399'
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0,0,0,.35)',
        glow: '0 0 0 3px rgba(96,165,250,.2)'
      },
      backgroundImage: {
        'grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.05) 1px, transparent 0)',
        'grad-1': 'linear-gradient(135deg, rgba(96,165,250,.15), rgba(52,211,153,.08))'
      }
    },
  },
  plugins: [],
}
