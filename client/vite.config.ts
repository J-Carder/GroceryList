import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: "/src",
      devOptions: {
        enabled: true
      },
      injectRegister: "auto",
      strategies: "generateSW",
      manifestFilename: "manifest.webmanifest",
      manifest: {
        name: "GroceryList",
        short_name: "GroceryList",
        description: "An app for creating grocery lists with ease.",
        theme_color: "#47CA4C",
        icons: [
          {
            "src": "icons/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "icons/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "icons/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        screenshots: [
          {
            src: "screenshots/narrow.png",
            sizes: "342x764",
            type: "image/png",
            form_factor: "narrow",
            label: "Screenshot of the Grocery List app"
          },
          {
            src: "screenshots/wide.png",
            sizes: "800x602",
            type: "image/png",
            form_factor: "wide",
            label: "Screenshot of the Grocery List app"
          }
        ]
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: ({url}) => url.pathname == "/authenticate",
          handler: "CacheFirst",
          options: {
            cacheName: "auth-cache",
            // cacheableResponse: {
            //   statuses: [0, 200]
            // }
          }
        },
        {
          urlPattern: ({url}) => true,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            // cacheableResponse: {
            //   statuses: [0, 200]
            // }
          }
        }]
      }
    })

  ],
})
