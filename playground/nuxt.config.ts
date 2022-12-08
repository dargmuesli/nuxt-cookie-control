export default defineNuxtConfig({
  modules: [
    [
      '@dargmuesli/nuxt-cookie-control',
      {
        locales: ['en', 'de'],
        cookies: {
          necessary: [
            {
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
              // accepted: () => {
              //   // const app = useNuxtApp()
              //   alert('accepted')
              // },
              // declined: () => {
              //   // const app = useNuxtApp()
              //   alert('declined')
              // },
            },
          ],
        },
      },
    ],
  ],
  typescript: {
    tsConfig: {
      include: ['../../**/*'], // https://github.com/nuxt/framework/pull/7726
    },
  },
})
