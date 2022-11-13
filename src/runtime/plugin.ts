import { defineNuxtPlugin } from '#app'

import { setConsent } from './methods'
import { Cookie, State } from './types'

import moduleOptions from '#build/nuxtCookieControl.options'

export default defineNuxtPlugin((_nuxtApp) => {
  const nuxtApp = useNuxtApp()
  const consent = ref<boolean>(false)
  const enabled = ref<Cookie[]>([])
  const enabledList = ref<string[]>([])
  const modal = ref<boolean>()
  const optional: Cookie[] = []

  const state = {
    consent,
    enabled,
    enabledList,
    modal,
    optional,
    moduleOptions,
  } as State

  setConsent({
    isInit: true,
    nuxtApp,
    consent,
    moduleOptions,
    enabled,
    enabledList,
    optional,
  })

  if (process.client) {
    setConsent({
      isInit: false,
      nuxtApp,
      consent,
      moduleOptions,
      enabled,
      enabledList,
      optional,
    })
  }

  return {
    provide: {
      cookies: state,
    },
  }
})
