// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: [
    "@mdi/font/css/materialdesignicons.min.css",
    "vuetify/lib/styles/main.sass",
    "@/assets/css/main.scss",
  ],
  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  build: {
    transpile: ["vuetify"],
    rollupOptions: {
      external: ["vuetify/lib/styles/main.sass",],
    },
  },
  devtools: { enabled: true },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
});
