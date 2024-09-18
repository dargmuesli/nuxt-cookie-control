<template>
  <ul>
    <li>
      <slot name="cookie" v-bind="{ cookie }">
        <div class="flex cookieControl__ModalInputWrapper gap-x-6">
          <!-- Toggle -->
          <CookieControlToggle
            :model-value="isCookieEnabled"
            :disabled="isCookieNecessary"
            @update:model-value="toogleCookie(cookie)"
          />
          <!-- END > Toggle -->

          <!-- TODO -->
          <!-- <button type="button" @click="toggleButton($event)">
          {{ name }}
        </button> -->
          <label
            class="mt-1 leading-4 cookieControl__ModalCookieName"
            :for="resolveTranslatable(cookie.name, locale)"
            tabindex="0"
            @keydown="toggleLabel($event)"
          >
            <!-- Cookie Label -->
            <span class="text-lg font-semibold leading-4">
              {{ name }}
            </span>
            <!-- END > Cookie Label -->

            <!-- Cookie Description -->
            <span v-if="description" class="text-sm leading-4">
              {{ description }}
            </span>
            <!-- END > Cookie Description -->

            <!-- Cookie IDs -->
            <div
              v-if="moduleOptions.isCookieIdVisible && cookie.targetCookieIds"
              class="mt-2"
            >
              <span class="font-medium">IDs:</span>
              {{ cookieIds }}
            </div>
            <!-- END > Cookie IDs -->

            <!-- Cookie Links -->
            <div
              v-if="cookieLinks.length"
              as="div"
              class="flex flex-col mt-2 gap-y-1"
            >
              <div
                v-for="entry in cookieLinks"
                :key="entry[0]"
                class="underline underline-offset-2"
              >
                <nuxt-link
                  :to="entry[0]"
                  @click="
                    !entry[0].toLowerCase().startsWith('http')
                      ? (isModalActive = false)
                      : null
                  "
                >
                  {{ entry[1] || entry[0] }}
                </nuxt-link>
              </div>
            </div>
            <!-- END > Cookie Links -->
          </label>
        </div>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCookieControl } from '#imports'
import CookieControlToggle from './CookieControlToggle.vue'
import { type Cookie, type Locale, CookieType } from '#cookie-control/types'
import { getCookieIds, resolveTranslatable } from '#cookie-control/methods'

const { isConsentGiven, isModalActive, moduleOptions } = useCookieControl()

// Props
export interface Props {
  cookie: Cookie
  cookieType: CookieType
  locale?: Locale
  localCookiesEnabled: Array<Cookie>
}
const props = withDefaults(defineProps<Props>(), {
  cookie: undefined,
  cookieType: undefined,
  locale: 'en',
  localCookiesEnabled: () => [],
})

// Emits
const emit = defineEmits(['addLocaleCookie', 'removeLocaleCookie'])

// Computed
const localeStrings = computed(() => moduleOptions.localeTexts[props.locale])
const name = computed((): string | undefined => {
  return props.cookie.name === 'functional'
    ? localeStrings.value?.cookiesFunctional
    : resolveTranslatable(props.cookie.name, props.locale)
})
const description = computed((): string | undefined => {
  if (!props.cookie.description) {
    return ''
  }

  return `${
    moduleOptions.isDashInDescriptionEnabled === false ? '' : ' - '
  } ${resolveTranslatable(props.cookie.description, props.locale)}`
})
const cookieIds = computed(() => {
  return props.cookie.targetCookieIds?.map((id) => `"${id}"`).join(', ')
})
const cookieLinks = computed(() => {
  return Object.entries(props.cookie.links || {})
})
const isCookieNecessary = computed(() => {
  return (
    props.cookieType === CookieType.NECESSARY &&
    props.cookie.name !== 'functional'
  )
})
const isCookieEnabled = computed(() => {
  if (isCookieNecessary.value) {
    return true
  }

  return isConsentGiven === undefined
    ? props.cookie.isPreselected === true
    : getCookieIds(props.localCookiesEnabled).includes(props.cookie.id)
})

// Methods
const toogleCookie = (cookie: Cookie) => {
  const cookieIndex = getCookieIds(props.localCookiesEnabled).indexOf(cookie.id)

  if (cookieIndex < 0) {
    emit('addLocaleCookie', cookie)
  } else {
    emit('removeLocaleCookie', cookieIndex)
  }
}
const toggleLabel = ($event: KeyboardEvent) => {
  if ($event.key === ' ') ($event.target as HTMLLabelElement | null)?.click()
}
</script>
