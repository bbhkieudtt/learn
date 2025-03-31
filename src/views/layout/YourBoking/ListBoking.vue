<template>
    <div class="h-dvh w-dvw bg-green flex flex-col overflow-hidden pt-5 px-5 pb-2 ">
        <header>
            <ArrowLeftIcon @click="goHome" class=" flex-shrink-0 w-6 h-6 cursor-pointer text-white"></ArrowLeftIcon>
            <div class="flex-shrink-0 w-full grid grid-cols-4">
                <div @click="clickMenu(menu.key)" v-for="menu in menu_list" :key="menu.key"
                    :class="{ 'text-yellow-400 border-b-2': menu.active, 'text-white ': !menu.active }"
                    class="text-center border-yellow-400 py-2  cursor-pointer font-semibold text-lg">
                    {{ menu.name_menu }}

                </div>
            </div>
        </header>
        <!--  -->
        <main class="h-full py-5 flex-1 w-full overflow-hidden">
            <!-- Chưa có sân -->
            <div v-if="list_boking && list_boking.length === 0" class="w-full h-full flex justify-center items-center">
                <div class="flex-col">
                    <img :src="image9" class="justify-center items-center" alt="">
                    <p class="text-lg text-white font-semibold text-center">Bạn chưa có sân nào</p>
                </div>
            </div>
            <!-- Đã có sân -->
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 ">
                <div class=" h-full overflow-y-auto flex flex-col items-start w-full   gap-15">
                    <!-- sân -->
                    <div v-for="(boking, index) in list_boking" :key="boking.id"
                        :class="{ 'border-b border-yellow-500': index !== list_boking.length - 1 }" class="flex w-full text-lg px-3 border-b border-slate-400 text-white py-3 flex-col items-start gap-1 
                        transition duration-200 hover:brightness-90 hover:rounded-lg hover:bg-green-800">
                        <div class="flex items-center space-x-0">
                            <!-- Đơn ngày -->
                            <span class="bg-green-500 text-white px-6 py-1 text-sm relative">
                               {{ boking.status }}
                                
                            </span>

                            <!-- Mũi tên -->
                            <span class="bg-red-500 text-white pl-2 pr-7 py-1  text-sm relative">
                                Đã thanh toán
                                <div
                                    class="absolute left-[-14px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-r-[15px] border-r-red-500 border-b-[15px] border-b-transparent">
                                </div>
                            </span>
                            
                        </div>


                        <div class="flex justify-between w-full items-center">
                            <p class="font-medium text-yellow-200">
                                {{ boking.name_court }}
                            </p>
                            <!--  -->
                            <button
                                class="px-4 flex text-sm items-center gap-1 font-medium py-2 rounded-lg text-white bg-red-500">
                                Hủy lịch
                                <ArchiveBoxXMarkIcon class="w-4 h-4 text-white"></ArchiveBoxXMarkIcon>
                            </button>
                        </div>

                        <div class="flex gap-1 items-center">
                            <p>
                                Chi tiết:
                            </p>
                            <p class="font-medium">
                                {{ boking.court_detail }}:
                            </p>
                            <p class="font-medium border-r border-white pr-2">
                                {{ boking.time }}
                            </p>
                            <p class="font-medium">
                                {{ boking.date }}
                            </p>

                        </div>
                        <div class="flex items-center gap-2 ">
                            <p class="flex-shrink-0">Địa chỉ:</p>
                            <p class="font-medium">
                                {{ boking.address }}
                            </p>

                        </div>



                    </div>
                </div>
            </div>

        </main>
    </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'


/**ảnh*/
import image9 from '@/assets/imgs/image9.png'

/**icon*/
import { PlusIcon, ArrowLeftIcon, ArchiveBoxXMarkIcon } from "@heroicons/vue/24/solid";



/**Biến router */
const router = useRouter()


/**Danh sách menu*/
const menu_list = ref([
    {
        key: 1,
        name_menu: 'Lịch đặt của bạn',
        active: true
    },
    {
        key: 2,
        name_menu: 'Lịch sắp tới',
        active: false
    },
    {
        key: 3,
        name_menu: 'Lịch hoàn thành ',
        active: false
    },
    {
        key: 4,
        name_menu: 'Lịch đã bị hủy ',
        active: false
    }
])

/**danh sách sân pickleball*/
const list_boking = ref([
    {
        id: 123,
        name_court: 'Pickleball Bạch Tuyết',
        status: 'Hoàn thành',
        court_detail: 'Pickleball 1',
        time: '18h - 19h',
        date: 'Ngày 30/03/2025',
        address: '91 Lương Định Của, Phương Mai, Đống Đa, Hà Nội'
    },
    {
        id: 123,
        name_court: 'Pickleball Bạch Tuyết',
        status: 'Hoàn thành',
        court_detail: 'Pickleball 1',
        time: '18h - 19h',
        date: 'Ngày 30/03/2025',
        address: '91 Lương Định Của, Phương Mai, Đống Đa, Hà Nội'
    },
    {
        id: 123,
        name_court: 'Pickleball Bạch Tuyết',
        status: 'Hoàn thành',
        court_detail: 'Pickleball 1',
        time: '18h - 19h',
        date: 'Ngày 30/03/2025',
        address: '91 Lương Định Của, Phương Mai, Đống Đa, Hà Nội'
    }

]);

/**Bấm chọn danh sách*/
function clickMenu(key: number) {
    menu_list.value.forEach((item) => {
        item.active = false
        if (item.key === key) {
            item.active = true
        }
    });
}


/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/main');
}



</script>
