<template>
     <div v-if="userInfo === 999" class="h-screen w-screen overflow-hidden img-bg flex flex-col ">
        <BodyAdmin></BodyAdmin>
        <NarbarAdmin></NarbarAdmin>
    </div>

    <!--  -->
    <div v-else class="h-screen w-screen overflow-hidden img-bg flex flex-col ">
        <Body></Body>
        <Narbar></Narbar>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/**component con*/
import Narbar from './layout/Narbar.vue';
import Body from './layout/Body.vue';

/**component admin*/
import NarbarAdmin from './layoutAdmin/Narbar.vue';
import BodyAdmin from './layoutAdmin/Body.vue';

/**Biến lưu quyền*/ 
const userInfo = ref(null);

/**onMounted*/
onMounted(() => {
      const storedUserInfo = localStorage.getItem('role');

      if (storedUserInfo) {
        userInfo.value = JSON.parse(storedUserInfo);
      }
    });

</script>

<style lang="scss" scoped>

</style>