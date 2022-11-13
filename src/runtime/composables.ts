import { setBlockedIframes, setConsent } from './methods'
import { Cookie, State } from './types'

import moduleOptions from '#build/nuxtCookieControl.options'

export function useNuxtCookieControl() {
  const consent = ref<boolean>()
  const enabled = ref<Cookie[]>([])
  const enabledList = ref<string[]>([])
  const modal = ref<boolean>()
  const optional: Cookie[] = []

  return {
    consent,
    enabled,
    enabledList,
    modal,
    optional,
    methods: {
      setBlockedIframes,
      setConsent,
    },
    moduleOptions,
  } as State
}
