import { defineNuxtModule, hasNuxtModule } from '@nuxt/kit'
import {
  addCookieControl,
  CookieType,
} from '@dargmuesli/nuxt-cookie-control/kit'

export default defineNuxtModule({
  setup() {
    if (hasNuxtModule('@dargmuesli/nuxt-cookie-control')) {
      addCookieControl(
        {
          id: 'module-added-cookie',
          name: 'Module Added Cookie',
          description: 'This cookie was added from the module.',
          targetCookieIds: ['_module_added_cookie'],
        },
        CookieType.OPTIONAL,
      )
    }
  },
})
