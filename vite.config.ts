import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Guardia-DPDP-Compliance/',  // ← THIS WAS MISSING
  plugins: [react()],
})
