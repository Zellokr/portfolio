import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/test-utils', '@nuxt/eslint'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'prefetch', href: '/kia_rio.glb', as: 'fetch', crossorigin: 'anonymous' }
      ]
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  nitro: {
    preset: 'vercel'
  }
})
