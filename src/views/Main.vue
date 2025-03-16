<template>
    <div class="h-screen w-screen overflow-hidden img-bg flex flex-col ">
        <Body></Body>
        <Narbar></Narbar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**component con*/
import Narbar from './layout/Narbar.vue';
import Body from './layout/Body.vue';

</script>

<style lang="scss" scoped>

</style>