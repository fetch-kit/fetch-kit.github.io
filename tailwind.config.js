/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{njk,md,html,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f2f7fa',
          100: '#dce7ee',
          200: '#b7cad7',
          300: '#89a6bc',
          400: '#6387a4',
          500: '#3f6b89',
          600: '#2f5169',
          700: '#20384b',
          800: '#132432',
          900: '#0a141f'
        },
        accent: {
          400: '#2fd4c2',
          500: '#18bfae',
          600: '#129889'
        }
      }
    }
  },
  plugins: []
};
