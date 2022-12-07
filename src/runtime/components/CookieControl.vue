<template>
  <client-only>
    <section v-if="$cookies.moduleOptions.text" class="cookieControl">
      <transition
        :name="`cookieControl__Bar--${$cookies.moduleOptions.barPosition}`"
      >
        <div
          v-if="colorsSet && !$cookies.isConsentGiven"
          :class="`cookieControl__Bar cookieControl__Bar--${$cookies.moduleOptions.barPosition}`"
        >
          <div class="cookieControl__BarContainer">
            <div>
              <slot name="bar">
                <h3 v-text="$cookies.moduleOptions.text.barTitle" />
                <p v-text="$cookies.moduleOptions.text.barDescription" />
              </slot>
            </div>
            <div class="cookieControl__BarButtons">
              <button
                v-if="$cookies.moduleOptions.acceptNecessary"
                @click="acceptNecessary"
                v-text="$cookies.moduleOptions.text.acceptNecessary"
              />
              <button
                @click="$cookies.isModalActive.value = true"
                v-text="$cookies.moduleOptions.text.manageCookies"
              />
              <button
                @click="setConsent({ reload: false })"
                v-text="$cookies.moduleOptions.text.acceptAll"
              />
            </div>
          </div>
        </div>
      </transition>
      <button
        v-if="
          $cookies.moduleOptions.controlButton &&
          colorsSet &&
          $cookies.isConsentGiven
        "
        class="cookieControl__ControlButton"
        aria-label="Cookie control"
        @click="$cookies.isModalActive.value = true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="currentColor"
            d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 00-57.79 57.81l-35.1 68.88a132.645 132.645 0 00-12.82 80.95l12.08 76.27a132.521 132.521 0 0037.16 72.96l54.77 54.76a132.036 132.036 0 0072.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0057.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
          />
        </svg>
      </button>
      <transition name="cookieControl__Modal">
        <div v-if="$cookies.isModalActive" class="cookieControl__Modal">
          <p
            v-if="!saved"
            class="cookieControl__ModalUnsaved"
            v-text="$cookies.moduleOptions.text.unsaved"
          />
          <div class="cookieControl__ModalContent">
            <div>
              <slot name="modal" />
              <button
                class="cookieControl__ModalClose"
                @click="$cookies.isModalActive.value = false"
                v-text="$cookies.moduleOptions.text.close"
              />
              <div v-for="cookieType in CookieType" :key="cookieType">
                <h3 v-text="$cookies.moduleOptions.text[cookieType]" />
                <ul v-if="$cookies.moduleOptions.cookies">
                  <li
                    v-for="cookie in $cookies.moduleOptions.cookies[cookieType]"
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
                          $cookies.cookiesEnabledIds.value.includes(
                            cookie.id ||
                              slugify(resolveTranslatable(cookie.name))
                          ) ||
                          (Cookies.get('cookie_control_consent')?.length ===
                            0 &&
                            typeof $cookies.moduleOptions.blockIframe ===
                              'object' &&
                            $cookies.moduleOptions.blockIframe.initialState)
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
                      </span>
                    </div>
                    <template v-if="cookie.ids">
                      <slot name="cookie" v-bind="{ config: cookie }">
                        <ul>
                          <li v-for="item in cookie.ids" :key="item">
                            {{ item }}
                          </li>
                        </ul>
                      </slot>
                    </template>
                  </li>
                </ul>
              </div>
              <div class="cookieControl__ModalButtons">
                <button
                  @click="setConsent({ type: 'partial' })"
                  v-text="$cookies.moduleOptions.text.save"
                />
                <button
                  @click="() => setConsent({})"
                  v-text="$cookies.moduleOptions.text.acceptAll"
                />
                <button
                  @click="setConsent({ declineAll: true, consent: false })"
                  v-text="$cookies.moduleOptions.text.declineAll"
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
import slugify from 'slugify'
import { computed, onBeforeMount, ref, watch } from 'vue'

import {
  Cookie,
  CookieType,
  Locale,
  LocaleStrings,
  Translatable,
} from '../types'
import {
  useAcceptNecessary,
  useSetConsent,
  resolveTranslatable,
} from '../methods'

export interface Props {
  locale?: Locale
}
const props = withDefaults(defineProps<Props>(), {
  locale: Locale.EN,
})

