import { State } from './types'

import { useNuxtApp } from '#imports'

export const useCookieControl: () => State = () => useNuxtApp().$cookies
