export default defineNuxtConfig({
  modules: ['@dargmuesli/nuxt-cookie-control'],
  typescript: {
    tsConfig: {
      include: ['../../**/*'], // https://github.com/nuxt/framework/pull/7726
    },
  },
})
