<template>
  <client-only>
    <iframe v-if="iframeEnabled" />
    <div v-else class="cookieControl__BlockedIframe">
      <p>
        {{ iframeText }}
        <a
          v-if="$cookies.moduleOptions.text"
          href="#"
          @click.prevent="$cookies.isModalActive.value = true"
          v-text="$cookies.moduleOptions.text.here"
        />
      </p>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useNuxtApp } from '#app'

const { $cookies } = useNuxtApp()

// computations
const iframeEnabled = computed(() => {
  return (
    $cookies.cookiesEnabled.value.filter((c) => {
      return c.name === 'functional'
    }).length > 0
  )
})
const iframeText = computed(() => {
  return $cookies && $cookies.moduleOptions.text
    ? $cookies.moduleOptions.text.blockedIframe
    : ''
})
</script>
