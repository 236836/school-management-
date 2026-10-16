// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        secondary: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        success: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          50:  '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
        neutral: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card':      '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)',
        'card-hover':'0 0 0 1px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.08)',
        'sidebar':   '4px 0 24px rgba(0,0,0,0.06)',
        'modal':     '0 25px 50px rgba(0,0,0,0.15)',
        'dropdown':  '0 8px 24px rgba(0,0,0,0.12)',
        'button':    '0 2px 4px rgba(79,70,229,0.2)',
        'input':     '0 0 0 3px rgba(79,70,229,0.1)',
        'glow-primary': '0 0 20px rgba(79,70,229,0.25)',
        'glow-success': '0 0 20px rgba(16,185,129,0.25)',
        'glow-danger':  '0 0 20px rgba(239,68,68,0.25)',
      },
      animation: {
        'shimmer':     'shimmer 2s linear infinite',
        'float':       'float 4s ease-in-out infinite',
        'fadeInUp':    'fadeInUp 0.4s ease-out',
        'fadeIn':      'fadeIn 0.3s ease-out',
        'slideInLeft': 'slideInLeft 0.3s ease-out',
        'slideInRight':'slideInRight 0.3s ease-out',
        'scaleIn':     'scaleIn 0.2s ease-out',
        'pulse-soft':  'pulse 3s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
        'bounce-subtle':'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};