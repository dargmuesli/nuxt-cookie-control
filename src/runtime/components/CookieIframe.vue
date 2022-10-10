<template>
  <client-only>
    <iframe v-if="iframeEnabled" />
    <div v-else class="cookieControl__BlockedIframe">
      <p>
        {{ iframeText }}
        <a
          v-if="cookies && cookies.moduleOptions.text"
          href="#"
          @click.prevent="cookies.modal = true"
          v-text="cookies.moduleOptions.text.here"
        />
      </p>
    </div>
  </client-only>
</template>

<script setup lang="ts">
const { $cookies } = useNuxtApp()

// data
const cookies = ref($cookies)

// computations
const iframeEnabled = computed(() => {
  return (
    cookies.value.enabled.filter((c) => {
      return c.name === 'functional'
    }).length > 0
  )
})
const iframeText = computed(() => {
  return cookies.value && cookies.value.moduleOptions.text
    ? cookies.value.moduleOptions.text.blockedIframe
    : ''
})
</script>
