// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: './src',
  ssr: true,
  nitro: {
    preset: 'vercel',
  },
  app: {
    head: {
      title: 'VOICEVOX Trial',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['~/assets/main.css', 'vuetify/lib/styles/main.sass'],
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    public: {
      NODE_ENV: process.env.NODE_ENV,
      LOG_LEVEL: 'debug',
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
});
