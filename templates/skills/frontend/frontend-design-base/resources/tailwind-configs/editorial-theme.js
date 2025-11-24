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
        // Editorial color palette - inspired by print magazines
        primary: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#DC2626', // Main crimson
          600: '#BE123C',
          700: '#9F1239',
          800: '#881337',
          900: '#7F1D1D',
        },
        secondary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Source Serif Pro', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['6rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-2': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'headline': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'subheadline': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body': ['1.125rem', { lineHeight: '1.75' }],
        'caption': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'prose': '65ch',
        'prose-wide': '75ch',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.2',
        'normal': '1.5',
        'relaxed': '1.75',
        'loose': '2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
