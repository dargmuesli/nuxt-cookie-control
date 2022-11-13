import Cookies from 'js-cookie'
import slugify from 'slugify'

import { useNuxtCookieControl } from './composables'
import { State, Translatable } from './types'

export function acceptNecessary() {
  const { consent, moduleOptions } = useNuxtCookieControl()

  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)

  const necessaryCookieIds = moduleOptions.cookies.necessary.map(
    (necessaryCookie) =>
      necessaryCookie.id || slugify(resolveTranslatable(necessaryCookie.name))
  )

  Cookies.set('cookie_control_enabled_cookies', necessaryCookieIds.join(','), {
    expires,
  })
  Cookies.set('cookie_control_consent', 'true', { expires })

  consent.value = true

  if (process.client) {
    setHead()
    callAcceptedFunctions()
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

export function setConsent({ isInit = false }: { isInit: boolean }) {
  const { consent, moduleOptions, enabled, enabledList, optional } =
    useNuxtCookieControl()

  consent.value = Cookies.get('cookie_control_consent') === 'true'
  enabled.value = []
  enabledList.value = []
  if (consent.value === true) {
    const enabledFromCookie = Cookies.get('cookie_control_enabled_cookies')
    enabled.value.push(
      ...optional.filter((c) => {
        const cookieName =
          typeof c.name === 'string' ? c.name : c.name[Object.keys(c.name)[0]]
        return enabledFromCookie.includes(c.id || slugify(cookieName))
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

  if (moduleOptions.cookies.necessary)
    enabled.value.push(
      ...moduleOptions.cookies.necessary.filter((c) => {
        return c.src || c.accepted
      })
    )

  if (process.client && !isInit) {
    setHead()
    clearCookies()
    callAcceptedFunctions()
  }
}

export function clearCookies() {
  const { enabledList, optional } = useNuxtCookieControl()
  const nuxtApp = useNuxtApp()

  const disabled = optional.filter((optionalCookie) => {
    const cookieName =
      typeof optionalCookie.name === 'string'
        ? optionalCookie.name
        : optionalCookie.name[Object.keys(optionalCookie.name)[0]]
    return !enabledList.value.includes(optionalCookie.id || slugify(cookieName))
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

export function setHead() {
  const { enabled } = useNuxtCookieControl()
  const nuxtApp = useNuxtApp()

  if (enabled.value.length > 0) {
    const head = document.getElementsByTagName('head')[0]
    enabled.value.forEach((c) => {
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

export function callAcceptedFunctions() {
  const { enabled } = useNuxtCookieControl()
  const nuxtApp = useNuxtApp()

  if (enabled.value.length > 0) {
    enabled.value.forEach((c) => {
      if (c.accepted) c.accepted().call(nuxtApp)
    })
  }
}

export function setBlockedIframes(cookies: State, content: any) {
  const contentType = typeof content
  content = contentType === 'string' ? content : JSON.stringify(content)

  content = content.replace(/&lt;/g, '<')
  content = content.replace(/&gt;/g, '>')

  if (
    cookies.enabled.value.filter((c) => c.name === 'functional').length === 0
  ) {
    content = content.replace(
      /<iframe/g,
      `<div class='cookieControl__BlockedIframe '`
    )
    content = content.replace(
      /<\/iframe/g,
      `<p>${
        cookies.moduleOptions.text.blockedIframe !== undefined
          ? cookies.moduleOptions.text.blockedIframe
          : ''
      } <a href='#' onclick='event.preventDefault(); $${
        cookies.moduleOptions.globalName
      }.$cookies.modal = true'>${
        cookies.moduleOptions.text.here !== undefined
          ? cookies.moduleOptions.text.here
          : ''
      }</a></p></div`
    )
  }

  return contentType !== 'string' ? JSON.parse(content) : content
}
