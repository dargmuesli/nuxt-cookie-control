<template>
  <div>
    <CookieControl :locale="locale">
      <!-- <template #controlButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M247.2 17c-22.1-3.1-44.6.9-64.4 11.4l-74 39.5c-19.7 10.5-35.6 27-45.4 47.1l-36.7 75.6c-9.8 20.1-13 42.9-9.1 64.9l14.5 82.8c3.9 22.1 14.6 42.3 30.7 57.9l60.3 58.4c16.1 15.6 36.6 25.6 58.7 28.7l83 11.7c22.1 3.1 44.6-.9 64.4-11.4l74-39.5c19.7-10.5 35.6-27 45.4-47.2l36.7-75.5c9.8-20.1 13-42.9 9.1-64.9l-14.6-82.8c-3.9-22.1-14.6-42.3-30.7-57.9l-60.2-58.3c-16.1-15.6-36.6-25.6-58.7-28.7zM208 144a32 32 0 1 1 0 64a32 32 0 1 1 0-64m-64 192a32 32 0 1 1 64 0a32 32 0 1 1-64 0m224-64a32 32 0 1 1 0 64a32 32 0 1 1 0-64"
          />
        </svg>
      </template> -->
    </CookieControl>

    <iframe
      src="https://player.vimeo.com/video/259622029?h=8dd8029ca1"
      width="640"
      height="480"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    />

    <iframe>
      <template #iframe>Content to display if iframes are blocked.</template>
    </iframe>

    <fieldset>
      <legend>Choose a language</legend>
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
