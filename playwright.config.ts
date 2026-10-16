import { defineConfig } from '@playwright/test'

const port = 3456
const portModalForced = 3457

export default defineConfig({
  testDir: 'test',
  // CI uses the runner's preinstalled Chrome to skip downloading Playwright's browser
  use: { channel: process.env.CI ? 'chrome' : undefined },
  projects: [
    {
      name: 'default',
      testIgnore: /modal-forced/,
      use: { baseURL: `http://localhost:${port}` },
    },
    {
      name: 'modal-forced',
      testMatch: /modal-forced/,
      use: { baseURL: `http://localhost:${portModalForced}` },
    },
  ],
  webServer: [
    {
      command: 'pnpm --dir playground run start',
      env: { PORT: String(port) },
      url: `http://localhost:${port}`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm --dir playground run start',
      env: {
        NUXT_PUBLIC_COOKIE_CONTROL_IS_MODAL_FORCED: 'true',
        PORT: String(portModalForced),
      },
      url: `http://localhost:${portModalForced}`,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
