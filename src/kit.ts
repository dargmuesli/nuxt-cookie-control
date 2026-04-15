import { useNuxt } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

import { CONFIG_KEY } from './constants'
import type { Cookie } from './types'
import { CookieType } from './types'

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
 *
 * @example
 * ```ts
 * addControlledCookie({ id: 'analytics', name: 'Analytics' }, CookieType.OPTIONAL)
 * ```
 */
export const addControlledCookie = (
  cookie: Cookie,
  type: CookieType = CookieType.OPTIONAL,
  nuxt: Nuxt = useNuxt(),
) => {
  nuxt.options[CONFIG_KEY].cookies ||= { necessary: [], optional: [] }
  nuxt.options[CONFIG_KEY].cookies.necessary ||= []
  nuxt.options[CONFIG_KEY].cookies.optional ||= []

  if (nuxt.options[CONFIG_KEY].cookies[type].some((c) => c.id === cookie.id)) {
    return
  }

  nuxt.options[CONFIG_KEY].cookies[type].push(cookie)
}

export { CookieType } from './types'
export type { Cookie } from './types'
