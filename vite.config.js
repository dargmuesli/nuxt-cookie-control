import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@dargmuesli/nuxt-cookie-control': fileURLToPath(
        new URL('./src/module', import.meta.url)
      ),
    },
  },
})
