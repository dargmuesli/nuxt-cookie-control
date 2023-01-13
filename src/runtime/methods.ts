import Cookies from 'js-cookie'
import slugify from '@sindresorhus/slugify'
import { Ref } from 'vue'

import { useCookieControl } from './composables'
import { LOCALE_DEFAULT } from './constants'
import { Cookie, ModuleOptions, Translatable } from './types'

export const useAcceptNecessary = () => {
  const { cookiesEnabled, moduleOptions } = useCookieControl()

  return () => acceptNecessary(cookiesEnabled, moduleOptions.cookies?.necessary)
}

export const acceptNecessary = (
  cookiesEnabledRef: Ref<Cookie[]>,
  cookiesNecessary: Cookie[] = []
) => {
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)

  const necessaryCookieIds = cookiesNecessary.map((necessaryCookie) =>
    getCookieId(necessaryCookie)
  )

  setCookies({
    isConsentGiven: true,
    cookieIds: necessaryCookieIds,
    expires,
  })

  setHead(cookiesEnabledRef.value)
}

export const useResolveTranslatable = (locale = LOCALE_DEFAULT) => {
  return (translatable: Translatable) =>
    resolveTranslatable(translatable, locale)
}

const resolveTranslatable = (
  translatable: Translatable,
  locale = LOCALE_DEFAULT
) => {
  if (typeof translatable === 'string') return translatable

  if (!locale)
    throw new Error('No locale given for translatable that is not a string.')

  const result = translatable[locale]

  if (!result)
    throw new Error(`Could not get translation for locale ${locale}.`)

  return result
}

export const useSetConsent = () => {
  const { isConsentGiven, moduleOptions, cookiesEnabled, cookiesEnabledIds } =
    useCookieControl()

  return () =>
    setConsent({
      isInit: false,
      isConsentGiven,
      moduleOptions,
      cookiesEnabled,
      cookiesEnabledIds,
    })
}

export const setConsent = ({
  isInit = false,
  isConsentGiven,
  moduleOptions,
  cookiesEnabled,
  cookiesEnabledIds,
}: {
  isInit: boolean
  isConsentGiven: Ref<boolean | undefined>
  moduleOptions: ModuleOptions
  cookiesEnabled: Ref<Cookie[]>
  cookiesEnabledIds: Ref<string[]>
}) => {
  isConsentGiven.value = Cookies.get('cookie_control_consent') === 'true'
  cookiesEnabled.value = []
  cookiesEnabledIds.value = []

  if (isConsentGiven.value) {
    const enabledFromCookie = Cookies.get('cookie_control_enabled_cookies')

    cookiesEnabled.value.push(
      ...moduleOptions.cookies.optional.filter((cookieOptional) =>
        enabledFromCookie?.includes(getCookieId(cookieOptional))
      )
    )
  }

  if (moduleOptions.cookies?.necessary)
    cookiesEnabled.value.push(
      ...moduleOptions.cookies.necessary.filter(
        (cookieNecessary) => cookieNecessary.src
      )
    )

  cookiesEnabledIds.value = cookiesEnabled.value.map((cookieEnabled) =>
    getCookieId(cookieEnabled)
  )

  if (process.client && !isInit) {
    setHead(cookiesEnabled.value)
    clearCookies(cookiesEnabledIds.value, moduleOptions.cookies.optional)
  }
}

export const getCookieControlConsent = () =>
  Cookies.get('cookie_control_consent')

export const getCookieId = (cookie: Cookie) =>
  cookie.id || slugify(resolveTranslatable(cookie.name))

export const clearCookies = (
  cookiesEnabledIds: string[],
  cookiesOptional: Cookie[]
) => {
  const cookiesDisabled = cookiesOptional.filter(
    (cookieOptional) => !cookiesEnabledIds.includes(getCookieId(cookieOptional))
  )

  for (const cookieDisabled of cookiesDisabled) {
    if (!cookieDisabled.targetCookieIds) continue

    for (const cookieDisabledId of cookieDisabled.targetCookieIds) {
      Cookies.remove(cookieDisabledId)
    }

    if (cookieDisabled.src) {
      for (const s of [
        ...document.head.querySelectorAll(
          `script[src="${cookieDisabled.src}"]`
        ),
      ]) {
        s.parentNode?.removeChild(s)
      }
    }
  }
}

export const setHead = (enabledCookies: Cookie[]) => {
  const head = document.getElementsByTagName('head')[0]

  for (const cookieEnabled of enabledCookies) {
    if (!cookieEnabled.src) continue

    const script = document.createElement('script')
    script.src = cookieEnabled.src
    head.appendChild(script)
  }
}

export const setCookies = ({
  isConsentGiven,
  cookieIds,
  expires,
}: {
  isConsentGiven: boolean
  cookieIds: string[]
  expires: Date
}) => {
  Cookies.set(
    'cookie_control_enabled_cookies',
    isConsentGiven ? cookieIds.join(',') : '',
    {
      expires,
    }
  )
  Cookies.set('cookie_control_consent', isConsentGiven.toString(), {
    expires,
  })
}
