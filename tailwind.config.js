/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F5F6F8',
        },
        silver: {
          light: '#F1F3F5',
          DEFAULT: '#E2E5E9',
          dark: '#CAD0D8',
        },
        brand: {
          border: '#E5E7EB',
          text: '#172033',
          muted: '#64748B',
          green: '#16A34A',
          'green-hover': '#15803D',
          'green-light': '#DCFCE7',
          dark: '#1E293B',
          'dark-surface': '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(0,0,0,0.05)',
        'soft-md': '0 4px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
        'soft-lg': '0 10px 25px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)',
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
