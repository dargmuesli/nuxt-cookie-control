import { setBlockedIframes, setConsent } from './methods'
import { State } from './types'

import moduleOptions from '#build/nuxtCookieControl.options'

export function useNuxtCookieControl() {
  const consent = ref()
  const enabled = ref()

  return {
    consent,
    enabled,
    methods: {
      setBlockedIframes,
      setConsent,
    },
    moduleOptions,
  } as State
}

// consent?: Ref<boolean>
// enabled?: Cookie[]
// enabledList?: string[]
// methods?: {
//   setBlockedIframes: (cookies: State, content: any) => any
//   setConsent: ({ isInit = false }?: { isInit?: boolean }) => void
// }
// modal?: boolean
// optional?: Cookie[]
// moduleOptions?: ModuleOptions
