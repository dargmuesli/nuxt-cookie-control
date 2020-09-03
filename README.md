![Nuxt Cookie Control](https://drive.google.com/a/broj42.com/uc?id=12TegiHCNYG1NO84CmQ2CfMAzzn-5o027)
# Nuxt Cookie Control
Try it out here:
[Nuxt.js Cookie Control](https://codesandbox.io/s/vkwqmm577)

## 🚀 Usage
```bash
npm i nuxt-cookie-control
```
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm downloads][kofi-src]][kofi-href]

```javascript
//nuxt.config.js
modules: [
  'nuxt-cookie-control'
]
//or
modules: [
  ['nuxt-cookie-control', {
    //your options
  }]
]

//to open cookie modal anywhere:
$cookies.modal = true
//or
this.$cookies.modal = true
```
```html
<!--template-->
<!--
  CookieControl component is registered globally,
  you don't need to register it anywhere.
-->
<CookieControl/>
<!--or-->
<CookieControl></CookieControl>
```
## Slot
If you want to add elements to the cookie bar you can do it like this
```html
<CookieControl>
  <template v-slot:bar>
    <h3>Bar title</h3>
    <p>Bar description (you can use $cookies.text.barDescription)</p>
    <n-link>Go somewhere</n-link>
  </template>

  <template v-slot:modal>
    <h3>Modal title</h3>
    <p>Modal description</p>
  </template>
</CookieControl>
```

## Props
### Locale
```html
<CookieControl locale="de"/>
```
#### Default: en,
#### Currently available: 
- en
- de
- it
- es
- fr
- pt
- hr
- no
- hu

## 🔧 Options
Options in nuxt.config.js
```javascript
modules: [
  ['nuxt-cookie-control', {
    //default css (true)
    //if css is set to false, you will still be able to access
    //your color variables (example. background-color: var(--cookie-control-barBackground))
    css: true,

    //in case you have subdomains (shop.yourdomain.com)
    domain: 'yourdomain.com',

    //modal opener (cookie control)
    controlButton: true,

    //block iframes to prevent them from adding additional cookies
    blockIframe: true,

    //or if you want to set initialState to false (default value for initialState is true)
    blockIframe: {
      initialState: false
    },

    //position of cookie bar:
    //'top-left', 'top-right', 'top-full',
    //'bottom-left', 'bottom-right', 'bottom-full'
    barPosition: 'bottom-full',

    //default colors
    //if you want to disable colors set colors property to false
    colors: {
      barTextColor: '#fff',
      modalOverlay: '#000',
      barBackground: '#000',
      barButtonColor: '#000',
      modalTextColor: '#000',
      modalBackground: '#fff',
      modalOverlayOpacity: 0.8,
      modalButtonColor: '#fff',
      modalUnsavedColor: '#fff',
      barButtonHoverColor: '#fff',
      barButtonBackground: '#fff',
      modalButtonHoverColor: '#fff',
      modalButtonBackground: '#000',
      controlButtonIconColor: '#000',
      controlButtonBackground: '#fff',
      barButtonHoverBackground: '#333',
      checkboxActiveBackground: '#000',
      checkboxInactiveBackground: '#000',
      modalButtonHoverBackground: '#333',
      checkboxDisabledBackground: '#ddd',
      controlButtonIconHoverColor: '#fff',
      controlButtonHoverBackground: '#000',
      checkboxActiveCircleBackground: '#fff',
      checkboxInactiveCircleBackground: '#fff',
      checkboxDisabledCircleBackground: '#fff',
    },

    //default texts
    text: {
      barTitle: 'Cookies',
      barDescription: 'We use our own cookies and third-party cookies so that we can show you this website and better understand how you use it, with a view to improving the services we offer. If you continue browsing, we consider that you have accepted the cookies.',
      acceptAll: 'Accept all',
      declineAll: 'Delete all',
      manageCookies: 'Manage cookies',
      unsaved: 'You have unsaved settings',
      close: 'Close',
      save: 'Save',
      necessary: 'Necessary cookies',
      optional: 'Optional cookies',
      functional: 'Functional cookies',
      blockedIframe: 'To see this, please enable functional cookies',
      here: 'here'
    }
  ]
]

//for multilanguage see - Multilanguage
```
without options (Simple)
```javascript
modules: [
'nuxt-cookie-control'
]
```
### Cookies
```javascript
modules: [
'nuxt-cookie-control'
]
...
...
...
cookies: {
  necessary: [
    {
      //if multilanguage
      name: {
        en: 'Default Cookies'
      },
      //else
      name:  'Default Cookies',
      //if multilanguage
      description: {
        en:  'Used for cookie control.'
      },
      //else
      description:  'Used for cookie control.',
      cookies: ['cookie_control_consent', 'cookie_control_enabled_cookies']
    }
  ],
  optional: [
    {
      name:  'Google Analitycs',
      //if multilanguage
      description: {
        en:  'Google GTM is ...'
      },
      //else
      description:  'Google GTM is...',
      src:  'https://www.googletagmanager.com/gtag/js?id=<API-KEY>',
      async:  true,
      cookies: ['_ga', '_gat', '_gid'],
      accepted: () =>{
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });
      },
      declined: () =>{
      }
    }
  ]
}
```
### Multilanguage
Set **locale** prop
```html
<CookieControl locale="de"/>
```
#### Default: en,
#### Currently available: 
- en
- de
- it
- es
- fr
- pt
- hr
- no
- hu

If you don't like the default texts you can change them in options (**nuxt.config.js**)
```javascript
text: {
  locale: {
    en: {
      barTitle:  'Cookies Different',
      barDescription:  'We use our own cookies and third-party...',
    },

    de: {
      ...
    }
  },

  //this will override locale text
  barTitle: 'Override Title'
}
```

### Buy me a coffee
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F31MWWL)


<!-- Badges -->
[npm-version-src]: https://badgen.net/npm/v/nuxt-cookie-control/latest
[npm-version-href]: https://npmjs.com/package/nuxt-cookie-control

[kofi-src]: https://badgen.net/badge/icon/kofi?icon=kofi&label=support
[kofi-href]: https://ko-fi.com/darioferderber

[npm-downloads-src]: https://badgen.net/npm/dm/nuxt-cookie-control
[npm-downloads-href]: https://npmjs.com/package/nuxt-cookie-control