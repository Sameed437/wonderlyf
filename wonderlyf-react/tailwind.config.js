/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF9F0',
        'cream-dark': '#F5EBD8',
        'cream-light': '#FFFDF8',
        'honey': '#D4940A',
        'honey-light': '#F0C14B',
        'honey-dark': '#8B6914',
        'warm-brown': '#2C1810',
        'warm-gray': '#5C4033',
        'warm-light': '#8B7355',
        'brand-deep': '#2C1810',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'glow': 'glow-pulse 3s ease-in-out infinite',
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(212, 148, 10, 0.08)',
        'warm-lg': '0 8px 40px rgba(212, 148, 10, 0.12)',
        'warm-hover': '0 12px 48px rgba(212, 148, 10, 0.16)',
      },
    },
  },
  plugins: [],
}
