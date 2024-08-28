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
        'pull-down': {
          '0%': { transform: 'translateY(-5%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pop-out': {
          '0%': { transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'shake-tilt': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-1deg)' },
          '20%': { transform: 'rotate(2deg)' },
          '30%': { transform: 'rotate(-4deg)' },
          '40%': { transform: 'rotate(4deg)' },
          '50%': { transform: 'rotate(-4deg)' },
          '60%': { transform: 'rotate(4deg)' },
          '70%': { transform: 'rotate(-4deg)' },
          '80%': { transform: 'rotate(2deg)' },
          '90%': { transform: 'rotate(-1deg)' },
        },
        'zoomIn': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'zoomOut': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.5)'},
          '100%': { transform: 'scale(1)'},
        },
        'border-pulse': {
          '0%': { borderColor: '#B22222' },
          '50%': { borderColor: 'transparent' },
          '100%': { borderColor: '#B22222' },
        },
        'border-pulse2': {
          '0%': { borderColor: 'white' },
          '50%': { borderColor: 'transparent' },
          '100%': { borderColor: 'white' },
        },
        colorPulse: {
          '0%': { color: '#414141' },
          '50%': { color: '#2e2e2e' },
          '100%': { color: '#414141' },
        },
        colorPulse2: {
          '0%': { color: '#414141' },
          '25%': { color: '#2e2e2e' },
          '50%': { color: '#B22222' },
          '75%': { color: '#B22222' },
          '100%': { color: '#414141' },
        },
      },
      animation: {
        'shrink-in': 'shrink-in 0.5s ease-in-out forwards',
        'expand-width': 'expand-width 300ms ease-in-out forwards',
        'fade-in': 'fade-in 2s ease-in-out forwards',
        'fade-in2': 'fade-in 1s ease-in-out forwards',
        'crop-left-to-right': 'crop-left-to-right 0.6s ease-in-out forwards',
        'pull-down': 'pull-down 0.3s ease-in-out forwards',
        'pop-out': 'pop-out 0.2s ease-out forwards',
        'shake-tilt': 'shake-tilt 1s ease-in-out',
        'zoomIn': 'zoomIn 0.4s ease-in-out',
        'zoomOut': 'zoomOut 0.4s ease-in-out',
        'zoom-in': 'zoom-in 0.4s ease-in-out',
        'border-pulse': 'border-pulse 3s infinite',
        'border-pulse2': 'border-pulse2 3s infinite',
        'color-pulse': 'colorPulse 5s ease-in-out infinite',
        'color-pulse2': 'colorPulse2 10s ease-in-out infinite',
      },
      backgroundImage: {
        'virginia-mascot': "url('/images/virginia-mascot-bg.png')",
      }
    },
  },
  plugins: [nextui()],
};
export default config;
