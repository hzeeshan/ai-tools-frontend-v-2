// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["vuetify/styles/main.sass", "@mdi/font/css/materialdesignicons.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "@nuxt/image"],
  //ssr: true,
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      appBaseUrl: process.env.APP_BASE_URL,
    },
  },
});
