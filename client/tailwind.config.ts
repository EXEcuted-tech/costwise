import {nextui} from '@nextui-org/theme';
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
        'poppins': ['Poppins','sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      colors:{
        primary: '#B22222',
        secondary: '#FEF200'
      },
      screens: {
        'xl': '1024px',
        '2xl': '1280px',
        '3xl': '1440px',
        '4xl': '1536px'
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
