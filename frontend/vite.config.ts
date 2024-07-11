import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'

const manifestForPlugIn = {
  registerType: "prompt" as const,
  includeAssests:['favicon.ico', "apple-touch-icon.png", "masked-icon.svg"],
  manifest:{
    name:"Faculty Profile Management System",
    short_name:"fpms",
    description:"Faculty Profile Management System",
    icons:[{
      src: '/android-chrome-192x192.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src:'/android-chrome-512x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src: '/apple-touch-icon.png',
      sizes:'180x180',
      type:'image/png',
      purpose:'apple touch icon',
    },
    {
      src: '/maskable_icon.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'any maskable',
    }
  ],
  theme_color: "#991b1b",
  background_color: "#ffffff",
  display:"standalone" as const,
  scope:'/',
  start_url:"/",
  orientation:'any' as const
  }
}

export default defineConfig({
  plugins: [react(),VitePWA(manifestForPlugIn), viteCompression({
    threshold:1025,
    algorithm:"brotliCompress",
    ext:'.br'
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps:{
    include:[
      "@react-three/drei",
      "@react-three/fiber",
      "three"
    ]
  }
})

