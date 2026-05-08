// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Kupas Tuntas - By Dikalasenja",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },
  imports: {
    dirs: ["~/composables/*/index.{ts,js,mjs,mts}"]
  },
  modules: ["@pinia/nuxt", "@vercel/analytics"],
  components: [
    {
      path: "~/components/ui",
      pathPrefix: true
    },
    "~/components"
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "lucide-vue-next",
      ]
    }
  },
});