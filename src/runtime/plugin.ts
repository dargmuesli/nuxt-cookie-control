import { defineNuxtPlugin } from '#app'

import { State } from '../types'

import moduleOptions from '#build/nuxtCookieControl.options.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const state: State = {
    moduleOptions,
  }

  const methods = {
    get: (cookie) => {
      if (process.browser) {
        const decodedCookie = decodeURIComponent(document.cookie)
        const ca = decodedCookie.split(';')
        const name = `${cookie}=`
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i]
          while (c.charAt(0) === ' ') {
            c = c.substring(1)
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
          }
        }
      }
      return ''
    },

    set: ({ name, value = '', expires = '', path = '/', domain }) => {
      const domainName =
        domain || (moduleOptions.domain ? `.${moduleOptions.domain}` : domain)
      if (process.browser) {
        document.cookie = `${name}=${value};expires=${expires};path=${path}${
          domainName !== undefined ? `;domain=${domainName}` : ';'
        }`
      } else if (process.server) {
        nuxtApp.res.setHeader('Set-Cookie', [
          `${name}=${value}; Expires=${expires}; Path=${path}${
            domainName !== undefined ? `; Domain=${domainName}` : ';'
          }`,
        ])
      }
    },

    isEnabled: (identifier) => {
      return (
        state.enabledList.includes(identifier) ||
        state.enabledList.includes(methods.slugify(identifier))
      )
    },

    setBlockedIframes: (content) => {
      const type = (typeof content).toLowerCase()
      let c = type !== 'string' ? JSON.stringify(content) : content
      c = c.replace(/&lt;/g, '<')
      c = c.replace(/&gt;/g, '>')
      if (
        nuxtApp.app.$cookies.enabled.filter((c) => {
          return c.name === 'functional'
        }).length === 0
      ) {
        c = c.replace(/<iframe/g, `<div class='cookieControl__BlockedIframe '`)
        c = c.replace(
          /<\/iframe/g,
          `<p>${
            nuxtApp.app.$cookies.text.blockedIframe !== undefined
              ? nuxtApp.app.$cookies.text.blockedIframe
              : ''
          } <a href='#' onclick='event.preventDefault(); $${
            moduleOptions.globalName
          }.$cookies.modal = true'>${
            nuxtApp.app.$cookies.text.here !== undefined
              ? nuxtApp.app.$cookies.text.here
              : ''
          }</a></p></div`
        )
      }
      return type !== 'string' ? JSON.parse(c) : c
    },

    slugify: (str) => {
      str = str.replace(/^\s+|\s+$/g, '')
      str = str.toLowerCase()
      const from =
        'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
      const to =
        'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------'
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      str = str
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

      return str
    },

    remove: (name) => {
      if (process.browser) {
        const domain = window.location.hostname
        methods.set({ name, expires: 'Thu, 01 Jan 1970 00:00:00 GMT', domain })
        for (let j = domain.split('.'); j.length; ) {
          const o = j.join('.')
          methods.set({
            name,
            expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
            domain: `.${o}`,
          })
          j.shift()
        }
      }
    },

    acceptNecessary: () => {
      const expires = new Date()
      expires.setFullYear(expires.getFullYear() + 1)
      const expiresUtc = expires.toUTCString()
      const value = state.moduleOptions.cookies.necessary.map(
        (c) => c.identifier || state.methods.slugify(methods.getName(c.name))
      )
      state.methods.set({
        name: 'cookie_control_enabled_cookies',
        value,
        expiresUtc,
      })
      state.methods.set({
        name: 'cookie_control_consent',
        value: true,
        expiresUtc,
      })
      state.consent = true
      if (process.client) {
        setHead()
        callAcceptedFunctions()
      }
    },

    getName: (name) => {
      return typeof name === 'string' ? name : name[Object.keys(name)[0]]
    },

    setConsent: (isInit = false) => {
      state.consent = methods.get('cookie_control_consent') === 'true'
      state.enabled = []
      state.enabledList = []
      if (state.consent === true) {
        const enabledFromCookie = methods.get('cookie_control_enabled_cookies')
        state.enabled.push(
          ...state.optional.filter((c) => {
            const cookieName =
              typeof c.name === 'string'
                ? c.name
                : c.name[Object.keys(c.name)[0]]
            return enabledFromCookie.includes(
              c.identifier || methods.slugify(cookieName)
            )
          })
        )
        state.enabledList =
          state.enabled.length > 0
            ? state.enabled.map((c) => {
                const cookieName =
                  typeof c.name === 'string'
                    ? c.name
                    : c.name[Object.keys(c.name)[0]]
                return c.identifier || methods.slugify(cookieName)
              })
            : []
      }

      if (moduleOptions.cookies.necessary)
        state.enabled.push(
          ...moduleOptions.cookies.necessary.filter((c) => {
            return c.src || c.accepted
          })
        )

      if (process.client && !isInit) {
        setHead()
        clearCookies()
        callAcceptedFunctions()
      }
    },
  }

  Object.assign(state, { methods })

  const clearCookies = () => {
    const disabled = state.optional.filter((c) => {
      const cookieName =
        typeof c.name === 'string' ? c.name : c.name[Object.keys(c.name)[0]]
      return !state.enabledList.includes(
        c.identifier || methods.slugify(cookieName)
      )
    })
    if (disabled.length > 0) {
      disabled.forEach((c) => {
        if (c.declined) c.declined()
        if (c.ids && c.ids.length > 0) {
          c.ids.forEach((i) => {
            methods.remove(i)
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

  const setHead = () => {
    if (state.enabled.length > 0) {
      const head = document.getElementsByTagName('head')[0]
      state.enabled.forEach((c) => {
        if (c.src) {
          const script = document.createElement('script')
          script.src = c.src
          head.appendChild(script)
          script.addEventListener('load', () => {
            if (c.accepted) c.accepted()
          })
        }
      })
    }
  }

  const callAcceptedFunctions = () => {
    if (state.enabled.length > 0) {
      state.enabled.forEach((c) => {
        if (c.accepted) c.accepted()
      })
    }
  }

  // const capitalize = (s) => {
  //   if (typeof s !== 'string') return ''
  //   return s.charAt(0).toUpperCase() + s.slice(1)
  // }

  methods.setConsent(true)

  // if (process.client) {
  //   const globalName = capitalize(moduleOptions.globalName) || 'Nuxt'
  //   window[`on${globalName}Ready`](() => {
  //     methods.setConsent()
  //   })
  // }

  // inject('cookies', state)
  // if(cookies.blockIframe) Vue.component('CookieIframe', CookieIframe);
  // Vue.component('CookieControl', CookieControl);

  return {
    provide: {
      cookies: state,
    },
  }
})
