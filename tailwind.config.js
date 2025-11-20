
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D1117',
        "card-background": '#161B22',
        "border-color": '#30363D',
        "text-primary": '#C9D1D9',
        "text-secondary": '#8B949E',
        "primary-button-bg": '#2F81F7',
        "primary-button-hover-bg": '#3C8BFF',
        "primary-button-text": '#FFFFFF',
        "accent-bg": '#F7782F',
        "accent-hover-bg": '#FF8533',
        "accent-text": '#FFFFFF',
        "success-color": '#28a745',
        "error-color": '#dc3545',
      },
      fontFamily: {
        sans: ['"SF Pro"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      borderRadius: {
        'lg': '0.5rem', // Example: larger radius for buttons and cards
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-font-inter')
  ],
};
