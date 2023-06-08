import { ref } from 'vue'

import { getAllCookieIdsString, getCookieId } from './methods'
import { Cookie, State } from './types'

import { defineNuxtPlugin } from '#imports'
import moduleOptions from '#build/cookie-control-options'

export default defineNuxtPlugin((_nuxtApp) => {
  const cookieIsConsentGiven = useCookie(moduleOptions.cookieNameIsConsentGiven)
  const cookieCookiesEnabledIds = useCookie(
    moduleOptions.cookieNameCookiesEnabledIds
  ).value?.split('|')

  const isConsentGiven = ref<boolean | undefined>(
    cookieIsConsentGiven === undefined
      ? undefined
      : cookieIsConsentGiven.value === getAllCookieIdsString(moduleOptions)
  )
  const cookiesEnabled = ref<Cookie[] | undefined>(
    cookieCookiesEnabledIds === undefined
      ? undefined
      : [
          ...moduleOptions.cookies.necessary.filter((cookieNecessary) =>
            cookieCookiesEnabledIds.includes(getCookieId(cookieNecessary))
          ),
          ...moduleOptions.cookies.optional.filter((cookieOptional) =>
            cookieCookiesEnabledIds.includes(getCookieId(cookieOptional))
          ),
        ]
  )
  const cookiesEnabledIds = ref<string[] | undefined>(cookieCookiesEnabledIds)
  const isModalActive = ref<boolean>()

  const state = {
    isConsentGiven,
    cookiesEnabled,
    cookiesEnabledIds,
    isModalActive,
    moduleOptions,
  } as State

  return {
    provide: {
      cookies: state,
    },
  }
})
