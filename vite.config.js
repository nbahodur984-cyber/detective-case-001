import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Статический сайт-детектив.
// База '/' обязательна: маршруты вложенные (/case/001), и при относительной
// базе './' браузер искал бы бандл в /case/assets/… — прямая ссылка на дело
// отдавала бы белую страницу. Сайт живёт в корне домена.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: true, // слушать 0.0.0.0 — чтобы preview-браузер достучался до сервера
    port: 5173,
    strictPort: true,
  },
})
