import { ref } from 'vue'

import {
  COOKIE_ID_SEPARATOR,
  HTML_ATTRIBUTE_CONSENT,
} from '#cookie-control/constants'
import { getAllCookieIdsString } from '#cookie-control/methods'
import type { Cookie, State } from '#cookie-control/types'
import {
  defineNuxtPlugin,
  useCookie,
  useHead,
  useRuntimeConfig,
} from '#imports'

export default defineNuxtPlugin((_nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const moduleOptions = runtimeConfig.public.cookieControl

  const cookieIsConsentGiven = useCookie(
    moduleOptions.cookieNameIsConsentGiven,
    moduleOptions.cookieOptions,
  )
  const cookieCookiesEnabledIds = useCookie(
    moduleOptions.cookieNameCookiesEnabledIds,
    moduleOptions.cookieOptions,
  ).value?.split(COOKIE_ID_SEPARATOR)

  const isConsentGiven = ref<boolean | undefined>(
    cookieIsConsentGiven.value === undefined
      ? undefined
      : cookieIsConsentGiven.value === getAllCookieIdsString(moduleOptions),
  )
  const cookiesEnabled = ref<Cookie[] | undefined>(
    cookieCookiesEnabledIds === undefined
      ? undefined
      : [
          ...moduleOptions.cookies.necessary.filter((cookieNecessary) =>
            cookieCookiesEnabledIds.includes(cookieNecessary.id),
          ),
          ...moduleOptions.cookies.optional.filter((cookieOptional) =>
            cookieCookiesEnabledIds.includes(cookieOptional.id),
          ),
        ],
  )
  const cookiesEnabledIds = ref<string[] | undefined>(cookieCookiesEnabledIds)
  const isModalActive = ref<boolean>()
  const locale = ref<string>()

  if (import.meta.server) {
    // The server markup must not depend on the consent cookie, so that it can be cached for all visitors.
    // This inline script hides the bar for returning visitors before the first paint instead.
    // It accepts both encodings `useCookie` may write.
    const allCookieIdsString = getAllCookieIdsString(moduleOptions)
    const cookieEntries = [
      allCookieIdsString,
      JSON.stringify(allCookieIdsString),
    ].map(
      (value) =>
        `${moduleOptions.cookieNameIsConsentGiven}=${encodeURIComponent(value)}`,
    )

    useHead({
      script: [
        {
          innerHTML: `if(document.cookie.split(/; */).some(function(c){return ${JSON.stringify(cookieEntries).replace(/</g, '\\u003C')}.indexOf(c)>-1}))document.documentElement.setAttribute('${HTML_ATTRIBUTE_CONSENT}','')`,
          key: 'cookie-control-consent',
          tagPriority: 'critical',
        },
      ],
      style: [
        {
          innerHTML: `html[${HTML_ATTRIBUTE_CONSENT}] .cookieControl__Bar{display:none}`,
          key: 'cookie-control-consent',
        },
      ],
    })
  }

  const state = {
    cookiesEnabled,
    cookiesEnabledIds,
    isConsentGiven,
    isModalActive,
    locale,
    moduleOptions,
  } as State

  return {
    provide: {
      cookies: state,
    },
  }
})
