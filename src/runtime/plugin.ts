import { setConsent } from './methods'
import { Cookie, State } from './types'

import moduleOptions from '#build/cookie-control-options'

export default defineNuxtPlugin((_nuxtApp) => {
  // const nuxtApp = useNuxtApp()
  const isConsentGiven = ref<boolean>()
  const cookiesEnabled = ref<Cookie[]>([])
  const cookiesEnabledIds = ref<string[]>([])
  const isModalActive = ref<boolean>()

  const state = {
    isConsentGiven,
    cookiesEnabled,
    cookiesEnabledIds,
    isModalActive,
    moduleOptions,
  } as State

  setConsent({
    isInit: !process.client,
    // nuxtApp,
    isConsentGiven,
    moduleOptions,
    cookiesEnabled,
    cookiesEnabledIds,
  })

  return {
    provide: {
      cookies: state,
    },
  }
})
