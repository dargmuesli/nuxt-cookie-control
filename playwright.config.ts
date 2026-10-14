import { defineConfig } from '@playwright/test'

const port = 3456

export default defineConfig({
  testDir: 'test',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: 'pnpm --dir playground run start',
    env: { PORT: String(port) },
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
})
