// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: [
    '~/assets/css/main.css',
    '@vuepic/vue-datepicker/dist/main.css',
    '@vueform/multiselect/themes/default.css'
  ],
  build: {
    transpile: ['@vuepic/vue-datepicker', '@vueform/multiselect']
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
    }
  },
  routeRules: {
    '/': { ssr: true },
    '/login': { ssr: true },
    '/dashboard/**': { ssr: false }
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
