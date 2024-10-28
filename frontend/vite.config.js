import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
    }
  },
  historyApiFallback: true // does this fix the issue? 2024-10-27
}
})
