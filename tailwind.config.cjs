/** @type {import('tailwindcss/types').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Brand palette — Konsep D "Campus Pop" */
        violet: {
          DEFAULT: '#6C4DF6',
          soft: '#F1EBFF',
          deep: '#4A2FCC'
        },
        pink: {
          DEFAULT: '#FF5C9A',
          soft: '#FFEDF4',
          deep: '#C4306A'
        },
        mint: {
          DEFAULT: '#12C9A0',
          soft: '#E4FBF4',
          deep: '#0A8C6C'
        },
        amber: {
          DEFAULT: '#FFB020',
          soft: '#FFF4E0',
          deep: '#A06A00'
        },
        sky: {
          DEFAULT: '#38B6F7',
          soft: '#E8F3FF',
          deep: '#2277B8'
        },
        lime: {
          DEFAULT: '#A3E635',
          soft: '#F2FDE0',
          deep: '#5B8A00'
        },
        orange: {
          DEFAULT: '#FF8A3D',
          soft: '#FFF0E4',
          deep: '#B85A17'
        },
        magenta: {
          DEFAULT: '#D946EF',
          soft: '#FBE8FF',
          deep: '#8E24AA'
        },
        /* Surface */
        canvas: '#FFF9F3',
        'soft': '#F6F2FF',
        'soft-pink': '#FFF0F6',
        'soft-mint': '#E4FBF4',
        'soft-amber': '#FFF4E0',
        'soft-sky': '#E8F3FF',
        /* Text */
        ink: '#2A2340',
        'ink-2': '#6E6785',
        'ink-3': '#9A94AE',
        /* Dark band (footer / CTA band) */
        'ink-band': '#2A2340'
      },
      spacing: {
        'base': '8px',
        'xs': '6px',
        'sm': '14px',
        'md': '24px',
        'lg': '48px',
        'xl': '80px',
        '2xl': '120px',
        'container-max': '1160px',
        'gutter': '24px',
        'margin-desktop': '80px',
        'margin-mobile': '24px'
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      fontSize: {
        'display-xl': ['64px', { lineHeight: '1.06', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-lg': ['44px', { lineHeight: '1.10', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-md': ['30px', { lineHeight: '1.16', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['22px', { lineHeight: '1.24', letterSpacing: '-0.015em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.68', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.6', fontWeight: '500' }],
        'label': ['13px', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '700' }]
      },
      borderRadius: {
        'DEFAULT': '14px',
        'sm': '10px',
        'md': '22px',
        'lg': '32px',
        'xl': '40px'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(42,35,64,.04)',
        'card-md': '0 8px 24px rgba(42,35,64,.08)',
        'card-lg': '0 16px 40px rgba(42,35,64,.12)',
        'hover': '0 20px 44px rgba(42,35,64,.16)',
        'nav': '0 6px 24px rgba(42,35,64,.08)'
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(.34,1.56,.64,1)',
        'smooth': 'cubic-bezier(.4,0,.2,1)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
