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
      black: '#131011',
      'black-a-5': 'rgba(19, 16, 17, 0.5)',
      white: '#ffffff',
      'accent-light': '#FCDAD8',
    },
    extend: {},
  },
  plugins: [import('@tailwindcss/forms')],
};
