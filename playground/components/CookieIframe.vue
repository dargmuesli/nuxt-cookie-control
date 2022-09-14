<template>
  <client-only>
    <iframe v-if="iframeEnabled" />
    <div v-else class="cookieControl__BlockedIframe">
      <p>
        {{ iframeText }}
        <a
          v-if="cookies && cookies.text"
          href="#"
          @click.prevent="cookies.modal = true"
          v-text="cookies.text.here"
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
    const data = reactive({
      cookies: this.$cookies,
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
        return data.cookies && data.cookies.text
          ? data.cookies.text.blockedIframe
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
