import { State } from '../src/runtime/types'

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
