/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      colors: {
        primary: {
          dark: "#1A0E2A"
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
  safelist: [
    {
      pattern: /bg-(green|red|orange|yellow|lime|emerald|teal|blue|indigo|fuchsia|pink|slate)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
        pattern: /border-(green|red|orange|yellow|lime|emerald|teal|blue|indigo|fuchsia|pink|slate)-(100|200|300|400|500|600|700|800|900)/,
    },
  ]
}

