<template>
    <DropBox>
        <template #trigger>
            <button  @click="openListSelected()" class="flex items-center w-full justify-between gap-2">
                <p>

                </p>
                <p>{{time_selected }}</p>
                <CalendarDateRangeIcon class="w-5 h-5 text-white"></CalendarDateRangeIcon>
            </button>

        </template>
        <!--  -->
        <template #box>
            <div v-show ="store.filter_time" class="px-2 py-1 bg-[#faf2ac] absolute  top-2 z-50  rounded-xl w-full">
                <ul class="flex flex-col gap-1 text-sm  ">
                    <li @click="openModal" class="py-1.5 text-center  font-medium text-green-900 border-b border-[#9d8d58]">
                        Chọn Ngày
                    </li>
                    <li class="py-1.5 text-center  font-medium text-green-900 border-b border-[#9d8d58]">
                        Chọn khoảng thời gian
                    </li>
                    <li class="py-1.5 text-center  font-medium text-green-900 border-b border-[#9d8d58]">
                        Chọn Tháng
                    </li>
                    <li class="py-1.5 text-center  font-medium text-green-900 ">
                        Chọn Năm
                    </li>
                </ul>
            </div>

        </template>
    </DropBox>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DropBox from "@/components/DropBox.vue";
import { useAppStore } from '@/stores/appStore'

/**icon*/
import {  } from "@heroicons/vue/24/outline"; 
// 
import { CalendarDateRangeIcon ,} from "@heroicons/vue/24/solid"; 

/**biến store*/
const store = useAppStore()

/**Biến giá trị thời gian*/
const time_selected = ref(
    new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date())
);

/**hàm mở danh sách lọc*/
function openListSelected(){
    console.log('store.filter_time',store.filter_time);
    store.filter_time = !store.filter_time
} 

/**Mở modal*/
function openModal(){
    store.show_modal = true
} 

</script>
