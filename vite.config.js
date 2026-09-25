import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'FloraGuard AI',
        short_name: 'FloraGuard',
        description: 'AI Plant Diagnosis and Pathology',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn.iconscout.com/icon/free/png-256/free-leaf-icon-download-in-svg-png-gif-file-formats--nature-plant-ecology-plants-pack-nature-icons-3112247.png?f=webp',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'https://cdn.iconscout.com/icon/free/png-512/free-leaf-icon-download-in-svg-png-gif-file-formats--nature-plant-ecology-plants-pack-nature-icons-3112247.png?f=webp',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
