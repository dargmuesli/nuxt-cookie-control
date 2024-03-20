# Nuxt Cookie Control

[![ci status][ci-image]][ci-url]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

![nuxt-cookie-control](https://drive.google.com/a/broj42.com/uc?id=19sFguJo7SKUvmH4xu9DhK9ZXzR6oWLX8)

✅ Translated for: ar, az, be, bg, ca, cs, da, de, en, es, fi, fr, hr, hu, id, it, ja, ko, lt, nl, no, oc, pt, pl, ro, rs, ru, sk, sv, tr, uk and zh-CN

✅ Vue 3 support

⚠️ For Nuxt 2, please use nuxt-cookie-control < 3.0.0

🚩 API changes since continuing Dario Ferderber's work on [gitlab.com/broj42/nuxt-cookie-control](https://gitlab.com/broj42/nuxt-cookie-control), make sure to read the README!


## 🚀 Getting Started

[![Stackblitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/dargmuesli/nuxt-cookie-control?file=playground%2Fapp.vue)


### Installation

```bash
npm i -D @dargmuesli/nuxt-cookie-control
yarn add -D @dargmuesli/nuxt-cookie-control
pnpm i -D @dargmuesli/nuxt-cookie-control
```


### Configuration

```javascript
// nuxt.config.js

modules: [
  '@dargmuesli/nuxt-cookie-control'
],
cookieControl: {
  // typed module options
}

// or

modules: [
  ['@dargmuesli/nuxt-cookie-control', {
    // untyped module options
  }]
]
```


### Usage

```html
<!-- app.vue -->

<template>
  <CookieControl locale="en" />
</template>

<script setup lang="ts">
const {
  cookiesEnabled,
  cookiesEnabledIds,
  isConsentGiven,
  isModalActive,
  moduleOptions,
} = useCookieControl()

// example: react to a cookie being accepted
watch(
  () => cookiesEnabledIds.value,
  (current, previous) => {
    if (
      !previous?.includes('google-analytics') &&
      current?.includes('google-analytics')
    ) {
      // cookie with id `google-analytics` got added
      window.location.reload() // placeholder for your custom change handler
    }
  },
  { deep: true },
)
</script>
```

```ts
//  plugins/analytics.client.ts

// example: initialization based on enabled cookies
const cookieControl = useCookieControl()

if (cookieControl.cookiesEnabledIds.value.includes('google-analytics')) {
  initGoogleAnalytics() // placeholder for your custom initialization
}
```


## API

### Module Options

```javascript
// Position of cookie bar.
// 'top-left', 'top-right', 'top-full', 'bottom-left', 'bottom-right', 'bottom-full'
barPosition: 'bottom-full',

// Switch to toggle if clicking the overlay outside the configuration modal closes the modal.
closeModalOnClickOutside: true,

// Component colors.
// If you want to disable colors set colors property to false.
colors: {
  barBackground: '#000',
  barButtonBackground: '#fff',
  barButtonColor: '#000',
  barButtonHoverBackground: '#333',
  barButtonHoverColor: '#fff',
  barTextColor: '#fff',
  checkboxActiveBackground: '#000',
  checkboxActiveCircleBackground: '#fff',
  checkboxDisabledBackground: '#ddd',
  checkboxDisabledCircleBackground: '#fff',
  checkboxInactiveBackground: '#000',
  checkboxInactiveCircleBackground: '#fff',
  controlButtonBackground: '#fff',
  controlButtonHoverBackground: '#000',
  controlButtonIconColor: '#000',
  controlButtonIconHoverColor: '#fff',
  focusRingColor: '#808080',
  modalBackground: '#fff',
  modalButtonBackground: '#000',
  modalButtonColor: '#fff',
  modalButtonHoverBackground: '#333',
  modalButtonHoverColor: '#fff',
  modalOverlay: '#000',
  modalOverlayOpacity: 0.8,
  modalTextColor: '#000',
  modalUnsavedColor: '#fff',
},

// The cookies that are to be controlled.
// See detailed explanation further down below!
cookies: {
  necessary: [],
  optional: [],
}

// The milliseconds from now until expiry of the cookies that are being set by this module.
cookieExpiryOffsetMs: 1000 * 60 * 60 * 24 * 365, // one year

// Names for the cookies that are being set by this module.
cookieNameIsConsentGiven: 'ncc_c',
cookieNameCookiesEnabledIds: 'ncc_e',

// Options to pass to nuxt's useCookie
cookieOptions: {
  path: '/',
}

// Switch to toggle the "accept necessary" button.
isAcceptNecessaryButtonEnabled: true

// Switch to toggle the button that opens the configuration modal.
isControlButtonEnabled: true,

// Switch to toggle the concatenation of target cookie ids to the cookie description.
isCookieIdVisible: false,

// Switch to toggle the inclusion of this module's css.
// If css is set to false, you will still be able to access your color variables.
isCssEnabled: true,

// Switch to toggle the css variables ponyfill.
isCssPonyfillEnabled: false,

// Switch to toggle the separation of cookie name and description in the configuration modal by a dash.
isDashInDescriptionEnabled: true,

// Switch to toggle the blocking of iframes.
// This can be used to prevent iframes from adding additional cookies.
isIframeBlocked: false,

// Switch to toggle the modal being shown right away, requiring a user's decision.
isModalForced: false,

// The locales to include.
locales: ['en'],

// Translations to override.
localeTexts: {
  en: {
    save: 'Remember',
  }
}
```

#### Cookies

Every property that includes a `{ en: ... }` value is a translatable property that could instead only specify a string (`'...'`) or other locales as well (`{ de: ..., uk: ... }`).

```javascript
{
  description: {
    en: 'This cookie stores preferences.'
  },
  id: 'p', // use a short cookie id to save bandwidth and prefixes to separate
  name: {
    en: 'Preferences' // you always have to specify a cookie name (in English)
  },
  links: {
    'https://example.com/privacy': 'Privacy Policy',
    'https://example.com/terms': 'Terms of Service',
  },
  src: 'https://example.com/preferences/js?id=<API-KEY>',
  targetCookieIds: ['xmpl_a', 'xmpl_b']
}
```

### Component Slots

#### Bar

```html
<CookieControl>
  <template #bar>
    <h2>Bar title</h2>
    <p>Bar description (you can use $cookies.text.barDescription)</p>
    <n-link>Go somewhere</n-link>
  </template>
</CookieControl>
```

#### Modal

```html
<CookieControl>
  <template #modal>
    <h2>Modal title</h2>
    <p>Modal description</p>
  </template>
</CookieControl>
```

#### Cookie

```html
<CookieControl>
  <template #cookie="{ cookie }">
    <h3 v-text="cookie.name" />
    <span v-html="cookie.description" />

    <div v-if="cookie.targetCookieIds">
      <b>Cookie ids: </b>
      <span v-text="cookie?.targetCookieIds?.join(', ')" />
    </div>
  </template>
</CookieControl>
```

### Props

- locale: `['en']`
```html
<CookieControl locale="de" />
```


<!-- Badges -->
[ci-image]: https://img.shields.io/github/actions/workflow/status/dargmuesli/nuxt-cookie-control/ci.yml
[ci-url]: https://github.com/dargmuesli/nuxt-cookie-control/actions/workflows/ci.yml

[npm-version-src]: https://badgen.net/npm/v/@dargmuesli/nuxt-cookie-control/latest
[npm-version-href]: https://npmjs.com/package/@dargmuesli/nuxt-cookie-control

[npm-downloads-src]: https://badgen.net/npm/dm/@dargmuesli/nuxt-cookie-control
[npm-downloads-href]: https://npmjs.com/package/@dargmuesli/nuxt-cookie-control
