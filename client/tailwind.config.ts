import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins','sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      colors:{
        primary: '#B22222',
        secondary: '#FEF200',
        tertiary: '#313131'
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
      }
    },
  },
  plugins: [],
};
export default config;
