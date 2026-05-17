import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue'
  ],
  theme: {
    extend: {
      colors: {
        border: '#d8e5f5',
        input: '#cfd6e2',
        ring: '#0b63f6',
        background: '#f3f8ff',
        foreground: '#071b3a',
        primary: {
          DEFAULT: '#0d6dff',
          dark: '#0045bd',
          light: '#4592fb',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#e7f1ff',
          foreground: '#0b63f6'
        },
        accent: {
          green: '#10b981',
          orange: '#f97316',
          red: '#ef233c',
          yellow: '#eab308'
        },
        muted: {
          DEFAULT: '#eef2f5',
          foreground: '#6680a7'
        },
        card: {
          DEFAULT: '#ffffff',
          border: '#d9e6f5'
        },
        sidebar: {
          from: '#0d6dff',
          to: '#0045bd'
        }
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px'
      },
      boxShadow: {
        card: '0 10px 28px rgba(30, 88, 160, 0.08)',
        'card-hover': '0 14px 36px rgba(30, 88, 160, 0.14)',
        'icon-blue': '0 10px 22px rgba(0, 95, 220, 0.28)',
        login: '0 22px 48px rgba(30, 88, 160, 0.12)',
        'btn-blue': '0 12px 26px rgba(0, 95, 220, 0.25)'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'scale-in': 'scale-in 0.4s ease-out both',
        'slide-in-left': 'slide-in-left 0.4s ease-out both',
        'count-up': 'count-up 0.4s ease-out both'
      }
    }
  },
  plugins: []
} satisfies Config