const $cookies = useCookieControl()
const setConsentFun = useSetConsent()
const acceptNecessary = useAcceptNecessary()

// data
const saved = ref(true)
const colorsSet = ref(false)

// computations
const expirationDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return date
})

// methods
function toogleCookie(cookie: Cookie) {
  const cookieName = cookie.id || slugify(resolveTranslatable(cookie.name))
  if (saved.value) saved.value = false
  if (!$cookies.cookiesEnabledIds.value.includes(cookieName))
    $cookies.cookiesEnabledIds.value.push(cookieName)
  else
    $cookies.cookiesEnabledIds.value.splice(
      $cookies.cookiesEnabledIds.value.indexOf(cookieName),
      1
    )
}
function setConsent({
  type = undefined,
  consent = true,
  reload = true,
  declineAll = false,
}: {
  type?: 'partial'
  consent?: boolean
  reload?: boolean
  declineAll?: boolean
}) {
  Cookies.set('cookie_control_consent', consent.toString(), {
    expires: expirationDate.value,
  })

  const enabledCookies = declineAll
    ? []
    : type === 'partial' && consent
    ? $cookies.cookiesEnabledIds.value
    : [
        ...$cookies.cookiesOptional.map(
          (c) => c.id || slugify(resolveTranslatable(c.name))
        ),
      ]
  Cookies.set(
    'cookie_control_enabled_cookies',
    consent ? enabledCookies.join(',') : '',
    {
      expires: expirationDate.value,
    }
  )

  if (reload) {
    window.location.reload()
  } else {
    setConsentFun()
    $cookies.isModalActive.value = false
  }
}
function getDescription(description: Translatable) {
  if (typeof description === 'string')
    return ` ${
      $cookies.moduleOptions.dashInDescription !== false ? '-' : ''
    } ${description}`
  else if (description[props.locale])
    return ` ${$cookies.moduleOptions.dashInDescription !== false ? '-' : ''} ${
      description[props.locale]
    }`
  return ''
}
function getName(name: Translatable) {
  return name === 'functional'
    ? $cookies.moduleOptions.text?.functional
    : typeof name === 'string'
    ? name
    : name[props.locale]
    ? name[props.locale]
    : name[Object.keys(name)[0]]
}
async function setTexts(isChanged = false) {
  let text: LocaleStrings | undefined

  try {
    text = (await import(`#nuxtCookieControl/locale/${props.locale}.ts`)) // .then(r => r.default || r))
      .default
  } catch (e) {
    text = (await import(`#nuxtCookieControl/locale/en`)).default
  }

  if (
    text &&
    $cookies.moduleOptions.text &&
    Object.keys($cookies.moduleOptions.text).length > 0
  ) {
    if (
      Object.keys($cookies.moduleOptions.text).includes('locale') &&
      $cookies.moduleOptions.text.locale
    ) {
      Object.assign(text, $cookies.moduleOptions.text.locale[props.locale])
    }
    if (!isChanged) Object.assign(text, $cookies.moduleOptions.text)
  }

  $cookies.moduleOptions.text = text
}

// lifecycle
onBeforeMount(async () => {
  setTexts()
  if ($cookies.moduleOptions.colors) {
    const variables: Record<string, any> = {}
    for (const key in $cookies.moduleOptions.colors) {
      const k = key.toLowerCase().includes('unactive')
        ? key.replace(/Unactive/g, 'Inactive')
        : key
      variables[`cookie-control-${k}`] = `${$cookies.moduleOptions.colors[key]}`
    }

    if ($cookies.moduleOptions.cssPolyfill) {
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

  if (
    $cookies.cookiesOptional &&
    (!Cookies.get('cookie_control_consent') ||
      Cookies.get('cookie_control_consent')?.length === 0)
  ) {
    $cookies.cookiesOptional.forEach((c) => {
      if (
        typeof $cookies.moduleOptions.blockIframe === 'boolean'
          ? $cookies.moduleOptions.blockIframe === true
          : $cookies.moduleOptions.blockIframe?.initialState === true
      ) {
        $cookies.cookiesEnabledIds.value.push(
          c.id || slugify(resolveTranslatable(c.name))
        )
      }
    })
  }

  colorsSet.value = true
})

watch(
  () => props.locale,
  (_currentValue, _oldValue) => {
    setTexts(true)
  }
)
</script>
