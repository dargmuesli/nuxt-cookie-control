import type { Ref } from 'vue'
import type { CookieOptions } from 'nuxt/app'

export type Locale =
  | 'ar'
  | 'az'
  | 'be'
  | 'bg'
  | 'ca'
  | 'cs'
  | 'da'
  | 'de'
  | 'en'
  | 'es'
  | 'fi'
  | 'fr'
  | 'hr'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'km'
  | 'ko'
  | 'lt'
  | 'nl'
  | 'no'
  | 'oc'
  | 'pt'
  | 'pl'
  | 'ro'
  | 'rs'
  | 'ru'
  | 'sk'
  | 'sv'
  | 'tr'
  | 'uk'
  | 'zh-CN'

export type PartialRecord<K extends string | number | symbol, T> = Partial<
  Record<K, T>
>

export type Translatable = string | PartialRecord<Locale, string>

export enum CookieType {
  NECESSARY = 'necessary',
  OPTIONAL = 'optional',
}

export interface Cookie {
  description?: Translatable
  id: string
  isPreselected?: boolean
  name: Translatable
  links?: Record<string, string | null>
  src?: string
  targetCookieIds?: string[]
}

export interface LocaleStrings {
  accept: string
  acceptAll: string
  bannerDescription: string
  bannerTitle: string
  close: string
  cookiesFunctional: string
  cookiesNecessary: string
  cookiesOptional: string
  iframeBlocked: string
  decline: string
  declineAll: string
  here: string
  manageCookies: string
  save: string
  settingsUnsaved: string
}

export interface ModuleOptions {
  barPosition:
    | 'top-left'
    | 'top-right'
    | 'top-full'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-full'
  closeModalOnClickOutside: boolean
  colors: false | Record<string, unknown>
  cookieExpiryOffsetMs: number
  cookieNameCookiesEnabledIds: string
  cookieNameIsConsentGiven: string
  cookies: {
    necessary: Cookie[]
    optional: Cookie[]
  }
  cookieOptions: CookieOptions & { readonly?: false }
  isAcceptNecessaryButtonEnabled: boolean
  isControlButtonEnabled: boolean
  isCookieIdVisible: boolean
  isCssEnabled: boolean
  isCssPonyfillEnabled: boolean
  isDashInDescriptionEnabled: boolean
  isIframeBlocked: boolean
  isModalForced: boolean
  locales: Locale[]
  localeTexts: PartialRecord<Locale, Partial<LocaleStrings>>
}

export interface State {
  cookiesEnabled: Ref<Cookie[] | undefined>
  cookiesEnabledIds: Ref<string[] | undefined>
  isConsentGiven: Ref<boolean | undefined>
  isModalActive: Ref<boolean>
  locale: Ref<Locale>
  moduleOptions: ModuleOptions
}
