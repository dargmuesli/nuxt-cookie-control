<template>
  <client-only>
    <section class="cookieControl">
      <transition :name="`cookieControl__Bar--${moduleOptions.barPosition}`">
        <div
          v-if="isColorsSet && isConsentGiven === undefined"
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
              <button @click="acceptAll()" v-text="localeStrings?.acceptAll" />
              <button
                v-if="moduleOptions.isAcceptNecessaryButtonEnabled"
                @click="acceptNecessary()"
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
          moduleOptions.isControlButtonEnabled &&
          isColorsSet &&
          isConsentGiven !== undefined
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
            v-if="isSaved"
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
                          getCookieIds(localCookiesEnabled)?.includes(
                            getCookieId(cookie)
                          ) ||
                          (Cookies.get(
                            moduleOptions.cookieNameIsConsentGiven
                          ) !== 'true' &&
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
                        <span
                          v-if="
                            moduleOptions.isCookieIdVisible &&
                            cookie.targetCookieIds
                          "
                        >
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
                  @click="
                    () => {
                      acceptPartial()
                      isModalActive = false
                    }
                  "
                  v-text="localeStrings?.save"
                />
                <button
                  @click="
                    () => {
                      acceptAll()
                      isModalActive = false
                    }
                  "
                  v-text="localeStrings?.acceptAll"
                />
                <button
                  @click="
                    () => {
                      declineAll()
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
    </section>
  </client-only>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import { ref, computed, onBeforeMount, watch } from 'vue'

import { Cookie, CookieType, Locale, Translatable } from '../types'
import { getCookieId, getCookieIds, useResolveTranslatable } from '../methods'

import { useCookieControl } from '#imports'

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
const resolveTranslatable = useResolveTranslatable(props.locale)

// data
const expires = new Date()
const isColorsSet = ref(false)
const localCookiesEnabled = ref([...(cookiesEnabled.value || [])])

// computations
const isSaved = computed(
  () =>
    getCookieIds(cookiesEnabled.value || [])
      .sort()
      .join(',') !== getCookieIds(localCookiesEnabled.value).sort().join(',')
)
const localeStrings = computed(() => moduleOptions.localeTexts[props.locale])

// methods
const acceptAll = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: moduleOptions.cookies.optional,
  })
}
const acceptNecessary = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: moduleOptions.cookies?.necessary,
  })
}
const acceptPartial = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: localCookiesEnabled.value,
  })
}
const declineAll = () => {
  setCookies({
    isConsentGiven: false,
    cookiesOptionalEnabled: [],
  })
}
const toogleCookie = (cookie: Cookie) => {
  if (!localCookiesEnabled.value.includes(cookie)) {
    localCookiesEnabled.value.push(cookie)
  } else {
    localCookiesEnabled.value.splice(
      localCookiesEnabled.value.indexOf(cookie),
      1
    )
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
const init = () => {
  expires.setTime(expires.getTime() + moduleOptions.cookieExpiryOffsetMs)
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
          cookiesOptionalEnabledNew?.includes(cookieOptional)
        ),
      ]
    : []
  cookiesEnabledIds.value = isConsentGivenNew
    ? getCookieIds(cookiesEnabled.value)
    : []
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

    isColorsSet.value = true
  }

  if (Cookies.get(moduleOptions.cookieNameIsConsentGiven) === 'true') {
    for (const cookieOptional of moduleOptions.cookies.optional) {
      if (
        typeof moduleOptions.isIframeBlocked === 'boolean'
          ? moduleOptions.isIframeBlocked === true
          : moduleOptions.isIframeBlocked?.initialState === true
      ) {
        localCookiesEnabled.value.push(cookieOptional)
      }
    }
  }
})
watch(
  () => cookiesEnabled.value,
  (current, _previous) => {
    if (isConsentGiven.value) {
      Cookies.set(
        moduleOptions.cookieNameCookiesEnabledIds,
        getCookieIds(current || []).join(','),
        {
          expires,
        }
      )

      for (const cookieEnabled of current || []) {
        if (!cookieEnabled.src) continue

        const script = document.createElement('script')
        script.src = cookieEnabled.src
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    } else {
      Cookies.remove(moduleOptions.cookieNameCookiesEnabledIds)
    }

    // delete formerly enabled cookies that are now disabled
    const cookiesOptionalDisabled = moduleOptions.cookies.optional.filter(
      (cookieOptional) => !(current || []).includes(cookieOptional)
    )

    for (const cookieOptionalDisabled of cookiesOptionalDisabled) {
      if (!cookieOptionalDisabled.targetCookieIds) continue

      for (const cookieOptionalDisabledId of cookieOptionalDisabled.targetCookieIds) {
        Cookies.remove(cookieOptionalDisabledId)
      }

      if (cookieOptionalDisabled.src) {
        for (const script of [
          ...document.head.querySelectorAll(
            `script[src="${cookieOptionalDisabled.src}"]`
          ),
        ]) {
          script.parentNode?.removeChild(script)
        }
      }
    }
  },
  { deep: true }
)
watch(isConsentGiven, (current, _previous) => {
  if (current === undefined) {
    Cookies.remove(moduleOptions.cookieNameIsConsentGiven)
  } else {
    Cookies.set(moduleOptions.cookieNameIsConsentGiven, current.toString(), {
      expires,
    })
  }
})

// initialization
init()
</script>
