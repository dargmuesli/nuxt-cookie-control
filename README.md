# Nuxt Cookie Control

[![ci status][ci-image]][ci-url]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

![nuxt-cookie-control](https://drive.google.com/a/broj42.com/uc?id=19sFguJo7SKUvmH4xu9DhK9ZXzR6oWLX8)

✅ Translated for: ar, az, be, bg, ca, cs, da, de, en, es, fi, fr, hr, hu, id, it, ja, km, ko, lt, nl, no, oc, pt, pl, ro, rs, ru, sk, sl, sv, tr, uk and zh-CN

✅ Vue 3 support

⚠️ For Nuxt 2, please use nuxt-cookie-control < 3.0.0

🚩 API changes since continuing Dario Ferderber's work on [gitlab.com/broj42/nuxt-cookie-control](https://gitlab.com/broj42/nuxt-cookie-control), make sure to read the README!


## 🚀 Getting Started

[![Stackblitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/dargmuesli/nuxt-cookie-control?file=playground%2Fapp.vue)


### Installation

```bash
npx nuxi@latest module add cookie-control
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

// Position of the cookie control button.
// 'top-left', 'top-right', 'bottom-left', 'bottom-right'
// @default 'bottom-right'
controlButtonPosition: 'bottom-right',

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
  sameSite: 'strict',
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
  isPreselected: false // `true` is not GDPR compliant! This flag does not enable any cookies, it only preselects the cookie's modal toggle. The default is `false`.
  name: {
    en: 'Preferences' // you always have to specify a cookie name (in English)
  },
  links: {
    'https://example.com/privacy': 'Privacy Policy',
    'https://example.com/terms': 'Terms of Service',
  },
  src: 'https://example.com/preferences/js?id=<API-KEY>',
  targetCookieIds: ['xmpl_a', 'xmpl_b'],
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

#### Iframe

```html
<CookieIframe>
  <template #iframe>
    Content to display if iframes are blocked.
  </template>
</CookieIframe>
```

#### Control button

```html
<CookieIframe>
  <template #controlButton>
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="currentColor" d="M247.2 17c-22.1-3.1-44.6.9-64.4 11.4l-74 39.5c-19.7 10.5-35.6 27-45.4 47.1l-36.7 75.6c-9.8 20.1-13 42.9-9.1 64.9l14.5 82.8c3.9 22.1 14.6 42.3 30.7 57.9l60.3 58.4c16.1 15.6 36.6 25.6 58.7 28.7l83 11.7c22.1 3.1 44.6-.9 64.4-11.4l74-39.5c19.7-10.5 35.6-27 45.4-47.2l36.7-75.5c9.8-20.1 13-42.9 9.1-64.9l-14.6-82.8c-3.9-22.1-14.6-42.3-30.7-57.9l-60.2-58.3c-16.1-15.6-36.6-25.6-58.7-28.7zM208 144a32 32 0 1 1 0 64a32 32 0 1 1 0-64m-64 192a32 32 0 1 1 64 0a32 32 0 1 1-64 0m224-64a32 32 0 1 1 0 64a32 32 0 1 1 0-64"/></svg>
  </template>
</CookieIframe>
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
