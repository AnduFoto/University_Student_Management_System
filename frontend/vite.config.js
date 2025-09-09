// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })




// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API requests to your Django backend
      '/api': {
        target: 'http://localhost:8000', // Your Django server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
