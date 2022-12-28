<template>
  <client-only>
    <section class="cookieControl">
      <transition :name="`cookieControl__Bar--${moduleOptions.barPosition}`">
        <div
          v-if="colorsSet && !isConsentGiven"
          :class="`cookieControl__Bar cookieControl__Bar--${moduleOptions.barPosition}`"
        >
          <div class="cookieControl__BarContainer">
            <div>
              <slot name="bar">
                <h3 v-text="localeStrings?.barTitle" />
                <p v-text="localeStrings?.barDescription" />
              </slot>
            </div>
            <div class="cookieControl__BarButtons">
              <button
                @click="setConsent({ reload: false })"
                v-text="localeStrings?.acceptAll"
              />
              <button
                v-if="moduleOptions.isAcceptNecessaryButtonEnabled"
                @click="acceptNecessary"
                v-text="localeStrings?.acceptNecessary"
              />
              <button
                @click="isModalActive = true"
                v-text="localeStrings?.manageCookies"
              />
            </div>
          </div>
        </div>
      </transition>
      <button
        v-if="
          moduleOptions.isControlButtonEnabled && colorsSet && isConsentGiven
        "
        aria-label="Cookie control"
        class="cookieControl__ControlButton"
        data-testid="nuxt-cookie-control-control-button"
        @click="isModalActive = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="currentColor"
            d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 00-57.79 57.81l-35.1 68.88a132.645 132.645 0 00-12.82 80.95l12.08 76.27a132.521 132.521 0 0037.16 72.96l54.77 54.76a132.036 132.036 0 0072.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0057.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
          />
        </svg>
      </button>
      <transition name="cookieControl__Modal">
        <div v-if="isModalActive" class="cookieControl__Modal">
          <p
            v-if="!saved"
            class="cookieControl__ModalUnsaved"
            v-text="localeStrings?.unsaved"
          />
          <div class="cookieControl__ModalContent">
            <div>
              <slot name="modal" />
              <button
                class="cookieControl__ModalClose"
                @click="isModalActive = false"
                v-text="localeStrings?.close"
              />
              <div v-for="cookieType in CookieType" :key="cookieType">
                <h3 v-text="localeStrings && localeStrings[cookieType]" />
                <ul v-if="moduleOptions.cookies[cookieType].length">
                  <li
                    v-for="cookie in moduleOptions.cookies[cookieType]"
                    :key="cookie.id"
                  >
                    <div class="cookieControl__ModalInputWrapper">
                      <input
                        v-if="
                          cookieType === CookieType.NECESSARY &&
                          cookie.name !== 'functional'
                        "
                        :id="resolveTranslatable(cookie.name)"
                        type="checkbox"
                        disabled
                        checked
                      />
                      <input
                        v-else
                        :id="resolveTranslatable(cookie.name)"
                        type="checkbox"
                        :checked="
                          cookiesEnabledIds.includes(getCookieId(cookie)) ||
                          (getCookieControlConsent()?.length === 0 &&
                            typeof moduleOptions.isIframeBlocked === 'object' &&
                            moduleOptions.isIframeBlocked.initialState)
                        "
                        @change="toogleCookie(cookie)"
                      />
                      <label :for="resolveTranslatable(cookie.name)">
                        {{ getName(cookie.name) }}
                      </label>
                      <span class="cookieControl__ModalCookieName">
                        {{ getName(cookie.name) }}
                        <span v-if="cookie.description">
                          {{ getDescription(cookie.description) }}
                        </span>
                        <span v-if="cookie.targetCookieIds">
                          {{
                            ' IDs: ' +
                            cookie.targetCookieIds
                              .map((id: string) => `"${id}"`)
                              .join(', ')
                          }}
                        </span>
                      </span>
                    </div>
                  </li>
                </ul>
                <p v-else>
                  {{ localeStrings?.none }}
                </p>
              </div>
              <div class="cookieControl__ModalButtons">
                <button
                  @click="setConsent({ type: 'partial' })"
                  v-text="localeStrings?.save"
                />
                <button
                  @click="() => setConsent({})"
                  v-text="localeStrings?.acceptAll"
                />
                <button
                  @click="
                    setConsent({ declineAll: true, isConsentGiven: false })
                  "
                  v-text="localeStrings?.declineAll"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </section>
  </client-only>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'

