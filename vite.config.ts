import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The site is served from https://lotem-e.github.io/find-that-year/, so every
  // asset URL must start with that folder. Vite prepends this to its own
  // output; our own URLs read it back through import.meta.env.BASE_URL.
  base: '/find-that-year/',
})
