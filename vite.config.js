import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vue(), vuetify({ autoImport: true })],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend local
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
