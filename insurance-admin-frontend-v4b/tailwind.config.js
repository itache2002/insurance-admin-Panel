/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A237E',
        accent: '#FFD740',
        bg: '#0B1020',
        card: '#121936',
        muted: '#8FA3BF',
        success: '#22c55e',
        danger: '#ef4444'
      },
      boxShadow: { soft: '0 10px 30px rgba(0,0,0,0.25)' }
    }
  },
  plugins: []
}
