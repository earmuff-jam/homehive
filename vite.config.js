import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "autoUpdate",
  workbox: {
    clientsClaim: true,
    skipWaiting: true,
  },
  includeAssets: ["favicon.ico", "apple-touc-icon.png", "masked-icon.svg"],
  manifest: {
    name: "HomeHiveSolutions",
    short_name: "HomeHiveSolutions",
    description: "HomeHiveSolutions application built by Earmuffjam LLC",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/maskable_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn), visualizer({ open: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          ol: ["ol"],
          chartjs: ["chart.js"],
        },
      },
    },
  },

  resolve: {
    alias: {
      common: path.resolve(__dirname, "src/common"),
      hooks: path.resolve(__dirname, "src/hooks"),
      features: path.resolve(__dirname, "src/features"),
      src: path.resolve(__dirname, "src"),
    },
  },
});
