import { useNuxt } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

import { CONFIG_KEY } from './runtime/constants'
import type { Cookie, ModuleOptions } from './runtime/types'
import { CookieType } from './runtime/types'

/**
 * Adds a cookie to the Nuxt configuration under the specified type category.
 *
 * @param cookie - The cookie object to be added
 * @param type - The category type for the cookie (defaults to OPTIONAL)
 * @param nuxt - The Nuxt instance (defaults to current Nuxt context)
 *
 * @remarks
 * - Initializes cookie arrays if they don't exist
 * - Prevents duplicate cookies by checking existing cookie IDs
 * - Silently returns if a cookie with the same ID already exists
 * - Must be called during Nuxt module setup phase, not at runtime
 *
 * @example
 * ```ts
 * import { defineNuxtModule } from '@nuxt/kit'
 * import { addCookieControl, CookieType } from '@dargmuesli/nuxt-cookie-control/kit'
 *
 * export default defineNuxtModule({
 *   setup() {
 *     addCookieControl({ id: 'analytics', name: 'Analytics' }, CookieType.OPTIONAL)
 *   }
 * })
 * ```
 */
export const addCookieControl = (
  cookie: Cookie,
  type: CookieType = CookieType.OPTIONAL,
  nuxt?: Nuxt,
) => {
  const nuxtInstance = nuxt ?? useNuxt()

  nuxtInstance.options[CONFIG_KEY] ||=
    {} as (typeof nuxtInstance.options)[typeof CONFIG_KEY]
  ;(nuxtInstance.options[CONFIG_KEY] as ModuleOptions).cookies ||= {
    necessary: [],
    optional: [],
  }
  ;(nuxtInstance.options[CONFIG_KEY] as ModuleOptions).cookies.necessary ||= []
  ;(nuxtInstance.options[CONFIG_KEY] as ModuleOptions).cookies.optional ||= []

  const config = nuxtInstance.options[CONFIG_KEY] as ModuleOptions

  for (const cookieType of ['necessary', 'optional'] as const) {
    if (config.cookies[cookieType].some((c) => c.id === cookie.id)) {
      return
    }
  }

  config.cookies[type].push(cookie)
}

export { CookieType } from './runtime/types'
export type { Cookie } from './runtime/types'
