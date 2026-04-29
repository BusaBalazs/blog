/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Open Sans", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
