/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        yellow: 'var(--yellow)',
        green: 'var(--green)',
        red: 'var(--red)',
      },
      fontFamily: {
        sans: ['Pixelify Sans', 'system-ui', 'sans-serif'],
        pixelify: ['Pixelify Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        brutal: '6px 6px 0 #000000',
        brutalSm: '4px 4px 0 #000000',
      },
      borderRadius: {
        brutal: '18px',
      },
      animation: {
        typing: 'typing 1.1s infinite ease-in-out',
      },
      keyframes: {
        typing: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '50%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
