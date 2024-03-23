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
      brand: 'rgb(204, 32, 92)',
      'brand-hover': 'rgba(204, 32, 92, 0.7)',
      black: 'rgb(0, 0, 0)',
      'black-a-5': 'rgba(0, 0, 0, 0.5)',
      white: '#ffffff',
    },
    extend: {},
  },
  plugins: [import('@tailwindcss/forms')],
};