import { Cookie, CookieType, Locale, Translatable } from '../types'
import {
  getCookieControlConsent,
  getCookieId,
  useAcceptNecessary,
  useSetConsent,
  useResolveTranslatable,
  setCookies,
} from '../methods'

import { useCookieControl } from '#imports'

export interface Props {
  locale?: Locale
}
const props = withDefaults(defineProps<Props>(), {
  locale: 'en',
})

const { cookiesEnabledIds, isConsentGiven, isModalActive, moduleOptions } =
  useCookieControl()
const setConsentFun = useSetConsent()
const acceptNecessary = useAcceptNecessary()
const resolveTranslatable = useResolveTranslatable(props.locale)

// data
const saved = ref(true)
const colorsSet = ref(false)

// computations
const localeStrings = computed(() => moduleOptions.localeTexts[props.locale])

// methods
const toogleCookie = (cookie: Cookie) => {
  const cookieId = getCookieId(cookie)

  if (saved.value) saved.value = false

  if (!cookiesEnabledIds.value.includes(cookieId)) {
    cookiesEnabledIds.value.push(cookieId)
  } else {
    cookiesEnabledIds.value.splice(cookiesEnabledIds.value.indexOf(cookieId), 1)
  }
}
const setConsent = ({
  type = undefined,
  isConsentGiven = true,
  reload = true,
  declineAll = false,
}: {
  type?: 'partial'
  isConsentGiven?: boolean
  reload?: boolean
  declineAll?: boolean
}) => {
  const cookieIds = declineAll
    ? []
    : type === 'partial' && isConsentGiven
    ? cookiesEnabledIds.value
    : moduleOptions.cookies.optional.map((cookie: Cookie) =>
        getCookieId(cookie)
      )

  const expirationDate = new Date()
  expirationDate.setFullYear(expirationDate.getFullYear() + 1)

  setCookies({
    isConsentGiven,
    cookieIds,
    expires: expirationDate,
  })

  if (reload) {
    window.location.reload()
  } else {
    setConsentFun()
    isModalActive.value = false
  }
}
const getDescription = (description: Translatable) =>
  `${
    moduleOptions.isDashInDescriptionEnabled === false ? '' : '-'
  } ${resolveTranslatable(description)}`
const getName = (name: Translatable) => {
  return name === 'functional'
    ? localeStrings.value?.functional
    : typeof name === 'string'
    ? name
    : name[props.locale]
}

// lifecycle
onBeforeMount(async () => {
  if (moduleOptions.colors) {
    const variables: Record<string, any> = {}

    for (const key in moduleOptions.colors) {
      variables[`cookie-control-${key}`] = `${moduleOptions.colors[key]}`
    }

    if (moduleOptions.isCssPolyfillEnabled) {
      const module = await import('css-vars-ponyfill')
      const cssVars = module.default
      cssVars({ variables })
    } else {
      for (const cssVar in variables) {
        document.documentElement.style.setProperty(
          `--${cssVar}`,
          variables[cssVar]
        )
      }
    }
  }

  const cookieControlConsent = getCookieControlConsent()

  if (!cookieControlConsent || !cookieControlConsent.length) {
    for (const cookieOptional of moduleOptions.cookies.optional) {
      if (
        typeof moduleOptions.isIframeBlocked === 'boolean'
          ? moduleOptions.isIframeBlocked === true
          : moduleOptions.isIframeBlocked?.initialState === true
      ) {
        cookiesEnabledIds.value.push(getCookieId(cookieOptional))
      }
    }
  }

  colorsSet.value = true
})
</script>
