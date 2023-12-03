// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  css: [
    "@mdi/font/css/materialdesignicons.min.css",
    "vuetify/lib/styles/main.sass",
    "@/assets/css/main.scss",
  ],
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt","nuxt-gtag"],
  build: {
    transpile: ["vuetify"],
  },
  devtools: { enabled: true },
  gtag:{
    id:"G-SG6QYZP7FB"
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
});
