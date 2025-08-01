<template>
  <ClientOnlyPrerender>
    <aside class="cookieControl">
      <transition :name="`cookieControl__Bar--${moduleOptions.barPosition}`">
        <div
          v-if="!isConsentGiven && !moduleOptions.isModalForced"
          :class="`cookieControl__Bar cookieControl__Bar--${moduleOptions.barPosition}`"
        >
          <div class="cookieControl__BarContainer">
            <div>
              <slot name="bar">
                <h2 v-text="localeStrings?.bannerTitle" />
                <p v-text="localeStrings?.bannerDescription" />
              </slot>
            </div>
            <div class="cookieControl__BarButtons">
              <button
                type="button"
                @click="acceptAll()"
                v-text="localeStrings?.accept"
              />
              <button
                v-if="moduleOptions.isAcceptNecessaryButtonEnabled"
                type="button"
                @click="acceptNecessary()"
                v-text="localeStrings?.decline"
              />
              <button
                type="button"
                @click="isModalActive = true"
                v-text="localeStrings?.manageCookies"
              />
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
        <slot name="controlButton">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              fill="currentColor"
              d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 00-57.79 57.81l-35.1 68.88a132.645 132.645 0 00-12.82 80.95l12.08 76.27a132.521 132.521 0 0037.16 72.96l54.77 54.76a132.036 132.036 0 0072.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0057.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
            />
          </svg>
        </slot>
      </button>
      <transition name="cookieControl__Modal">
        <div
          v-if="isModalActive"
          class="cookieControl__Modal"
          @click.self="onModalClick"
        >
          <p
            v-if="isSaved"
            class="cookieControl__ModalUnsaved"
            v-text="localeStrings?.settingsUnsaved"
          />
          <div class="cookieControl__ModalContent">
            <div class="cookieControl__ModalContentInner">
              <slot name="modal" />
              <button
                v-if="!moduleOptions.isModalForced"
                class="cookieControl__ModalClose"
                type="button"
                @click="isModalActive = false"
                v-text="localeStrings?.close"
              />
              <template v-for="cookieType in CookieType" :key="cookieType">
                <template v-if="moduleOptions.cookies[cookieType].length">
                  <h2
                    v-text="
                      localeStrings &&
                      (cookieType === CookieType.NECESSARY
                        ? localeStrings.cookiesNecessary
                        : localeStrings.cookiesOptional)
                    "
                  />
                  <ul>
                    <li
                      v-for="cookie in moduleOptions.cookies[cookieType]"
                      :key="cookie.id"
                    >
                      <slot name="cookie" v-bind="{ cookie }">
                        <div class="cookieControl__ModalInputWrapper">
                          <input
                            v-if="
                              cookieType === CookieType.NECESSARY &&
                              cookie.name !== 'functional'
                            "
                            :id="resolveTranslatable(cookie.name, locale)"
                            type="checkbox"
                            disabled
                            checked
                          />
                          <input
                            v-else
                            :id="resolveTranslatable(cookie.name, locale)"
                            type="checkbox"
                            :checked="
                              getCookieIds(localCookiesEnabled).includes(
                                cookie.id,
                              )
                            "
                            @change="toggleCookie(cookie)"
                          />
                          <button type="button" @click="toggleButton($event)">
                            {{ getName(cookie.name) }}
                          </button>
                          <label
                            class="cookieControl__ModalCookieName"
                            :for="resolveTranslatable(cookie.name, locale)"
                            tabindex="0"
                            @keydown="toggleLabel($event)"
                          >
                            {{ getName(cookie.name) }}
                            <span v-if="cookie.description">
                              {{ getDescription(cookie.description) }}
                            </span>
                            <span
                              v-if="
                                moduleOptions.isCookieIdVisible &&
                                cookie.targetCookieIds
                              "
                            >
                              <br />
                              {{
                                'IDs: ' +
                                cookie.targetCookieIds
                                  .map((id) => `"${id}"`)
                                  .join(', ')
                              }}
                            </span>
                            <template
                              v-if="Object.entries(cookie.links || {}).length"
                            >
                              <span
                                v-for="entry in Object.entries(
                                  cookie.links || {},
                                )"
                                :key="entry[0]"
                              >
                                <br />
                                <NuxtLink
                                  :to="entry[0]"
                                  @click="
                                    !entry[0].toLowerCase().startsWith('http')
                                      ? (isModalActive = false)
                                      : null
                                  "
                                >
                                  {{ entry[1] || entry[0] }}
                                </NuxtLink>
                              </span>
                            </template>
                          </label>
                        </div>
                      </slot>
                    </li>
                  </ul>
                </template>
              </template>
              <div class="cookieControl__ModalButtons">
                <button
                  type="button"
                  @click="
                    () => {
                      acceptPartial()
                      isModalActive = false
                    }
                  "
                  v-text="localeStrings?.save"
                />
                <button
                  type="button"
                  @click="
                    () => {
                      acceptAll()
                      isModalActive = false
                    }
                  "
                  v-text="localeStrings?.acceptAll"
                />
                <button
                  v-if="!moduleOptions.isModalForced"
                  type="button"
                  @click="
                    () => {
                      moduleOptions.declineAllAcceptsNecessary
                        ? acceptNecessary()
                        : acceptNone()
                      isModalActive = false
                    }
                  "
                  v-text="localeStrings?.declineAll"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </aside>
  </ClientOnlyPrerender>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue'

