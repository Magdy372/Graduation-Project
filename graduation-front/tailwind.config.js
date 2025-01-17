/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors:{
        primary: "#FFFFFF",
        blue: "#1565a6",
        light:"#f7f7f7",
        red: "#a4120c",
        dark: "#333333",
        dark2: "#999999",
      },
      container:{
        center:true,
        padding:{
          DEFAUL: "1rem",
          sm:"2rem",
          lg:"4rem",
          xl:"5rem",
          "2xl": "6rem",
        }
      }
    },
  },
  plugins: [],
}

