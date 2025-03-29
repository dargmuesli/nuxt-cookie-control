import type { State } from '#cookie-control/types'
import { useNuxtApp } from '#imports'

export const useCookieControl: () => State = () => useNuxtApp().$cookies
