<template>
    <DropBox>
        <template #trigger>
            <button  @click="openListStatus()" class="flex items-center w-full justify-between gap-2">
                <p>

                </p>
                <p>{{time_selected }}</p>
                <CalendarDateRangeIcon class="w-5 h-5 text-white"></CalendarDateRangeIcon>
            </button>

        </template>
        <!--  -->
        <template #box>
            <div v-show ="store.is_status" class="px-2 py-1 bg-[#faf2ac] absolute  top-2 z-50  rounded-xl w-full">
                <ul class="flex flex-col gap-1 text-sm  ">
                    <li v-for="(item, index) in menu_list" :key="index" @click="selectedStatus(item)" class="py-1.5 text-center  font-medium text-green-900 border-b border-[#9d8d58]">
                        {{ item.name_menu}}
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

/**biến hiển thị*/
const time_selected = ref('Lịch đặt sân') 

// 

/**Danh sách menu*/
const menu_list = ref([
    {
        key: 1,
        name_menu: 'Lịch đặt sân',
        active: true,
        value: 5
    },
    {
        key: 3,
        name_menu: 'Lịch thanh toán',
        active: false,
        value:2
    },
    {
        key: 4,
        name_menu: 'Lịch chưa thanh toán ',
        active: false,
        value: 1
    },
    {
        key: 4,
        name_menu: ' Lịch đã hủy(Cần hoàn tiền)',
        active: false,
        value: 3
    },
    {
        key: 4,
        name_menu: ' Hủy thành công ',
        active: false,
        value: 4
    }
])

/**hàm mở danh sách lọc*/
function openListStatus(){
    store.is_status = !store.is_status
} 
 

/**Hàm chọn lịch theo status*/ 
function selectedStatus(name_menu: any){
    time_selected.value = name_menu.name_menu
    store.status = name_menu.value
}


</script>
