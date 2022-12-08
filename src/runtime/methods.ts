import Cookies from 'js-cookie'
// import { NuxtApp } from 'nuxt/dist/app/nuxt'
import slugify from 'slugify'
import { Ref } from 'vue'

import { useCookieControl } from './composables'
import { LOCALE_DEFAULT } from './constants'
import { Cookie, ModuleOptions, Translatable } from './types'

export const useAcceptNecessary = () => {
  const { cookiesEnabled, isConsentGiven, moduleOptions } = useCookieControl()
  // const nuxtApp = useNuxtApp()

  return () =>
    acceptNecessary(
      // nuxtApp,
      cookiesEnabled,
      isConsentGiven,
      moduleOptions.cookies?.necessary
    )
}

export const acceptNecessary = (
  // nuxtApp: NuxtApp,
  enabled: Ref<Cookie[]>,
  consent: Ref<boolean>,
  necessaryCookies: Cookie[] = []
) => {
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)

  const necessaryCookieIds = necessaryCookies.map((necessaryCookie) =>
    getCookieId(necessaryCookie)
  )

  Cookies.set('cookie_control_enabled_cookies', necessaryCookieIds.join(','), {
    expires,
  })
  Cookies.set('cookie_control_consent', 'true', { expires })

  consent.value = true

  if (process.client) {
    setHead(/* nuxtApp, */ enabled.value)
    // callAcceptedFunctions(nuxtApp, enabled.value)
  }
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
  // const nuxtApp = useNuxtApp()
  return () =>
    setConsent({
      isInit: false,
      // nuxtApp,
      isConsentGiven,
      moduleOptions,
      cookiesEnabled,
      cookiesEnabledIds,
    })
}

export const setConsent = ({
  isInit = false,
  // nuxtApp,
  isConsentGiven,
  moduleOptions,
  cookiesEnabled,
  cookiesEnabledIds,
}: {
  isInit: boolean
  // nuxtApp: NuxtApp
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
      ...moduleOptions.cookies.optional.filter((cookieOptional) => {
        return enabledFromCookie?.includes(getCookieId(cookieOptional))
      })
    )
  }

  if (moduleOptions.cookies?.necessary)
    cookiesEnabled.value.push(
      ...moduleOptions.cookies.necessary.filter((cookieNecessary) => {
        return cookieNecessary.src // || c.onAccept
      })
    )

  cookiesEnabledIds.value = cookiesEnabled.value.map((cookieEnabled) =>
    getCookieId(cookieEnabled)
  )

  if (process.client && !isInit) {
    setHead(/* nuxtApp, */ cookiesEnabled.value)
    clearCookies(
      // nuxtApp,
      cookiesEnabledIds.value,
      moduleOptions.cookies.optional
    )
    // callAcceptedFunctions(nuxtApp, cookiesEnabled.value)
  }
}

export const getCookieId = (cookie: Cookie) =>
  cookie.id || slugify(resolveTranslatable(cookie.name))

export const clearCookies = (
  // nuxtApp: NuxtApp,
  cookiesEnabledIds: string[],
  cookiesOptional: Cookie[]
) => {
  const cookiesDisabled = cookiesOptional.filter(
    (cookieOptional) => !cookiesEnabledIds.includes(getCookieId(cookieOptional))
  )

  for (const cookieDisabled of cookiesDisabled) {
    // if (cookieDisabled.onDecline) cookieDisabled.onDecline().call(nuxtApp)
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

export const setHead = (/* nuxtApp: NuxtApp, */ enabledCookies: Cookie[]) => {
  const head = document.getElementsByTagName('head')[0]

  for (const cookieEnabled of enabledCookies) {
    if (!cookieEnabled.src) continue

    const script = document.createElement('script')
    script.src = cookieEnabled.src
    // script.addEventListener('load', () => {
    //   if (cookieEnabled.onAccept) cookieEnabled.onAccept().call(nuxtApp)
    // })
    head.appendChild(script)
  }
}

// export const callAcceptedFunctions = (
//   nuxtApp: NuxtApp,
//   cookiesEnabled: Cookie[]
// ) => {
//   for (const cookieEnabled of cookiesEnabled) {
//     if (!cookieEnabled.onAccept) continue

//     cookieEnabled.onAccept().call(nuxtApp)
//   }
// }
