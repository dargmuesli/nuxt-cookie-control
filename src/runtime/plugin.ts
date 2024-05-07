import { ref } from 'vue'

import moduleOptions from '#build/types/cookie-control'
import { COOKIE_ID_SEPARATOR } from '#cookie-control/constants'
import { getAllCookieIdsString } from '#cookie-control/methods'
import type { Cookie, State } from '#cookie-control/types'
import { defineNuxtPlugin, useCookie } from '#imports'

export default defineNuxtPlugin((_nuxtApp) => {
  const cookieIsConsentGiven = useCookie(
    moduleOptions.cookieNameIsConsentGiven,
    moduleOptions.cookieOptions,
  )
  const cookieCookiesEnabledIds = useCookie(
    moduleOptions.cookieNameCookiesEnabledIds,
    moduleOptions.cookieOptions,
  ).value?.split(COOKIE_ID_SEPARATOR)

  const isConsentGiven = ref<boolean | undefined>(
    cookieIsConsentGiven.value === undefined
      ? undefined
      : cookieIsConsentGiven.value === getAllCookieIdsString(moduleOptions),
  )
  const cookiesEnabled = ref<Cookie[] | undefined>(
    cookieCookiesEnabledIds === undefined
      ? undefined
      : [
          ...moduleOptions.cookies.necessary.filter((cookieNecessary) =>
            cookieCookiesEnabledIds.includes(cookieNecessary.id),
          ),
          ...moduleOptions.cookies.optional.filter((cookieOptional) =>
            cookieCookiesEnabledIds.includes(cookieOptional.id),
          ),
        ],
  )
  const cookiesEnabledIds = ref<string[] | undefined>(cookieCookiesEnabledIds)
  const isModalActive = ref<boolean>()
  const locale = ref<string>()

  const state = {
    cookiesEnabled,
    cookiesEnabledIds,
    isConsentGiven,
    isModalActive,
    locale,
    moduleOptions,
  } as State

  return {
    provide: {
      cookies: state,
    },
  }
})
