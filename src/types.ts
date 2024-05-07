import type { Ref } from 'vue'
import type { CookieOptions } from 'nuxt/app'

// TODO: reenable import (https://github.com/nuxt/module-builder/issues/261)
// import en from './runtime/locale/en'

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

export const DEFAULTS: Required<ModuleOptions> = {
  barPosition: 'bottom-full',
  closeModalOnClickOutside: false,
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
  cookieOptions: {
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'development' ? undefined : true,
  },
  isAcceptNecessaryButtonEnabled: true,
  isControlButtonEnabled: true,
  isCookieIdVisible: false,
  isCssEnabled: true,
  isCssPonyfillEnabled: false,
  isDashInDescriptionEnabled: true,
  isIframeBlocked: false,
  isModalForced: false,
  locales: ['en'],

  // TODO: use Nuxt module "i18n"
  localeTexts: {
    en: {
      accept: 'Accept',
      acceptAll: 'Accept all',
      bannerDescription:
        'We use our own cookies and third-party cookies so that we can display this website correctly and better understand how this website is used, with a view to improving the services we offer. A decision on cookie usage permissions can be changed anytime using the cookie button that will appear after a selection has been made on this banner.',
      bannerTitle: 'Cookies',
      close: 'Close',
      cookiesFunctional: 'Functional cookies',
      cookiesNecessary: 'Necessary cookies',
      cookiesOptional: 'Optional cookies',
      decline: 'Decline',
      declineAll: 'Decline all',
      here: 'here',
      iframeBlocked: 'To see this, please enable functional cookies',
      manageCookies: 'Learn more and customize',
      save: 'Save',
      settingsUnsaved: 'You have unsaved settings',
    },
  },
}

export interface State {
  cookiesEnabled: Ref<Cookie[] | undefined>
  cookiesEnabledIds: Ref<string[] | undefined>
  isConsentGiven: Ref<boolean | undefined>
  isModalActive: Ref<boolean>
  locale: Ref<Locale>
  moduleOptions: ModuleOptions
}
