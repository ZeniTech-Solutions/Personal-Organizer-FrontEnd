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
      // firebase config
      firebaseConfig: JSON.parse(process.env.NUXT_PUBLIC_FIREBASE_CONFIG || '{}'),
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