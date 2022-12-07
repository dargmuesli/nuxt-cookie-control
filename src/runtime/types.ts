import { Ref } from 'vue'

import en from './locale/en'

export type Translatable = string | Record<string, string>

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export enum CookieType {
  NECESSARY = 'necessary',
  OPTIONAL = 'optional',
}

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

export interface Cookie {
  accepted?: Function
  async?: boolean
  declined?: Function
  description?: Translatable
  id?: string
  ids?: string[]
  name: Translatable
  src?: string
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
  optional: string
  save: string
  unsaved: string
}

export interface ModuleOptions {
  acceptNecessary?: boolean
  barPosition?:
    | 'top-left'
    | 'top-right'
    | 'top-full'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-full'
  blockIframe?: boolean | { initialState: boolean }
  colors?: Record<string, any>
  controlButton?: boolean
  cookies?: {
    necessary: Cookie[]
    optional: Cookie[]
  }
  css?: boolean
  cssPolyfill?: boolean
  dashInDescription?: boolean
  domain?: string
  locales?: string[]
  text?: LocaleStrings & { locale?: PartialRecord<Locale, LocaleStrings> }
}

export const DEFAULTS: Required<ModuleOptions> = {
  acceptNecessary: true,
  barPosition: 'bottom-full', //
  blockIframe: false,
  controlButton: true, //
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
  css: true, //
  cssPolyfill: true, //
  dashInDescription: true,
  domain: '',
  locales: ['en'],
  text: en,
}

export interface State {
  cookiesEnabled: Ref<Cookie[]>
  cookiesEnabledIds: Ref<string[]>
  cookiesOptional: Cookie[]
  isConsentGiven: Ref<boolean>
  isModalActive: Ref<boolean>
  moduleOptions: ModuleOptions
}
