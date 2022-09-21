import en from './runtime/locale/en'

export interface Cookie {
  async?: boolean
  ids?: string[]
  description?: string | Record<string, string>
  identifier?: string
  name: string | Record<string, string>
  src?: string
  accepted?: () => void
  declined?: () => void
}

export interface I18n {
  barTitle: string
  barDescription: string
  acceptAll: string
  declineAll: string
  manageCookies: string
  unsaved: string
  close: string
  save: string
  necessary: string
  optional: string
  functional: string
  blockedIframe: string
  here: string
}

export interface ModuleOptions {
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
  globalName?: string
  locales?: string[]
  text?: I18n
}

export const DEFAULTS: Required<ModuleOptions> = {
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
  globalName: undefined,
  locales: ['en', 'de'],
  text: en,
}

export interface State {
  consent?: boolean
  enabled?: Cookie[]
  enabledList?: string[]
  methods?: {
    get: (cookie: string) => string
    set: (any: any) => void
    isEnabled: (identifier: string) => boolean
    setBlockedIframes: (content: any) => any
    slugify: (content: string) => string
    remove: (name: string) => void
    setConsent: (isInit?: boolean) => void
  }
  modal?: boolean
  optional?: Cookie[]
  moduleOptions?: ModuleOptions
}
