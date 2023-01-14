import { Ref } from 'vue'

import en from './locale/en'

export type Locale =
  | 'ar'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'hr'
  | 'hu'
  | 'it'
  | 'ja'
  | 'nl'
  | 'no'
  | 'pt'
  | 'ru'
  | 'uk'

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type Translatable = string | PartialRecord<Locale, string>

export enum CookieType {
  NECESSARY = 'necessary',
  OPTIONAL = 'optional',
}

export interface Cookie {
  description?: Translatable
  id?: string
  name: Translatable
  src?: string
  targetCookieIds?: string[]
}

export interface LocaleStrings {
  acceptAll: string
  acceptNecessary: string
  barDescription: string
  barTitle: string
  blockedIframe: string
  close: string
  declineAll: string
  functional: string
  here: string
  manageCookies: string
  necessary: string
  none: string
  optional: string
  save: string
  unsaved: string
}

export interface ModuleOptions {
  barPosition?:
    | 'top-left'
    | 'top-right'
    | 'top-full'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-full'
  colors?: false | Record<string, any>
  cookies: {
    necessary: Cookie[]
    optional: Cookie[]
  }
  cookieExpiryOffsetMs: number
  cookieNameIsConsentGiven: string
  cookieNameCookiesEnabledIds: string
  isAcceptNecessaryButtonEnabled?: boolean
  isControlButtonEnabled?: boolean
  isCookieIdVisible?: boolean
  isCssEnabled?: boolean
  isCssPolyfillEnabled?: boolean
  isDashInDescriptionEnabled?: boolean
  isIframeBlocked?: boolean | { initialState: boolean }
  domain?: string
  locales: Locale[]
  localeTexts: PartialRecord<Locale, LocaleStrings>
}

export const DEFAULTS: Required<ModuleOptions> = {
  barPosition: 'bottom-full',
  colors: {
    barBackground: '#000',
    barButtonBackground: '#fff',
    barButtonColor: '#000',
    barButtonHoverBackground: '#333',
    barButtonHoverColor: '#fff',
    barTextColor: '#fff',
    checkboxActiveBackground: '#000',
    checkboxActiveCircleBackground: '#fff',
    checkboxDisabledBackground: '#ddd',
    checkboxDisabledCircleBackground: '#fff',
    checkboxInactiveBackground: '#000',
    checkboxInactiveCircleBackground: '#fff',
    controlButtonBackground: '#fff',
    controlButtonHoverBackground: '#000',
    controlButtonIconColor: '#000',
    controlButtonIconHoverColor: '#fff',
    modalBackground: '#fff',
    modalButtonBackground: '#000',
    modalButtonColor: '#fff',
    modalButtonHoverBackground: '#333',
    modalButtonHoverColor: '#fff',
    modalOverlay: '#000',
    modalOverlayOpacity: 0.8,
    modalTextColor: '#000',
    modalUnsavedColor: '#fff',
  },
  cookies: {
    necessary: [],
    optional: [],
  },
  cookieExpiryOffsetMs: 1000 * 60 * 60 * 24 * 365, // one year
  cookieNameIsConsentGiven: 'cookie_control_is_consent_given',
  cookieNameCookiesEnabledIds: 'cookie_control_cookies_enabled_ids',
  isAcceptNecessaryButtonEnabled: true,
  isControlButtonEnabled: true,
  isCookieIdVisible: false,
  isCssEnabled: true,
  isCssPolyfillEnabled: true,
  isDashInDescriptionEnabled: true,
  isIframeBlocked: false,
  domain: '',
  locales: ['en'],
  localeTexts: { en },
}

export interface State {
  cookiesEnabled: Ref<Cookie[] | undefined>
  cookiesEnabledIds: Ref<string[] | undefined>
  isConsentGiven: Ref<boolean | undefined>
  isModalActive: Ref<boolean>
  moduleOptions: ModuleOptions
}
