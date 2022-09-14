import { State } from '../src/types'

declare module '#app' {
  interface NuxtApp {
    $cookies: State
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $cookies: State
  }
}

export {}
