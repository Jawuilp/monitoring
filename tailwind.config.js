/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb',
          dark: '#60a5fa',
        },
        bg: {
          light: '#f8fafc',
          dark: '#18181b',
        },
        card: {
          light: '#fff',
          dark: '#23232b',
        },
        text: {
          light: '#1e293b',
          dark: '#f1f5f9',
        },
        accent: {
          light: '#e0e7ef',
          dark: '#334155',
        }
      }
    },
  },
  plugins: [],
}; 