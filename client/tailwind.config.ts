import { nextui } from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|popover).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      colors: {
        primary: '#B22222',
        secondary: '#FEF200',
        tertiary: '#313131',
        background: '#FFFAF8'
      },
      screens: {
        'xl': '1024px',
        '2xl': '1280px',
        '3xl': '1440px',
        '4xl': '1536px'
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.45)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.45)',
          '0 45px 65px rgba(0, 0, 0, 0.35)'
        ]
      },
      boxShadow: {
        'inner-sm': 'inset 1px 1px 2px rgba(0, 0, 0, 0.1)',
        'inner-md': 'inset 2px 2px 4px rgba(0, 0, 0, 0.2)',
        'inner-lg': 'inset 4px 4px 8px rgba(0, 0, 0, 0.3)',
        'inner-xl': 'inset 8px 8px 16px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        'shrink-in': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.9)' },
        },
        'expand-width': {
          '0%': { width: '0' },
          '100%': { width: '185px' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'crop-left-to-right': {
          '0%': { opacity: '0', clipPath: 'inset(0 100% 0 0)' },
          '100%': { opacity: '1', clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        'shrink-in': 'shrink-in 0.5s ease-in-out forwards',
        'expand-width': 'expand-width 300ms ease-in-out forwards',
        'fade-in': 'fade-in 2s ease-in-out forwards',
        'fade-in2': 'fade-in 1s ease-in-out forwards',
        'crop-left-to-right': 'crop-left-to-right 0.6s ease-in-out forwards',
      },
    },
  },
  plugins: [nextui()],
};
export default config;
