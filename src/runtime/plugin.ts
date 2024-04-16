import { ref } from 'vue'

import { COOKIE_ID_SEPARATOR } from './constants'
import { getAllCookieIdsString } from './methods'
import type { Cookie, State } from './types'
import type { Plugin } from '#app'

import { defineNuxtPlugin, useCookie } from '#imports'
import moduleOptions from '#build/cookie-control-options'

const plugin: Plugin<{ cookies: State }> = defineNuxtPlugin((_nuxtApp) => {
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

export default plugin
