import { defineNuxtPlugin } from '#app'

import { setBlockedIframes, setConsent } from './methods'
import { State } from './types'

import moduleOptions from '#build/nuxtCookieControl.options'

export default defineNuxtPlugin((_nuxtApp) => {
  const state: State = {
    moduleOptions,
    methods: {
      setBlockedIframes,
      setConsent,
    },
  }

  state.methods.setConsent({ isInit: true })

  // TODO: globalName
  // if (process.client) {
  //   const globalName = capitalize(moduleOptions.globalName) || 'Nuxt'
  //   window[`on${globalName}Ready`](() => {
  //     methods.setConsent()
  //   })
  // }

  return {
    provide: {
      cookies: state,
    },
  }
})
