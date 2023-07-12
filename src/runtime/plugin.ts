import Cookies from 'js-cookie'
import { ref } from 'vue'

import { getAllCookieIdsString, getCookieId } from './methods'
import { Cookie, State } from './types'

import { defineNuxtPlugin } from '#imports'
import moduleOptions from '#build/cookie-control-options'

export default defineNuxtPlugin((_nuxtApp) => {
  const cookieIsConsentGiven = Cookies.get(
    moduleOptions.cookieNameIsConsentGiven
  )
  const cookieCookiesEnabledIds = Cookies.get(
    moduleOptions.cookieNameCookiesEnabledIds
  )?.split('|')

  const isConsentGiven = ref<boolean | undefined>(
    cookieIsConsentGiven === undefined
      ? undefined
      : cookieIsConsentGiven === getAllCookieIdsString(moduleOptions)
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
  const locale = ref<string>()

  const state = {
    isConsentGiven,
    cookiesEnabled,
    cookiesEnabledIds,
    isModalActive,
    moduleOptions,
    locale,
  } as State

  return {
    provide: {
      cookies: state,
    },
  }
})
