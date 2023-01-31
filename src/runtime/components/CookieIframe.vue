<template>
  <client-only>
    <iframe v-if="isCookieFunctionalEnabled" />
    <div v-else class="cookieControl__BlockedIframe">
      <p>
        {{ localeStrings?.iframeBlocked }}
        <a
          href="#"
          @click.prevent="isModalActive = true"
          v-text="localeStrings?.here"
        />
      </p>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { LOCALE_DEFAULT } from '../constants'
import { Cookie, Locale } from '../types'

import { useCookieControl } from '#imports'

export interface Props {
  locale?: Locale
}
const props = withDefaults(defineProps<Props>(), {
  locale: LOCALE_DEFAULT,
})

const { cookiesEnabled, isModalActive, moduleOptions } = useCookieControl()

// computations
const isCookieFunctionalEnabled = computed(
  () =>
    (cookiesEnabled.value || []).filter(
      (cookieEnabled: Cookie) => cookieEnabled.name === 'functional'
    ).length > 0
)
const localeStrings = computed(() => moduleOptions.localeTexts[props.locale])
</script>
