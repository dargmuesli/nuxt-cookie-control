import { ref } from 'vue'

import { getAllCookieIdsString, getCookieId } from './methods'
import { Cookie, State } from './types'

import { Plugin } from '#app'
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
  ).value?.split('|')

  const isConsentGiven = ref<boolean | undefined>(
    cookieIsConsentGiven === undefined
      ? undefined
      : cookieIsConsentGiven.value === getAllCookieIdsString(moduleOptions),
  )
  const cookiesEnabled = ref<Cookie[] | undefined>(
    cookieCookiesEnabledIds === undefined
      ? undefined
      : [
          ...moduleOptions.cookies.necessary.filter((cookieNecessary) =>
            cookieCookiesEnabledIds.includes(getCookieId(cookieNecessary)),
          ),
          ...moduleOptions.cookies.optional.filter((cookieOptional) =>
            cookieCookiesEnabledIds.includes(getCookieId(cookieOptional)),
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
