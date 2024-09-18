<template>
  <ul>
    <li>
      <slot name="cookie" v-bind="{ cookie }">
        <div class="cookieControl__ModalInputWrapper flex gap-x-6">
          <!-- Toggle -->
          <CookieControlToggle
            :model-value="
              isConsentGiven === undefined
                ? cookie.isPreselected === true
                : getCookieIds(localCookiesEnabled).includes(cookie.id)
            "
            :disabled="
              cookieType === CookieType.NECESSARY &&
              cookie.name !== 'functional'
            "
            @update:model-value="toogleCookie(cookie)"
          />
          <!-- END > Toggle -->

          <!-- <button type="button" @click="toggleButton($event)">
          {{ name }}
        </button> -->
          <label
            class="cookieControl__ModalCookieName leading-4 mt-1"
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
              class="mt-2 flex flex-col gap-y-1"
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
import { computed, ref } from 'vue'
import { useCookieControl, useCookie, useNuxtApp } from '#imports'
import CookieControlToggle from './CookieControlToggle.vue'
import {
  type Cookie,
  type Locale,
  type Translatable,
  CookieType,
} from '#cookie-control/types'
import {
  getAllCookieIdsString,
  getCookieIds,
  removeCookie,
  resolveTranslatable,
} from '#cookie-control/methods'

const {
  cookiesEnabled,
  cookiesEnabledIds,
  isConsentGiven,
  isModalActive,
  moduleOptions,
} = useCookieControl()

// Props
export interface Props {
  cookie: Cookie
  cookieType: CookieType
  locale?: Locale
}
const props = withDefaults(defineProps<Props>(), {
  cookie: undefined,
  cookieType: undefined,
  locale: 'en',
})

// Data
const localCookiesEnabled = ref([...(cookiesEnabled.value || [])])

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

// Methods
const toggleButton = ($event: MouseEvent) => {
  ;(
    ($event.target as HTMLButtonElement | null)
      ?.nextSibling as HTMLLabelElement | null
  )?.click()
}
const toogleCookie = (cookie: Cookie) => {
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
const decline = () => {
  setCookies({
    isConsentGiven: true,
    cookiesOptionalEnabled: moduleOptions.cookies.necessary,
  })
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
</script>
