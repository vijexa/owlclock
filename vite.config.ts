import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), splitVendorChunkPlugin()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
})
