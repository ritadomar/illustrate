/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      brand: '#CC205C',
      'brand-hover': '#f75381',
      'brand-darkest': '#280502',
      black: '#131011',
      'black-a-5': 'rgba(19, 16, 17, 0.5)',
      white: '#ffffff',
      accent: '#f9a49e',
      'accent-strong': '#F86353',
      'accent-light': '#FCDAD8',
      'accent-dark': '#CC3A20',
      gray: '#978C8E',
      'gray-darker': '#73686a',
      red: '#E83939',
    },
    extend: {
      fontFamily: {
        display: 'bely-display, ui-sans-serif, sans-serif',
      },
    },
  },
  plugins: [import('@tailwindcss/forms')],
};
