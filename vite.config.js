import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Статический сайт-детектив. База './' — чтобы сборка работала на любом
// поддомене/подпапке хостинга (GitHub Pages, Netlify и т.п.).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true, // слушать 0.0.0.0 — чтобы preview-браузер достучался до сервера
    port: 5173,
    strictPort: true,
  },
})
