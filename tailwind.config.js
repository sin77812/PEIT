/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // 보라색 그라데이션 border 클래스들
    'border-purple-gradient-100',
    'border-purple-gradient-200',
    'border-purple-gradient-300',
    'border-purple-gradient-400',
    'border-purple-gradient-500',
    'border-purple-gradient-600',
    'border-purple-gradient-700',
    'border-purple-gradient-800',
    'border-purple-gradient-900',
    'border-purple-gradient-950',
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
        // 보라색 그라데이션 (10단계)
        'purple-gradient': {
          100: '#F3E8FF', // 가장 연한 보라
          200: '#E9D5FF', // 매우 연한 보라
          300: '#D8B4FE', // 연한 보라
          400: '#C084FC', // 중간 연한 보라
          500: '#A855F7', // 중간 보라
          600: '#9333EA', // 진한 보라
          700: '#7E22CE', // 더 진한 보라
          800: '#6B21A8', // 매우 진한 보라
          900: '#581C87', // 가장 진한 보라
          950: '#3B0764', // 최고 진한 보라
        },
      },
    },
  },
  plugins: [],
}