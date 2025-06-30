/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Dark theme colors
        'dark': {
          '100': '#1a1c23',
          '200': '#121317',
          '300': '#0d0e11',
        },
        // Accent colors
        'primary': {
          '50': '#e6f8fa',
          '100': '#b3eaef',
          '500': '#00b8cc',
          '600': '#009fb0',
          '700': '#007a87',
        },
        'alert': {
          'low': '#4caf50',
          'medium': '#ff9800',
          'high': '#f44336',
          'critical': '#9c27b0',
        },
        'chart': {
          'blue': '#0088FE',
          'green': '#00C49F',
          'yellow': '#FFBB28',
          'orange': '#FF8042',
          'purple': '#8884d8',
          'red': '#FF4560',
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
