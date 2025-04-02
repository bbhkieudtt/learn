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
        <main class="flex flex-col h-full pt-7 gap-5">
            <h4 class="items-center flex justify-center text-xl font-semibold text-green-900">
                Thống kê sân (31/03/2025)
            </h4>
            <!--  -->

            <table class="min-w-full h-full bg-white border-separate border border-green-800 rounded-lg shadow-lg">
                <thead>
                    <tr class="bg-green-800 text-white">
                        <th class="py-3 px-6 text-left border-r border-gray-200">Sân</th>
                        <th class="py-3 px-6 text-left border-r border-gray-200">Tổng giờ</th>
                        <th class="py-3 px-6 text-left border-r border-gray-200">Tổng đơn</th>
                        <th class="py-3 px-6 text-left border-r border-gray-200">Giảm giá</th>
                        <th class="py-3 px-6 text-left">Đã T.Toán</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Use v-for to loop through the items in the data array -->
                    <tr v-for="(item, index) in tableData" :key="index"
                        class="hover:bg-green-50 border-b border-gray-200">
                        <td class="py-3 px-6 border-r border-gray-200">{{ item.san }}</td>
                        <td class="py-3 px-6 border-r border-gray-200">{{ item.tongGio }}</td>
                        <td class="py-3 px-6 border-r border-gray-200">{{ item.tongDon }}</td>
                        <td class="py-3 px-6 border-r border-gray-200">{{ item.giamGia }}</td>
                        <td class="py-3 px-6" :class="item.daToan ? 'text-green-500' : ''">{{ item.daToan }}</td>
                    </tr>
                </tbody>
            </table>
            <!--  -->
            <div class="flex-shrink-0 flex justify-end px-7 text-xl shadow-sm gap-1.5 text-green-900 font-bold pt-2 pb-4 text">
              <CurrencyDollarIcon class="w-7 h-7 text-yellow-700"></CurrencyDollarIcon>  <p>Tổng doanh thu: <span class="font-bold">100.000.000 đ</span></p>
            </div>
        </main>


    </div>
    <!--  -->
    <Modal v-if="store.show_modal" :close="showModal">
        <template #content>
            <div class="w-[300px] h-[300px]">
                <!-- @update:model-value="handleDate" -->
                 <!-- :day-names="customDayNames" -->
                <VueDatePicker class="w-full h-full"  v-model="store.date"
                    :inline="true" auto-apply locale="vi" >
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
import { ArrowLeftIcon , CurrencyDollarIcon } from "@heroicons/vue/24/solid";

/***/
import List_Yard from './List_Yard.vue';
import TimeFilter from '../FilterYard/TimeFilter.vue';

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"


/**Biến router */
const router = useRouter()

const store = useAppStore()

const tableData = ref([
    { san: 'Pickleball 1', tongGio: '3h30p', tongDon: '3.500 đ', giamGia: '0 đ', daToan: '1.500 đ' },
    { san: 'Pickleball 2', tongGio: '4h', tongDon: '842.000 đ', giamGia: '0 đ', daToan: '0 đ' },
    { san: 'Pickleball 3', tongGio: '3h', tongDon: '600.000 đ', giamGia: '0 đ', daToan: '0 đ' },
    { san: 'Pickleball 4', tongGio: '2h', tongDon: '3.000 đ', giamGia: '0 đ', daToan: '0 đ' },
    { san: 'Pickleball 5', tongGio: '2h', tongDon: '2.000 đ', giamGia: '0 đ', daToan: '0 đ' },
    { san: 'Pickleball 6', tongGio: '0h', tongDon: '0 đ', giamGia: '0 đ', daToan: '0 đ' },
    { san: 'Pickleball 1', tongGio: '2h', tongDon: '2.000 đ', giamGia: '0 đ', daToan: '2.000 đ' }
])

/**hàm đóng modal*/
function showModal() {
    store.show_modal = false;
}

/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/main');
}


</script>
