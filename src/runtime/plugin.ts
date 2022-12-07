import { defineNuxtPlugin } from '#app'

import { setConsent } from './methods'
import { Cookie, State } from './types'

import moduleOptions from '#build/nuxtCookieControl.options'

export default defineNuxtPlugin((_nuxtApp) => {
  const nuxtApp = useNuxtApp()
  const isConsentGiven = ref<boolean>()
  const cookiesEnabled = ref<Cookie[]>([])
  const cookiesEnabledIds = ref<string[]>([])
  const isModalActive = ref<boolean>()
  const cookiesOptional: Cookie[] = []

  const state = {
    isConsentGiven,
    cookiesEnabled,
    cookiesEnabledIds,
    isModalActive,
    cookiesOptional,
    moduleOptions,
  } as State

  setConsent({
    isInit: true,
    nuxtApp,
    isConsentGiven,
    moduleOptions,
    cookiesEnabled,
    cookiesEnabledIds,
    cookiesOptional,
  })

  if (process.client) {
    setConsent({
      isInit: false,
      nuxtApp,
      isConsentGiven,
      moduleOptions,
      cookiesEnabled,
      cookiesEnabledIds,
      cookiesOptional,
    })
  }

  return {
    provide: {
      cookies: state,
    },
  }
})
