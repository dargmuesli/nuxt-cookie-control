<template>
  <div>
    <CookieControl :locale="locale" />
    <CookieIframe :locale="locale" />
    <fieldset>
      <div>
        <label for="input-en">English</label>
        <input id="input-en" v-model="locale" type="radio" value="en" />
      </div>
      <div>
        <label for="input-de">German</label>
        <input id="input-de" v-model="locale" type="radio" value="de" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '../src/runtime/types'

const locale = ref<Locale>('en')
</script>
