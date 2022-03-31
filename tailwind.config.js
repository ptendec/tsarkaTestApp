module.exports = {
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html",
    "./node_modules/flowbite/**/*.js"
  ],
};
