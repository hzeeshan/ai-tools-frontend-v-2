// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["vuetify/styles/main.sass", "@mdi/font/css/materialdesignicons.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "@nuxt/image"],
  extends: ["nuxt-seo-kit"],
  ssr: true,

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      appBaseUrl: process.env.APP_BASE_URL,

      siteUrl: process.env.PUBLIC_SITE_URL || "https://localhost.com",
      siteName: "AI Universe: Apps & Tools",
      siteDescription:
        "Explore the vast universe of AI applications and tools. Discover innovative solutions for web, mobile, and extensions across multiple domains.",
      language: "en",
    },
  },
});
