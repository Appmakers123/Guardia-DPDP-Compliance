import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Guardia-DPDP-Compliance/'  // ← THIS FIXES BLANK PAGE
})
