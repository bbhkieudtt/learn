<template>
    <div>
        <header class="bg-green flex flex-col gap-2 px-3 py-2 ">
            <!--  -->
            <div class="flex justify-between items-center ">
                <IconBack class="w-6 h-6 text-white"></IconBack>
                <!--  -->
                <h3 class="text-2xl font-semibold text-white">
                    Trạng thái sân
                </h3>
                <div class="flex gap-5">
                    <IconSearch class="w-5 h-5 text-white"></IconSearch>
                    <IconFilter class="w-5 h-5 text-white"></IconFilter>
                </div>

            </div>
            <!--  -->
            <div class="grid grid-cols-4 gap-2">
                <div>

                </div>

            </div>


        </header>
        <main>
            <FullCalendar></FullCalendar>
        </main>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**component*/
import FullCalendar from './layout/FullCalendar.vue';

/**icon*/
import IconBack from '@/components/Icons/IconBack.vue'; 
import IconSearch from '@/components/Icons/IconSearch.vue';
import IconFilter from '@/components/Icons/IconFilter.vue';



/**danh sách thống kê*/ 
const list_statistical = ref([
   
])

</script>

<style lang="scss" scoped>

</style>