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
        name: "Grocery List",
        short_name: "Grocery List",
        description: "Test",
        theme_color: "#FFFFFF",
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
            sizes: "636x865",
            type: "image/png",
            form_factor: "narrow",
            label: "Screenshot of the Grocery List app"
          },
          {
            src: "screenshots/wide.png",
            sizes: "1914x865",
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
