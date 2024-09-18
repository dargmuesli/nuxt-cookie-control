<template>
  <div class="inline-block">
    <Switch
      v-model="value"
      class="relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 items-center px-0.5"
      :class="{
        'bg-checkboxDisabledBackground cursor-not-allowed': disabled,
        'bg-checkboxActiveBackground': value,
        'bg-checkboxInactiveBackground': !value,
      }"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out"
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
