<template>
  <div class="inline-block">
    <Switch
      v-model="value"
      class="relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 items-center px-0.5"
      :class="{
        'bg-checkboxDisabledBackground cursor-not-allowed': disabled,
        'bg-checkboxActiveBackground cursor-pointer': value && !disabled,
        'bg-checkboxInactiveBackground cursor-pointer': !value && !disabled,
      }"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        class="inline-block w-4 h-4 transition duration-200 ease-in-out transform rounded-full shadow-lg pointer-events-none ring-0"
        :class="
          value
            ? 'translate-x-4 bg-checkboxActiveCircleBackground'
            : 'translate-x-0 bg-checkboxInactiveCircleBackground'
        "
      />
    </Switch>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Switch } from '@headlessui/vue'

// Props
export interface Props {
  modelValue: boolean
  disabled: boolean
}
const props = withDefaults(defineProps<Props>(), {
  // TODO -> enabled by default config
  modelValue: false,
  disabled: false,
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Computed
const value = computed({
  get: () => {
    return props.modelValue
  },
  set: (value) => {
    if (props.disabled === true) {
      return
    }

    emit('update:modelValue', value)
  },
})
</script>
