/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './Components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        "bleach-white": "rgba(255, 255, 255, 0.95)",
        "dark": "#252530",
        "light-dark": "#1E1E1E",
        "light-grey": "#F0F0FA",  
        'milk': "#E6EEFD",
        "dark-blue": "#0653EA",
        "sky-blue": "#F4F8FF", 
        "sky-blue-100": "rgba(244, 248, 255, 1)",
        "light-blue": "#78A6FF",
        "light-blue-100": "#DFDFFF",
        "bleach-blue": "#DEF1FF",
        "bleach-blue-100": "#bde3ff33",
        "light-blue": "rgba(6, 83, 234, 0.10)",
        "light-brown": "rgba(63, 61, 86, 0.75)",
        "dark-brown": "#3F3D56",
        "bleach-brown": "rgba(63, 61, 86, 0.75)",
        "light-red": "#FC6681",
        "light-red-100": "#C80000",
        'bleach-red': "rgba(255, 199, 194, 0.5)",
        "light-green": "#29AE55",
        "bleach-green": "#BED9C7",
        "dark-green": "#1A572E",
        "dark-yellow": "#FFC60C",
        "light-yellow": "#FFF6D8",
        "light-black": "#222222",
        "light-grey": "#87878D",
        "lavender-gray-bg":"#F0F0FA",
        "electric-blue":"#0000FF",
        "vivid-orange-red":"#FF3D00",
        "slate-gray-text":"#838187",
        "semi-transparent-white":"#FFFFFFCC",
        "corporate-blue":"#4285F4"
      },
      fontFamily: {
        "sans": ['poppins', 'sans-serif'] 
      },
      fontSize: {
        'xxs': "8px",
        'xs': "10px",
        'sm': '12px',
        'sml': "14px",
        'base': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '50px',
        "6xl": "100px"
      },
      backgroundImage: {
        'map-bg': "url('/images/map-bg.png')",
      },
      transitionDuration: {
        '2000': '5000ms',
      },
      spacing: {
        'md': '15px',
      },
    },
  },
  plugins: [ ],
}
