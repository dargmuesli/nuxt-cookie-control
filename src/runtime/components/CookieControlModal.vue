<template>
  <TransitionRoot appear :show="isModalActive" as="div">
    <Dialog as="div" class="relative z-10" @close="isModalActive = false">
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 pb-16 text-center"
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
                v-if="unsavedSettings"
                class="cookieControl__ModalUnsaved fixed bottom-5 bg-modalUnsavedBackground px-2 rounded-md py-0.5 text-sm left-1/2 -translate-x-1/2 z-40 text-white"
              >
                {{ localeStrings?.settingsUnsaved }}
              </p>
            </Transition>
            <!-- END > Unsaved settings notify -->
            <DialogPanel
              class="w-full max-w-lg p-8 overflow-hidden text-left align-middle transition-all transform rounded-md shadow-xl bg-modalBackground"
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
                      <h2 class="mb-6 text-xl font-semibold">
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
                          :local-cookies-enabled="localCookiesEnabled"
                          @add-locale-cookie="addCookie"
                          @remove-locale-cookie="removeCookie"
                        />
                      </div>
                      <!-- END > Cookie Groups -->
                    </div>
                    <!-- END > Modal Body -->
                  </div>
                  <div
                    class="flex items-stretch mt-10 cookieControl__ModalButtons gap-x-3"
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
      <div class="fixed inset-0 z-40 bg-black/75" aria-hidden="true" />
      <!-- END > Backdrop -->
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
import { useCookieControl } from '#imports'
import { type Cookie, CookieType, type Locale } from '#cookie-control/types'
import { getCookieIds } from '#cookie-control/methods'
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

// Data
const localCookiesEnabled = ref([...(cookiesEnabled.value || [])])

// Computed
const unsavedSettings = computed(
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
const declineAll = () => {
  setCookies({
    isConsentGiven: false,
    cookiesOptionalEnabled: [],
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
const addCookie = (cookie: Cookie) => {
  localCookiesEnabled.value.push(cookie)
}
const removeCookie = (cookieIndex: number) => {
  localCookiesEnabled.value.splice(cookieIndex, 1)
}
</script>
