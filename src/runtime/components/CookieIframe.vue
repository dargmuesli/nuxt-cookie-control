<template>
  <ClientOnlyPrerender>
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
  </ClientOnlyPrerender>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Cookie } from '#cookie-control/types'
import { useNuxtApp, useCookieControl } from '#imports'
import ClientOnlyPrerender from '#cookie-control/components/ClientOnlyPrerender.vue'

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
