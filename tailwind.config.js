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
        15:'60px',
        100:'400px',
        25:'100px',
        30:'130px',



      },
      fontSize: {
        "xs+": "13px", 
        "xs-": "11.2px",
        "xxl":"30px",
        "ss":"8px",
        "lg-":"16px"
      },
      colors: {
        primary: "#52525b",
      
      },
    },
  },
  plugins: [],
}
