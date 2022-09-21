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

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'CookieIframe',
  setup() {
    const { $cookies } = useNuxtApp()

    const data = reactive({
      cookies: $cookies,
    })
    const computations = {
      iframeEnabled: computed(() => {
        return (
          data.cookies.enabled.filter((c) => {
            return c.name === 'functional'
          }).length > 0
        )
      }),
      iframeText: computed(() => {
        return data.cookies && data.cookies.moduleOptions.text
          ? data.cookies.moduleOptions.text.blockedIframe
          : ''
      }),
    }

    return {
      ...data,
      ...computations,
    }
  },
})
</script>
