import { expect, test } from '@playwright/test'

test('forced modal opens after hydration without mismatch', async ({
  page,
}) => {
  const warnings: string[] = []
  page.on('console', (message) => {
    if (/hydrat/i.test(message.text())) warnings.push(message.text())
  })
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort())
  await page.goto('/')

  await expect(page.locator('.cookieControl__Modal')).toBeVisible()
  expect(warnings).toEqual([])
})
