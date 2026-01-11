import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Guardia-DPDP-Compliance/',  // ← BLANK PAGE FIX #1
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
