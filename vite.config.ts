import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://edriso.github.io/nt-trainings/
  base: '/nt-trainings/',
  plugins: [react(), tailwindcss()],
})
