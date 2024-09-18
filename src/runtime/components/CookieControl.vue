<template>
  <aside class="cookieControl">
    <transition :name="`cookieControl__Bar--${moduleOptions.barPosition}`">
      <div
        v-if="!isConsentGiven && !moduleOptions.isModalForced"
        :class="`cookieControl__Bar cookieControl__Bar--${moduleOptions.barPosition}`"
        class="fixed bottom-0 left-0 p-6 rounded-lg bg-barBackground text-barTextColor"
      >
        <div class="cookieControl__BarContainer">
          <div class="mb-4">
            <slot name="bar">
              <h2 class="mb-1.5 text-lg font-bold">
                {{ localeStrings?.bannerTitle }}
              </h2>
              <p class="leading-6">
                {{ localeStrings?.bannerDescription }}
              </p>
            </slot>
          </div>
          <div class="flex gap-3 cookieControl__BarButtons">
            <CookieControlButton @click="accept()">
              {{ localeStrings?.accept }}
            </CookieControlButton>
            <CookieControlButton @click="decline()">
              {{ localeStrings?.decline }}
            </CookieControlButton>
            <CookieControlButton @click="isModalActive = true">
              {{ localeStrings?.manageCookies }}
            </CookieControlButton>
          </div>
        </div>
      </div>
    </transition>
    <button
      v-if="moduleOptions.isControlButtonEnabled && isConsentGiven"
      aria-label="Cookie control"
      class="cookieControl__ControlButton"
      data-testid="nuxt-cookie-control-control-button"
      type="button"
      @click="isModalActive = true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          fill="currentColor"
          d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 00-57.79 57.81l-35.1 68.88a132.645 132.645 0 00-12.82 80.95l12.08 76.27a132.521 132.521 0 0037.16 72.96l54.77 54.76a132.036 132.036 0 0072.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0057.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
        />
      </svg>
    </button>

    <CookieControlModal :locale="props.locale" />
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue'

import CookieControlButton from './CookieControlButton.vue'
import type { Cookie, Locale } from '#cookie-control/types'
import {
  getAllCookieIdsString,
  getCookieIds,
  removeCookie,
} from '#cookie-control/methods'
import { COOKIE_ID_SEPARATOR } from '#cookie-control/constants'
import setCssVariables from '#cookie-control/set-vars'
import { useCookieControl, useCookie, useNuxtApp } from '#imports'
import CookieControlModal from './CookieControlModal.vue'

export interface Props {
  locale?: Locale
}
const props = withDefaults(defineProps<Props>(), {
  locale: 'en',
})

const {
  cookiesEnabled,
  cookiesEnabledIds,
  isConsentGiven,
  isModalActive,
  moduleOptions,
} = useCookieControl()
const nuxtApp = useNuxtApp()

// data
const expires = new Date(Date.now() + moduleOptions.cookieExpiryOffsetMs)
const localCookiesEnabled = ref([...(cookiesEnabled.value || [])])
const allCookieIdsString = getAllCookieIdsString(moduleOptions)
const cookieIsConsentGiven = useCookie(moduleOptions.cookieNameIsConsentGiven, {
  expires,
  ...moduleOptions.cookieOptions,
})

const cookieCookiesEnabledIds = useCookie(
  moduleOptions.cookieNameCookiesEnabledIds,
  {
    expires,
    ...moduleOptions.cookieOptions,
  },
)

// Computed
const localeStrings = computed(() => moduleOptions.localeTexts[props.locale])

// Methods
const accept = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: moduleOptions.cookies.optional,
  })
}
const acceptPartial = () => {
  const localCookiesEnabledIds = getCookieIds(localCookiesEnabled.value)

  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: [
      ...moduleOptions.cookies.necessary,
      ...moduleOptions.cookies.optional,
    ].filter((cookie) => localCookiesEnabledIds.includes(cookie.id)),
  })
}
const decline = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: moduleOptions.cookies.necessary,
  })
}
const init = () => {
  nuxtApp.$cookies.locale.value = props.locale
}
const setCookies = ({
  cookiesOptionalEnabled: cookiesOptionalEnabledNew,
  isConsentGiven: isConsentGivenNew,
}: {
  cookiesOptionalEnabled: Cookie[]
  isConsentGiven: boolean
}) => {
  isConsentGiven.value = isConsentGivenNew // must come before an update to `cookiesEnabled`
  cookiesEnabled.value = isConsentGivenNew
    ? [
        ...moduleOptions.cookies.necessary,
        ...moduleOptions.cookies.optional.filter((cookieOptional: Cookie) =>
          cookiesOptionalEnabledNew.includes(cookieOptional),
        ),
      ]
    : []
  cookiesEnabledIds.value = isConsentGivenNew
    ? getCookieIds(cookiesEnabled.value)
    : []
}

// lifecycle
onBeforeMount(() => {
  if (moduleOptions.colors) {
    const variables: Record<string, string> = {}

    for (const key in moduleOptions.colors) {
      variables[`cookie-control-${key}`] = `${moduleOptions.colors[key]}`
    }

    setCssVariables(variables)
  }

  if (moduleOptions.isModalForced && !isConsentGiven.value) {
    isModalActive.value = true
  }
})
watch(
  () => cookiesEnabled.value,
  (current, _previous) => {
    localCookiesEnabled.value = [...(current || [])]

    if (isConsentGiven.value) {
      cookieCookiesEnabledIds.value = getCookieIds(current || []).join(
        COOKIE_ID_SEPARATOR,
      )

      for (const cookieEnabled of current || []) {
        if (!cookieEnabled.src) continue

        const script = document.createElement('script')
        script.src = cookieEnabled.src

        const headElement = document.getElementsByTagName('head')[0]
        if (!headElement) return

        headElement.appendChild(script)
      }
    } else {
      cookieCookiesEnabledIds.value = undefined
    }

    // delete formerly enabled cookies that are now disabled
    const cookiesOptionalDisabled = moduleOptions.cookies.optional.filter(
      (cookieOptional) => !(current || []).includes(cookieOptional),
    )

    for (const cookieOptionalDisabled of cookiesOptionalDisabled) {
      if (!cookieOptionalDisabled.targetCookieIds) continue

      for (const cookieOptionalDisabledId of cookieOptionalDisabled.targetCookieIds) {
        removeCookie(cookieOptionalDisabledId)
      }

      if (cookieOptionalDisabled.src) {
        for (const script of [
          ...document.head.querySelectorAll(
            `script[src="${cookieOptionalDisabled.src}"]`,
          ),
        ]) {
          script.parentNode?.removeChild(script)
        }
      }
    }
  },
  { deep: true },
)

watch(isConsentGiven, (current, _previous) => {
  if (current === undefined) {
    cookieIsConsentGiven.value = undefined
  } else {
    cookieIsConsentGiven.value = current ? allCookieIdsString : '0'
  }
})

watch(
  () => props.locale,
  (locale) => {
    nuxtApp.$cookies.locale.value = locale
  },
)

// initialization
init()

defineExpose({
  accept,
  acceptPartial,
  decline,
})
</script>
