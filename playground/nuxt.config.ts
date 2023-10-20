export default defineNuxtConfig({
  app: {
    head: {
      title: 'Playground',
    },
  },
  modules: ['@dargmuesli/nuxt-cookie-control'],
  typescript: {
    includeWorkspace: true,
  },

  // module options
  cookieControl: {
    colors: {
      checkboxActiveBackground: '#00A34A', // text-green-600
    },
    closeModalOnClickOutside: true,
    cookies: {
      necessary: [
        {
          description: {
            de: 'Dieser Cookie tut etwas.',
            en: 'This cookie does something very very very very very very very long.',
          },
          name: {
            de: 'Haben müssen',
            en: 'Must have',
          },
          targetCookieIds: ['NEC'],
        },
      ],
      optional: [
        {
          id: 'op',
          description:
            'Please visit <a href="#link" target="_blank">this link</a>',
          name: 'Marketing',
          links: {
            'https://example.com': 'Privacy Policy',
            'https://example.cop': null,
          },
          targetCookieIds: ['_o', '_p', '_t'],
        },
      ],
    },
    isCookieIdVisible: true,
    isIframeBlocked: true,
    locales: ['en', 'de'],
    localeTexts: {
      de: {
        iframeBlocked: 'Bitte funktionale Cookies aktivieren:',
      },
    },
  },
})
