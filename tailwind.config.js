/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#FDF8F3', // Warm Cream Background
          300: '#F5EFE6',
          400: '#EADFCF',
          500: '#CDBCA7',
          900: '#1C1917',
        },
        brand: {
          yellow: '#FFD54A',
          blue: '#4DA6FF',
          magenta: '#FF4FA3',
          lavender: '#C9A6FF',
          pearl: '#FAFAF8',
          silver: '#E8ECF2',
          noir: '#121110',
          charcoal: '#22201D',
          muted: '#8A857D',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Didot', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Cinzel', 'Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'silver-metallic': 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 50%, #94A3B8 100%)',
        'gold-metallic': 'linear-gradient(135deg, #FFF6D6 0%, #FFD54A 50%, #E6AF14 100%)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
