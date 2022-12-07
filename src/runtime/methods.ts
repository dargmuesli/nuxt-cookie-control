import Cookies from 'js-cookie'
import { NuxtApp } from 'nuxt/dist/app/nuxt'
import slugify from 'slugify'
import { Ref } from 'vue'

import { useCookieControl } from './composables'
import { Cookie, ModuleOptions, Translatable } from './types'

export function useAcceptNecessary() {
  const {
    cookiesEnabled: enabled,
    isConsentGiven: consent,
    moduleOptions,
  } = useCookieControl()
  const nuxtApp = useNuxtApp()

  return () =>
    acceptNecessary(nuxtApp, enabled, consent, moduleOptions.cookies?.necessary)
}

export function acceptNecessary(
  nuxtApp: NuxtApp,
  enabled: Ref<Cookie[]>,
  consent: Ref<boolean>,
  necessaryCookies: Cookie[] = []
) {
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)

  const necessaryCookieIds = necessaryCookies.map(
    (necessaryCookie) =>
      necessaryCookie.id || slugify(resolveTranslatable(necessaryCookie.name))
  )

  Cookies.set('cookie_control_enabled_cookies', necessaryCookieIds.join(','), {
    expires,
  })
  Cookies.set('cookie_control_consent', 'true', { expires })

  consent.value = true

  if (process.client) {
    setHead(nuxtApp, enabled.value)
    callAcceptedFunctions(nuxtApp, enabled.value)
  }
}

export function resolveTranslatable(translatable: Translatable) {
  return typeof translatable === 'string'
    ? translatable
    : translatable[Object.keys(translatable)[0]]
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.substring(1)
}

export function useSetConsent() {
  const {
    isConsentGiven: consent,
    moduleOptions,
    cookiesEnabled,
    cookiesEnabledIds,
    cookiesOptional,
  } = useCookieControl()
  const nuxtApp = useNuxtApp()
  return () =>
    setConsent({
      isInit: false,
      nuxtApp,
      isConsentGiven: consent,
      moduleOptions,
      cookiesEnabled,
      cookiesEnabledIds,
      cookiesOptional,
    })
}

export function setConsent({
  isInit = false,
  nuxtApp,
  isConsentGiven,
  moduleOptions,
  cookiesEnabled,
  cookiesEnabledIds,
  cookiesOptional,
}: {
  isInit: boolean
  nuxtApp: NuxtApp
  isConsentGiven: Ref<boolean | undefined>
  moduleOptions: ModuleOptions
  cookiesEnabled: Ref<Cookie[]>
  cookiesEnabledIds: Ref<string[]>
  cookiesOptional: Cookie[]
}) {
  isConsentGiven.value = Cookies.get('cookie_control_consent') === 'true'
  cookiesEnabled.value = []
  cookiesEnabledIds.value = []

  if (isConsentGiven.value) {
    const enabledFromCookie = Cookies.get('cookie_control_enabled_cookies')

    cookiesEnabled.value.push(
      ...cookiesOptional.filter((c) => {
        const cookieName = resolveTranslatable(c.name)
        return (
          enabledFromCookie &&
          enabledFromCookie.includes(c.id || slugify(cookieName))
        )
      })
    )

    cookiesEnabledIds.value =
      cookiesEnabled.value.length > 0
        ? cookiesEnabled.value.map((c) => {
            const cookieName = resolveTranslatable(c.name)
            return c.id || slugify(cookieName)
          })
        : []
  }

  if (moduleOptions.cookies?.necessary)
    cookiesEnabled.value.push(
      ...moduleOptions.cookies.necessary.filter((c) => {
        return c.src || c.accepted
      })
    )

  if (process.client && !isInit) {
    setHead(nuxtApp, cookiesEnabled.value)
    clearCookies(nuxtApp, cookiesEnabledIds.value, cookiesOptional)
    callAcceptedFunctions(nuxtApp, cookiesEnabled.value)
  }
}

export function clearCookies(
  nuxtApp: NuxtApp,
  enabledList: string[],
  optional: Cookie[]
) {
  const disabled = optional.filter((optionalCookie) => {
    const cookieName = resolveTranslatable(optionalCookie.name)
    return !enabledList.includes(optionalCookie.id || slugify(cookieName))
  })

  if (disabled.length > 0) {
    disabled.forEach((c) => {
      if (c.declined) c.declined().call(nuxtApp)
      if (c.ids && c.ids.length > 0) {
        c.ids.forEach((i) => {
          Cookies.remove(i)
        })
      }
      // if(c.src){
      //   for(let s of [...document.head.querySelectorAll(`script[src="${c.src}"]`)]){
      //     s.parentNode.removeChild(s)
      //   }
      // }
    })
  }
}

export function setHead(nuxtApp: NuxtApp, enabled: Cookie[]) {
  if (enabled.length > 0) {
    const head = document.getElementsByTagName('head')[0]
    enabled.forEach((c) => {
      if (c.src) {
        const script = document.createElement('script')
        script.src = c.src
        head.appendChild(script)
        script.addEventListener('load', () => {
          if (c.accepted) c.accepted().call(nuxtApp)
        })
      }
    })
  }
}

export function callAcceptedFunctions(nuxtApp: NuxtApp, enabled: Cookie[]) {
  if (enabled.length > 0) {
    enabled.forEach((c) => {
      if (c.accepted) c.accepted().call(nuxtApp)
    })
  }
}

// export function setBlockedIframes(content: any) {
//   const { enabled, moduleOptions } = useCookieControl()

//   const contentType = typeof content
//   content = contentType === 'string' ? content : JSON.stringify(content)

//   content = content.replace(/&lt;/g, '<')
//   content = content.replace(/&gt;/g, '>')

//   if (
//     moduleOptions.text &&
//     enabled.value.filter((c) => c.name === 'functional').length === 0
//   ) {
//     content = content.replace(
//       /<iframe/g,
//       `<div class='cookieControl__BlockedIframe '`
//     )
//     content = content.replace(
//       /<\/iframe/g,
//       `<p>${
//         moduleOptions.text.blockedIframe !== undefined
//           ? moduleOptions.text.blockedIframe
//           : ''
//       } <a href='#' onclick='event.preventDefault(); $Nuxt.$cookies.modal = true'>${
//         moduleOptions.text.here !== undefined ? moduleOptions.text.here : ''
//       }</a></p></div`
//     )
//   }

//   return contentType !== 'string' ? JSON.parse(content) : content
// }
