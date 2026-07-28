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
export default defineConfig(({ mode }) => {
  const isPlaywrightServer =
    process.env.VITE_ENABLE_DEV_ENV === "true" &&
    process.env.VITE_PLAYWRIGHT_TEST === "true";

  return {
    plugins: [
      react(),
      VitePWA({
        ...manifestForPlugIn,
        devOptions: { enabled: true },
      }),
      visualizer({ open: true }),
    ],
    server: {
      allowedHosts: ["heptagonal-lionhearted-britta.ngrok-free.dev"],
    },
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
      alias: [
        ...(isPlaywrightServer
          ? [
              {
                find: "features/Auth/AuthenticationGuard",
                replacement: path.resolve(
                  __dirname,
                  "src/features/Auth/AuthenticationGuard.mock.jsx",
                ),
              },
            ]
          : []),
        {
          find: "common",
          replacement: path.resolve(__dirname, "src/common"),
        },
        {
          find: "hooks",
          replacement: path.resolve(__dirname, "src/hooks"),
        },
        {
          find: "features",
          replacement: path.resolve(__dirname, "src/features"),
        },
        {
          find: "src",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
    },
    test: {
      globals: true,
      environment: "jsdom",
      environmentOptions: {
        jsdom: {
          url: "http://localhost:3000",
        },
      },
      setupFiles: "./vitest.setup.jsx",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/tests/**/*.spec.{js,jsx,ts,tsx}",
      ],
    },
  };
});
