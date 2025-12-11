// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  
  // 👇 AGREGA ESTO SI TE SALE ERROR DE "GLOBAL" O "BUFFER"
  define: {
    global: 'window',
  },
})