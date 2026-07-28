import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "EMG Pathway｜肌電路徑選肌",
        short_name: "EMG Pathway",
        description: "復健科醫師用的離線 needle EMG 路徑與最小選肌工具",
        theme_color: "#173b8f",
        background_color: "#f7f9fc",
        display: "standalone",
        lang: "zh-TW",
        start_url: "./",
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
        cleanupOutdatedCaches: true
      }
    })
  ]
});
