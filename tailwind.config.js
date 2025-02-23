/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing:{
        '96':'384px',
        50:'180px',
      },
      fontSize: {
        "xs+": "13px", 
        "xs-": "11.2px",
        "xxl":"30px",
        "ss":"8px"
      },
      colors: {
        primary: "#52525b",
      },
    },
  },
  plugins: [],
}
