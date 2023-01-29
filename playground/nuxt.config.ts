export default defineNuxtConfig({
  modules: [
    [
      '@dargmuesli/nuxt-cookie-control',
      {
        colors: {
          checkboxActiveBackground: '#00A34A', // text-green-600
        },
        cookies: {
          necessary: [
            {
              description: {
                de: 'Dieser Cookie tut etwas.',
                en: 'This cookie does something.',
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
              name: 'Optional Cookie',
              id: 'op',
              targetCookieIds: ['_o', '_p', '_t'],
            },
          ],
        },
        locales: ['en', 'de'],
      },
    ],
  ],
  typescript: {
    includeWorkspace: true,
  },
})
