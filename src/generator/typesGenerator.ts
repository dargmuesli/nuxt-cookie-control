import type { ModuleOptions } from '#cookie-control/types'
import type { Nuxt, NuxtApp } from 'nuxt/schema'

export function typesGenerator(data: {
  nuxt: Nuxt
  app: NuxtApp
  options: ModuleOptions
}) {
  return `/**
* CookieID represents the a singular ID of your defined cookies in your nuxt configuration
*/
export type CookieID = ${Object.values(data.options.cookies)
    .map((cookies) => cookies.map((cookie) => `"${cookie.id}"`).join(' | '))
    .join(' | ')};

export type CookieIDs = Array<CookieID>;
`
}
