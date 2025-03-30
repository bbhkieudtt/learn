<template>
    <div class="h-dvh w-dvw  flex flex-col overflow-hidden  ">
        <header class="bg-green px-3 py-4 flex flex-col gap-5">
            <div class="flex  justify-between text-xl font-medium text-white">
                <ArrowLeftIcon @click="goHome" class=" flex-shrink-0 w-6 h-6 cursor-pointer text-white"></ArrowLeftIcon>
                <p>
                    Thống kê doanh thu
                </p>
                <p>

                </p>
            </div>
            <!--  -->
            <div class="grid grid-cols-2 gap-8">
                <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
                    <List_Yard></List_Yard>
                </div>
                <!--  -->
                <!--  -->
                <div class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
                    <TimeFilter></TimeFilter>
                </div>
            </div>
        </header>
        <!--  -->


    </div>
    <!--  -->
    <Modal v-if="store.show_modal" :close="showModal">
        <template #content>
            <div class="w-[300px] h-[300px]">
                <VueDatePicker class="w-full h-full" @update:model-value="handleDate" v-model="store.date"
                    :inline="true" auto-apply locale="vi" :day-names="customDayNames">
                </VueDatePicker>
            </div>
        </template>
    </Modal>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

/**icon*/
import { ArrowLeftIcon } from "@heroicons/vue/24/solid";

/***/
import List_Yard from './List_Yard.vue';
import TimeFilter from '../FilterYard/TimeFilter.vue';

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"


/**Biến router */
const router = useRouter()

const store = useAppStore()

/**hàm đóng modal*/
function showModal() {
  store.show_modal = false;
}

/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/main');
}


</script>
