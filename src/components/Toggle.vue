<template>
  <label class="inline-flex items-center cursor-pointer">
    <input
      v-model="value"
      type="checkbox"
      value=""
      class="sr-only peer flex-shrink-0"
      checked
    />
    <div
      :class="{
        'peer-checked:bg-green-500': color === 'green',
        'peer-checked:bg-black': color === 'back',
      }"
      class="relative w-11 h-6 bg-gray-200 flex-shrink-0 rounded-full dark:bg-green-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-green-500"
    ></div>
    <span
      class="ps-2 text-sm flex items-center font-medium text-gray-900 dark:text-gray-300"
    >
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

/**props truyền từ cha sang*/
const props = defineProps<{
  label: string
  color: string
}>()

const value = defineModel({
  default: false,
})
</script>
