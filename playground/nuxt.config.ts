export default defineNuxtConfig({
  app: {
    head: {
      title: 'Playground',
    },
  },
  compatibilityDate: '2024-04-03',
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
          id: 'n',
          name: {
            de: 'Notwendiger Cookie',
            en: 'Necessary Cookie',
          },
          targetCookieIds: ['NEC'],
        },
      ],
      optional: [
        {
          id: 'o',
          name: 'Optional Cookie',
          links: {
            '/': 'Local Privacy Policy',
            'https://example.com': '3rd Party Privacy Policy',
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
