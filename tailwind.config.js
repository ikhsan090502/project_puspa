/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        puspaMint: '#B8E8DB',
        puspaPurple: '#5B3C88',
      },
      fontFamily: {
        playpen: ['Playpen Sans', 'cursive'],
      },
    },
  },
  plugins: [],
};


