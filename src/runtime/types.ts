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
  colors: false | Record<string, any>
  cookieExpiryOffsetMs: number
  cookieNameCookiesEnabledIds: string
  cookieNameIsConsentGiven: string
  cookies: {
    necessary: Cookie[]
    optional: Cookie[]
  }
  domain: string
  isAcceptNecessaryButtonEnabled: boolean
  isControlButtonEnabled: boolean
  isCookieIdVisible: boolean
  isCssEnabled: boolean
  isCssPonyfillEnabled: boolean
  isDashInDescriptionEnabled: boolean
  isIframeBlocked: boolean | { initialState: boolean }
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
    focusRingColor: '#808080',
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
  cookieNameIsConsentGiven: 'ncc_c',
  cookieNameCookiesEnabledIds: 'ncc_e',
  isAcceptNecessaryButtonEnabled: true,
  isControlButtonEnabled: true,
  isCookieIdVisible: false,
  isCssEnabled: true,
  isCssPonyfillEnabled: false,
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
