<template>
  <!-- Background modal -->
  <div
    id="default-modal"
    tabindex="-1"
    aria-hidden="true"
    :class="$props.bg_class"
    class="overflow-hidden  overflow-x-hidden fixed top-0 right-0 z-20 justify-center items-center w-full md:inset-0 h-full max-h-full bg-black/30"
    @click="closeModal"
  ></div>
  <!-- Modal content -->
  <div
    :class="$props.modal_class"
    class="fixed z-30 bg-white rounded-lg w-fit h-fit   md:my-0 flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <slot name="content"></slot>
  </div>
</template>

<script setup lang="ts">
// * Libraries
import { watch } from 'vue';
import { useMagicKeys } from '@vueuse/core';

const $props = defineProps<{
  /** Chế độ bật tắt */
  close?: Function
  /** Class background thêm vào */
  bg_class?: String
  /** Class modal */
  modal_class?: String
}>()

/** các phím tắt */
const { escape } = useMagicKeys()

// lắng nghe phím esc nếu nhấn thì đóng modal
watch(escape, () => { if ($props.close) $props.close() })

/** Tắt modal khi click vào background */
const closeModal = () => { if ($props.close) $props.close() }



</script>
