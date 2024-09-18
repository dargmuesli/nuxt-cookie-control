<template>
  <TransitionRoot appear :show="isModalActive" as="div">
    <Dialog
      v-if="false"
      as="div"
      class="relative z-10"
      @close="isModalActive = false"
    >
      <div class="fixed inset-0 overflow-y-auto z-50">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center pb-16"
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
            <!-- Unsaved settings notify -->
            <Transition
              enter-active-class="duration-300 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <p
                v-if="!isSaved"
                class="cookieControl__ModalUnsaved fixed bottom-5 bg-modalUnsavedBackground px-2 rounded-md py-0.5 text-sm left-1/2 -translate-x-1/2 z-40 text-white"
              >
                {{ localeStrings?.settingsUnsaved }}
              </p>
            </Transition>
            <!-- END > Unsaved settings notify -->
            <DialogPanel
              class="w-full max-w-lg transform overflow-hidden rounded-md p-8 text-left align-middle shadow-xl transition-all bg-modalBackground"
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
                  <div
                    v-for="cookieType in CookieType"
                    :key="cookieType"
                    class="mt-14"
                  >
                    <!-- Modal Body -->
                    <div v-if="moduleOptions.cookies[cookieType].length">
                      <h2 class="text-xl mb-6 font-semibold">
                        {{
                          localeStrings &&
                          (cookieType === CookieType.NECESSARY
                            ? localeStrings.cookiesNecessary
                            : localeStrings.cookiesOptional)
                        }}
                      </h2>
                      <!-- Cookie Groups -->
                      <div class="flex flex-col gap-y-8">
                        <CookieControlCookieGroup
                          v-for="cookie in moduleOptions.cookies[cookieType]"
                          :key="cookie.id"
                          :cookie="cookie"
                          :cookie-type="cookieType"
                        />
                      </div>
                      <!-- END > Cookie Groups -->
                    </div>
                    <!-- END > Modal Body -->
                  </div>
                  <!--<div
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
                    class="cookieControl__ModalButtons flex mt-10 gap-x-4 items-stretch"
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
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/75 z-40" aria-hidden="true" />
      <!-- END > Backdrop -->
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
const test = ref(false)
onMounted(() => {
  setTimeout(() => {
    test.value = true
  }, 1500)
})

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

// Hooks
</script>
