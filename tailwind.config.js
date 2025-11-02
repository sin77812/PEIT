/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-white': '#FFFFFF',
        'text-black': '#000000',
        'text-gray': '#666666',
        'border-light': '#E5E5E5',
        'accent': {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        'political': '#8B5CF6',
        'economic-growth': '#F59E0B',
        'economic-stable': '#3B82F6',
        'bg-light-purple': '#FAF7FF', // 매우 연한 보라색 배경
      },
    },
  },
  plugins: [],
}