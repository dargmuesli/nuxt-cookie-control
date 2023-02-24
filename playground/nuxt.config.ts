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
    cookies: {
      necessary: [
        {
          description: {
            de: 'Dieser Cookie tut etwas.',
            en: 'This cookie does something very very very very very very very long.',
          },
          name: {
            de: 'Notwendiger Cookie',
            en: 'Necessary Cookie',
          },
          targetCookieIds: ['NEC'],
        },
      ],
      optional: [
        {
          id: 'op',
          name: 'Optional Cookie',
          links: {
            'https://example.com': 'Privacy Policy',
            'https://example.cop': null,
          },
          targetCookieIds: ['_o', '_p', '_t'],
        },
      ],
    },
    isCookieIdVisible: true,
    locales: ['en', 'de'],
  },
})
