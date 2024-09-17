<template>
  <TransitionRoot appear :show="isModalActive" as="div">
    <p
      v-if="isSaved"
      class="cookieControl__ModalUnsaved"
      v-text="localeStrings?.settingsUnsaved"
    />
    <Dialog as="div" class="relative z-10" @close="isModalActive = false">
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="div"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all bg-modalBackground"
            >
              <div class="cookieControl__ModalContent">
                <div class="cookieControl__ModalContentInner">
                  <slot name="modal" />
                  <CookieControlModalButton
                    v-if="!moduleOptions.isModalForced"
                    class="absolute right-6 top-6"
                    @click="isModalActive = false"
                  >
                    {{ localeStrings?.close }}
                  </CookieControlModalButton>
                  <!-- <div v-for="cookieType in CookieType" :key="cookieType">
                    <div
                      v-if="moduleOptions.cookies[cookieType].length"
                      as="div"
                    >
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
                                :id="
                                  resolveTranslatable(cookie.name, props.locale)
                                "
                                type="checkbox"
                                disabled
                                checked
                              />
                              <input
                                v-else
                                :id="
                                  resolveTranslatable(cookie.name, props.locale)
                                "
                                type="checkbox"
                                :checked="
                                  isConsentGiven === undefined
                                    ? cookie.isPreselected
                                    : getCookieIds(
                                        localCookiesEnabled,
                                      ).includes(cookie.id)
                                "
                                @change="toogleCookie(cookie)"
                              />
                              <button
                                type="button"
                                @click="toggleButton($event)"
                              >
                                {{ getName(cookie.name) }}
                              </button>
                              <label
                                class="cookieControl__ModalCookieName"
                                :for="
                                  resolveTranslatable(cookie.name, props.locale)
                                "
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
                                <div
                                  v-if="
                                    Object.entries(cookie.links || {}).length
                                  "
                                  as="div"
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
                                        !entry[0]
                                          .toLowerCase()
                                          .startsWith('http')
                                          ? (isModalActive = false)
                                          : null
                                      "
                                    >
                                      {{ entry[1] || entry[0] }}
                                    </NuxtLink>
                                  </span>
                                </div>
                              </label>
                            </div>
                          </slot>
                        </li>
                      </ul>
                    </div>
                  </div> -->
                  <div
                    class="cookieControl__ModalButtons flex mt-10 gap-x-5 items-stretch"
                  >
                    <CookieControlModalButton
                      @click="
                        () => {
                          acceptPartial()
                          isModalActive = false
                        }
                      "
                    >
                      {{ localeStrings?.save }}
                    </CookieControlModalButton>
                    <CookieControlModalButton
                      @click="
                        () => {
                          accept()
                          isModalActive = false
                        }
                      "
                    >
                      {{ localeStrings?.acceptAll }}
                    </CookieControlModalButton>
                    <CookieControlModalButton
                      v-if="!moduleOptions.isModalForced"
                      @click="
                        () => {
                          declineAll()
                          isModalActive = false
                        }
                      "
                    >
                      {{ localeStrings?.declineAll }}
                    </CookieControlModalButton>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import CookieControlModalButton from './CookieControlModalButton.vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { useCookieControl, useCookie, useNuxtApp } from '#imports'
import {
  type Cookie,
  CookieType,
  type Locale,
  type Translatable,
} from '#cookie-control/types'
import {
  getAllCookieIdsString,
  getCookieIds,
  removeCookie,
  resolveTranslatable,
} from '#cookie-control/methods'
import { COOKIE_ID_SEPARATOR } from '#cookie-control/constants'

// Props
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

// Data
const localCookiesEnabled = ref([...(cookiesEnabled.value || [])])

// Computed
const isSaved = computed(
  () =>
    getCookieIds(cookiesEnabled.value || [])
      .sort()
      .join(COOKIE_ID_SEPARATOR) !==
    getCookieIds(localCookiesEnabled.value).sort().join(COOKIE_ID_SEPARATOR),
)
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
const declineAll = () => {
  setCookies({
    isConsentGiven: false,
    cookiesOptionalEnabled: [],
  })
}
const getDescription = (description: Translatable) =>
  `${
    moduleOptions.isDashInDescriptionEnabled === false ? '' : '-'
  } ${resolveTranslatable(description, props.locale)}`
const getName = (name: Translatable) => {
  return name === 'functional'
    ? localeStrings.value?.cookiesFunctional
    : resolveTranslatable(name, props.locale)
}
const init = () => {
  nuxtApp.$cookies.locale.value = props.locale
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

// Hooks
</script>
