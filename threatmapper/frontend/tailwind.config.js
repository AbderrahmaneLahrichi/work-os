/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background:       'var(--color-bg)',
        surface:          'var(--color-surface)',
        border:           'var(--color-border)',
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        accent:           '#58a6ff',
      },
    },
  },
  plugins: [],
}
