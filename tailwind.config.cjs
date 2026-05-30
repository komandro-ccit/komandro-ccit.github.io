module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        // Legacy tokens (keep for compatibility)
        primary: {
          DEFAULT: '#4CAF50',
          light: '#3DDC84',
          dark: '#388E3C'
        },
        // Material 3 Design System Tokens
        'surface': '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-bright': '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'on-surface': '#191c1e',
        'on-surface-variant': '#3c4a3f',
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',
        'outline': '#6c7b6e',
        'outline-variant': '#bbcbbc',
        'surface-tint': '#006d3b',
        'primary-m3': '#006d3b',
        'on-primary': '#ffffff',
        'primary-container': '#3ddc84',
        'on-primary-container': '#005c31',
        'inverse-primary': '#43e188',
        'secondary': '#555f6f',
        'on-secondary': '#ffffff',
        'secondary-container': '#d6e0f3',
        'on-secondary-container': '#596373',
        'tertiary': '#006e1c',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#74d873',
        'on-tertiary-container': '#005d16',
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'primary-fixed': '#66fea2',
        'primary-fixed-dim': '#43e188',
        'on-primary-fixed': '#00210e',
        'on-primary-fixed-variant': '#00522b',
        'secondary-fixed': '#d9e3f6',
        'secondary-fixed-dim': '#bdc7d9',
        'on-secondary-fixed': '#121c2a',
        'on-secondary-fixed-variant': '#3d4756',
        'tertiary-fixed': '#94f990',
        'tertiary-fixed-dim': '#78dc77',
        'on-tertiary-fixed': '#002204',
        'on-tertiary-fixed-variant': '#005313',
        'background': '#f7f9fb',
        'on-background': '#191c1e',
        'surface-variant': '#e0e3e5',
        'slate-dark': '#1F2937',
        'android-green': '#3DDC84',
        'classic-green': '#4CAF50',
        'surface-light': '#F8FAFC'
      },
      spacing: {
        'base': '8px',
        'xs': '4px',
        'sm': '12px',
        'md': '24px',
        'lg': '48px',
        'xl': '80px',
        'container-max': '1120px',
        'gutter': '24px',
        'margin-desktop': '80px',
        'margin-mobile': '24px'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'headline-xl': ['Inter', 'sans-serif'],
        'headline-lg': ['Inter', 'sans-serif'],
        'headline-lg-mobile': ['Inter', 'sans-serif'],
        'headline-md': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'label-md': ['Inter', 'sans-serif'],
        'code-sm': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'headline-xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-xl-home': ['64px', { lineHeight: '72px', letterSpacing: '-0.03em', fontWeight: '800' }],
        'headline-xl-home-mobile': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg-home': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-md-home': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-lg-home': ['20px', { lineHeight: '32px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        'code-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }]
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
