export type {
  Cookie,
  Locale,
  LocaleStrings,
  ModuleOptions,
  PartialRecord,
  State,
  Translatable,
} from '../types'
export { CookieType, DEFAULTS } from '../types'

declare module '#app' {
  interface NuxtApp {
    $cookies: import('../types').State
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $cookies: import('../types').State
  }
}
