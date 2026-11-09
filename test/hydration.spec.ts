import { expect, test } from '@playwright/test'
import type { BrowserContext, Page } from '@playwright/test'

// the playground's cookie ids, as written after consenting without the functional cookie
// blocked iframes render consent dependent markup on purpose, so enabling the functional cookie would mismatch cached markup
const CONSENT_COOKIES = {
  ncc_c: 'noncc_fmodule-added-cookie',
  ncc_e: 'n~module-added-cookie',
}

const giveConsent = (context: BrowserContext, baseURL: string) =>
  context.addCookies(
    Object.entries(CONSENT_COOKIES).map(([name, value]) => ({
      name,
      value,
      url: baseURL,
    })),
  )

// records for each animation frame from the start of parsing whether the bar is visible
const recordBarFrames = (page: Page) =>
  page.addInitScript(() => {
    const frames: boolean[] = []
    ;(window as unknown as { barFrames: boolean[] }).barFrames = frames
    const tick = () => {
      const bar = document.querySelector('.cookieControl__Bar')
      frames.push(
        !!bar &&
          getComputedStyle(bar).display !== 'none' &&
          bar.getBoundingClientRect().height > 0,
      )
      if (frames.length < 60) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

const getBarFrames = async (page: Page) => {
  await page.waitForFunction(
    () =>
      (window as unknown as { barFrames: boolean[] }).barFrames.length >= 60,
  )
  return page.evaluate(
    () => (window as unknown as { barFrames: boolean[] }).barFrames,
  )
}

const collectHydrationWarnings = (page: Page) => {
  const warnings: string[] = []
  page.on('console', (message) => {
    if (/hydrat/i.test(message.text())) warnings.push(message.text())
  })
  return warnings
}

test.beforeEach(async ({ page }) => {
  // keep third party iframes out of the test
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort())
})

test('server markup does not depend on consent cookies', async ({
  request,
}) => {
  const cookie = Object.entries(CONSENT_COOKIES)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')
  const withoutConsent = await (await request.get('/')).text()
  const withConsent = await (
    await request.get('/', { headers: { cookie } })
  ).text()

  for (const html of [withoutConsent, withConsent]) {
    expect(html).toContain('cookieControl__Bar ')
    expect(html).not.toContain('cookieControl__ControlButton')
  }
})

test('first visitor sees the bar from the first frame', async ({ page }) => {
  const warnings = collectHydrationWarnings(page)
  await recordBarFrames(page)
  await page.goto('/')

  expect((await getBarFrames(page)).every(Boolean)).toBe(true)
  expect(warnings).toEqual([])
})

test('returning visitor never sees the bar and hydrates without mismatch when served cached markup', async ({
  baseURL,
  context,
  page,
  request,
}) => {
  // simulate a shared cache by serving markup that was rendered for a visitor without consent
  const cachedHtml = await (await request.get('/')).text()
  await page.route(`${baseURL}/`, (route) =>
    route.fulfill({ body: cachedHtml, contentType: 'text/html' }),
  )
  await giveConsent(context, baseURL!)
  const warnings = collectHydrationWarnings(page)
  await recordBarFrames(page)
  await page.goto('/')

  expect((await getBarFrames(page)).some(Boolean)).toBe(false)
  await expect(page.locator('.cookieControl__ControlButton')).toBeVisible()
  expect(warnings).toEqual([])
})

test('bar shows again when consent is declined after mount', async ({
  baseURL,
  context,
  page,
}) => {
  await giveConsent(context, baseURL!)
  await page.goto('/')
  await page.locator('.cookieControl__ControlButton').click()
  await page.locator('.cookieControl__ModalButtons button').nth(2).click()

  await expect(page.locator('.cookieControl__Bar')).toBeVisible()
})
