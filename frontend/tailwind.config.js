/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          navy: '#0b192c',
          dark: '#1e3e62',
          orange: '#ff6500',
          accent: '#000000',
          gold: '#f59e0b',
          emerald: '#10b981',
          crimson: '#ef4444',
          slate: '#334155'
        }
      }
    },
  },
  plugins: [],
}