import ClientOnlyPrerender from '#cookie-control/components/ClientOnlyPrerender.vue'
import { COOKIE_ID_SEPARATOR } from '#cookie-control/constants'
import {
  getAllCookieIdsString,
  getCookieIds,
  removeCookie,
  resolveTranslatable,
} from '#cookie-control/methods'
import setCssVariables from '#cookie-control/set-vars'
import { CookieType } from '#cookie-control/types'
import type { Cookie, Locale, Translatable } from '#cookie-control/types'
import { useCookieControl, useCookie, useNuxtApp } from '#imports'

const { locale = 'en' } = defineProps<{
  locale?: Locale
}>()

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
const preselectedCookies = moduleOptions.cookies[CookieType.OPTIONAL].filter(
  (cookie) => cookie.isPreselected,
)
const localCookiesEnabled = ref([
  ...(cookiesEnabled.value ||
    (isConsentGiven.value === undefined ? preselectedCookies : [])),
])
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

// computations
const isSaved = computed(
  () =>
    getCookieIds(cookiesEnabled.value || [])
      .sort()
      .join(COOKIE_ID_SEPARATOR) !==
    getCookieIds(localCookiesEnabled.value).sort().join(COOKIE_ID_SEPARATOR),
)
const localeStrings = computed(() => moduleOptions.localeTexts[locale])

// methods
const acceptAll = () => {
  setCookies({
    cookiesOptionalEnabled: moduleOptions.cookies.optional,
    isConsentGiven: true,
  })
}
const acceptPartial = () => {
  const localCookiesEnabledIds = getCookieIds(localCookiesEnabled.value)

  setCookies({
    cookiesOptionalEnabled: moduleOptions.cookies.optional.filter((cookie) =>
      localCookiesEnabledIds.includes(cookie.id),
    ),
    isConsentGiven: true,
  })
}
const acceptNecessary = () => {
  setCookies({
    cookiesOptionalEnabled: [],
    isConsentGiven: true,
  })
}
const acceptNone = () => {
  setCookies({
    cookiesOptionalEnabled: [],
    isConsentGiven: false,
  })
}
const getDescription = (description: Translatable) =>
  `${
    moduleOptions.isDashInDescriptionEnabled === false ? '' : '-'
  } ${resolveTranslatable(description, locale)}`
const getName = (name: Translatable) => {
  return name === 'functional'
    ? localeStrings.value?.cookiesFunctional
    : resolveTranslatable(name, locale)
}
const init = () => {
  nuxtApp.$cookies.locale.value = locale
}
const onModalClick = () => {
  if (moduleOptions.closeModalOnClickOutside) {
    isModalActive.value = false
  }
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
const toggleButton = ($event: MouseEvent) => {
  ;(
    ($event.target as HTMLButtonElement | null)
      ?.nextSibling as HTMLLabelElement | null
  )?.click()
}
const toggleCookie = (cookie: Cookie) => {
  const cookieIndex = getCookieIds(localCookiesEnabled.value).indexOf(cookie.id)

  if (cookieIndex < 0) {
    localCookiesEnabled.value.push(cookie)
  } else {
    localCookiesEnabled.value.splice(cookieIndex, 1)
  }
}
const toggleLabel = ($event: KeyboardEvent) => {
  if ($event.key === ' ') ($event.target as HTMLLabelElement | null)?.click()
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
  () => locale,
  (locale) => {
    nuxtApp.$cookies.locale.value = locale
  },
)

// initialization
init()

defineExpose({
  accept: acceptAll,
  acceptPartial,
  decline: acceptNecessary,
})
</script>
