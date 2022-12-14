import { Ref } from 'vue'

import en from './locale/en'

export enum Locale {
  AR = 'ar',
  DE = 'de',
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  HR = 'hr',
  HU = 'hu',
  IT = 'it',
  JA = 'ja',
  NL = 'nl',
  NO = 'no',
  PT = 'pt',
  RU = 'ru',
  UK = 'uk',
}

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
  // onAccept?: Function
  // onDecline?: Function
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
  isAcceptNecessaryButtonEnabled?: boolean
  isControlButtonEnabled?: boolean
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
  isAcceptNecessaryButtonEnabled: true,
  isControlButtonEnabled: true,
  isCssEnabled: true,
  isCssPolyfillEnabled: true,
  isDashInDescriptionEnabled: true,
  isIframeBlocked: false,
  domain: '',
  locales: [Locale.EN],
  localeTexts: { en },
}

export interface State {
  cookiesEnabled: Ref<Cookie[]>
  cookiesEnabledIds: Ref<string[]>
  isConsentGiven: Ref<boolean>
  isModalActive: Ref<boolean>
  moduleOptions: ModuleOptions
}
