// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", '@nuxt/image', 'reka-ui/nuxt', 'nuxt-snackbar'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      siteURL: process.env.HOST,
      // firebase config
      firebaseConfig: JSON.stringify({
        apiKey: "AIzaSyDigESNvrP-cS8C-XT-fBmdPaq8OyZD3bo",
        authDomain: "zenitech-5eb1b.firebaseapp.com",
        projectId: "zenitech-5eb1b",
        storageBucket: "zenitech-5eb1b.firebasestorage.app",
        messagingSenderId: "738154290576",
        appId: "1:738154290576:web:822799a362b65841a0e715",
        measurementId: "G-60WB65F0NP"
      })
    }
  },
  devServer: {
    port: 3000,
  },
  snackbar: {
    top: true,
    right: true,
    shadow: true,
    border: "left",
    duration: 5000,
  }
})