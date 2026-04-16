/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d8e9ff",
          200: "#b8d6ff",
          300: "#8bbcff",
          400: "#5f9fff",
          500: "#2f7cf6",
          600: "#1e62d4",
          700: "#194dac",
          800: "#193f85",
          900: "#1a366d"
        },
        sand: "#f6f2ea",
        ink: "#132238",
        accent: "#f97316",
        success: "#17a267",
        danger: "#d14343"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(19, 34, 56, 0.10)"
      },
      borderRadius: {
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};
