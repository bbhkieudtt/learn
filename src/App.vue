<template>
  <div class="w-screen h-screen">
    <!-- <Network />
    <AdBlocker /> -->
    <Loading v-if="loadingGlobal" type="FULL" />
    <div class="h-full overflow-hidden overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { loadingGlobal } from "@/service/global-config"
import Loading from '@/components/Loading.vue'
import Network from './components/Network.vue'
import AdBlocker from './components/AdBlocker.vue'

const commonStore = useCommonStore()
</script>

<style lang="scss">
@use "@/assets/css/index.scss";
</style>