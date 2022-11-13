import { defineNuxtPlugin } from '#app'

import { useNuxtCookieControl } from './composables'

export default defineNuxtPlugin((_nuxtApp) => {
  const state = useNuxtCookieControl()

  state.methods.setConsent({ isInit: true })

  if (process.client) {
    state.methods.setConsent()
  }

  return {
    provide: {
      cookies: state,
    },
  }
})
