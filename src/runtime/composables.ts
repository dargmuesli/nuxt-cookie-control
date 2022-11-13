import { State } from './types'

export function useNuxtCookieControl() {
  const { $cookies } = useNuxtApp()

  const consent = ref()
  const enabled = ref()

  return {
    consent,
    enabled,
    moduleOptions: $cookies.moduleOptions,
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
