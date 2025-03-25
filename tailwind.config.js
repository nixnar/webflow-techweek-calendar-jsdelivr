module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graybackground: "rgba(143, 143, 143, 0.06)",
        grayBorder: "rgba(0, 0, 0, 0.21)",
        grayText: "rgba(255, 255, 255, 0.75)",
        brand: "#14E8FF",
      },
      fontFamily: {
        sans: ["Space Grotesk"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],

  important: true,
};
