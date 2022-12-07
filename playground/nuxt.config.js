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
              cookies: ['NEC'],
            },
          ],
          optional: [
            {
              name: 'Optional Cookie',
              identifier: 'op',
              cookies: ['_o', '_p', '_t'],
              accepted: () => {
                // const app = useNuxtApp()
                alert('accepted')
              },
              declined: () => {
                // const app = useNuxtApp()
                alert('declined')
              },
            },
          ],
        },
      },
    ],
  ],
})
