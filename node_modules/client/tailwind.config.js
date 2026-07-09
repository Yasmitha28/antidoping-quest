/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d8edff',
          500: '#2f7cff',
          700: '#1a5dc8',
          900: '#123b7a'
        }
      }
    }
  },
  plugins: []
};
