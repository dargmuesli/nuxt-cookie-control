<template>
  <ClientOnly>
    <iframe
      v-if="isCookieFunctionalEnabled"
      :cookie-enabled="null"
      v-bind="$attrs"
    />
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
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Cookie } from '../types'

import { useCookieControl } from '#imports'

const { cookiesEnabled, isModalActive, moduleOptions } = useCookieControl()
const nuxtApp = useNuxtApp()

// computations
const isCookieFunctionalEnabled = computed(
  () =>
    (cookiesEnabled.value || []).filter(
      (cookieEnabled: Cookie) => cookieEnabled.name === 'functional',
    ).length > 0,
)
const localeStrings = computed(
  () => moduleOptions.localeTexts[nuxtApp.$cookies.locale.value],
)
</script>
