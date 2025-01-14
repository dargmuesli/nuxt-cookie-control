<template>
  <slot v-if="!isPrerendered" />
  <ClientOnly v-else>
    <slot />
  </ClientOnly>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app'

const runtimeConfig = useRuntimeConfig()
const isPrerendered = runtimeConfig.public.cookieControl._isPrerendered
</script>
