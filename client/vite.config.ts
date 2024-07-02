import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      injectRegister: "auto",
      manifest: {
        name: "Grocery List",
        short_name: "Grocery List",
        description: "Test",
        theme_color: "#FFFFFF",
        icons: [

        ]
      }
    })

  ],
})
