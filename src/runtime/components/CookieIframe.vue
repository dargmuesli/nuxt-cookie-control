<template>
  <client-only>
    <iframe v-if="isCookieFunctionalEnabled" />
    <div v-else class="cookieControl__BlockedIframe">
      <p>
        {{ localeStrings?.blockedIframe }}
        <a
          href="#"
          @click.prevent="cookieControl.isModalActive.value = true"
          v-text="localeStrings?.here"
        />
      </p>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { LOCALE_DEFAULT } from '../constants'
import { Locale } from '../types'

import { useCookieControl } from '#imports'

export interface Props {
  locale?: Locale
}
const props = withDefaults(defineProps<Props>(), {
  locale: LOCALE_DEFAULT,
})

const cookieControl = useCookieControl()

// computations
const isCookieFunctionalEnabled = computed(
  () =>
    cookieControl.cookiesEnabled.value.filter((c) => c.name === 'functional')
      .length > 0
)
const localeStrings = computed(
  () => cookieControl.moduleOptions.localeTexts[props.locale]
)
</script>
