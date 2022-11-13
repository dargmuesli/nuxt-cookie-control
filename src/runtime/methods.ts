import Cookies from 'js-cookie'
import { NuxtApp } from 'nuxt/dist/app/nuxt'
import slugify from 'slugify'
import { Ref } from 'vue'

import { useNuxtCookieControl } from './composables'
import { Cookie, ModuleOptions, Translatable } from './types'

export function useAcceptNecessary() {
  const { enabled, consent, moduleOptions } = useNuxtCookieControl()
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
  const { consent, moduleOptions, enabled, enabledList, optional } =
    useNuxtCookieControl()
  const nuxtApp = useNuxtApp()
  return () =>
    setConsent({
      isInit: false,
      nuxtApp,
      consent,
      moduleOptions,
      enabled,
      enabledList,
      optional,
    })
}

export function setConsent({
  isInit = false,
  nuxtApp,
  consent,
  moduleOptions,
  enabled,
  enabledList,
  optional,
}: {
  isInit: boolean
  nuxtApp: NuxtApp
  consent: Ref<boolean>
  moduleOptions: ModuleOptions
  enabled: Ref<Cookie[]>
  enabledList: Ref<string[]>
  optional: Cookie[]
}) {
  consent.value = Cookies.get('cookie_control_consent') === 'true'
  enabled.value = []
  enabledList.value = []
  if (consent.value === true) {
    const enabledFromCookie = Cookies.get('cookie_control_enabled_cookies')
    enabled.value.push(
      ...optional.filter((c) => {
        const cookieName =
          typeof c.name === 'string' ? c.name : c.name[Object.keys(c.name)[0]]
        return (
          enabledFromCookie &&
          enabledFromCookie.includes(c.id || slugify(cookieName))
        )
      })
    )
    enabledList.value =
      enabled.value.length > 0
        ? enabled.value.map((c) => {
            const cookieName =
              typeof c.name === 'string'
                ? c.name
                : c.name[Object.keys(c.name)[0]]
            return c.id || slugify(cookieName)
          })
        : []
  }

  if (moduleOptions.cookies?.necessary)
    enabled.value.push(
      ...moduleOptions.cookies.necessary.filter((c) => {
        return c.src || c.accepted
      })
    )

  if (process.client && !isInit) {
    setHead(nuxtApp, enabled.value)
    clearCookies(nuxtApp, enabledList.value, optional)
    callAcceptedFunctions(nuxtApp, enabled.value)
  }
}

export function clearCookies(
  nuxtApp: NuxtApp,
  enabledList: string[],
  optional: Cookie[]
) {
  const disabled = optional.filter((optionalCookie) => {
    const cookieName =
      typeof optionalCookie.name === 'string'
        ? optionalCookie.name
        : optionalCookie.name[Object.keys(optionalCookie.name)[0]]
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
//   const { enabled, moduleOptions } = useNuxtCookieControl()

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
