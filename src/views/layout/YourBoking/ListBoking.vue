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
            <div v-if="list_bokings && list_bokings.length === 0" class="w-full h-full flex justify-center items-center">
                <div class="flex-col">
                    <img :src="image9" class="justify-center items-center" alt="">
                    <p class="text-lg text-white font-semibold text-center">Bạn chưa có lịch đặt nào</p>
                </div>
            </div>
            <!-- Đã có sân -->
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 ">
                <div class=" h-full overflow-y-auto flex flex-col items-start w-full   gap-15">
                    <!-- sân -->
                    <div v-for="(boking, index) in list_bokings" :key="boking.id"
                        :class="{ 'border-b border-yellow-500': index !== list_bokings.length - 1 }" class="flex w-full text-lg px-3 border-b border-slate-400 text-white py-3 flex-col items-start gap-1 
                        transition duration-200 hover:brightness-90 hover:rounded-lg hover:bg-green-800">
                        <div class="flex items-center space-x-0">
                            <!-- Đơn ngày -->
                            <span class="bg-green-500 text-white px-6 py-1 text-sm relative">
                               Lịch
                                
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
                                {{ boking.courtName }}
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
                                {{ boking.childCourtName }}:
                            </p>
                            <p class="font-medium border-r border-white pr-2">
                                {{ formatDate(boking.startTime) }}
                            </p>
                            <p class="font-medium">
                                {{ formatTime(boking.startTime) }} - {{ formatTime(boking.endTime) }}
                            </p>

                        </div>
                        <div class="flex items-center gap-2 ">
                            <p class="flex-shrink-0">Thanh toán:</p>
                            <p class="font-medium">
                                {{ formatCurrency(boking.price)}}
                            </p>

                        </div>
                        <div class="flex items-center gap-2 ">
                            <p class="flex-shrink-0">Địa chỉ:</p>
                            <p class="font-medium">
                                {{ boking.courtStreet }},{{ boking.courtWard }},{{ boking.courtDistrict }},Hà nội
                            </p>

                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>


</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from "@/stores/appStore";


/**ảnh*/
import image9 from '@/assets/imgs/image9.png'

/**icon*/
import {  ArrowLeftIcon, ArchiveBoxXMarkIcon } from "@heroicons/vue/24/solid";

/**api*/
import { apiGetListBooking } from "@/service/api/apiBoking";

/**kiểu dữ liệu*/
import type {CourtEvent} from '@/interface'


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



/**Danh sách lịch đặt*/
const list_bokings = ref<CourtEvent[]>([]) 


onMounted(async()=>{
   await getListBoking()
})

// Hàm chuyển đổi startTime thành ngày/tháng/năm
function formatDate(startTime: string): string {
  const date = new Date(startTime);
  return date.toLocaleDateString('vi-VN'); // Trả về định dạng ngày/tháng/năm
}


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

/**Hàm lấy danh sách lịch đặt sân */
async function getListBoking() {
  try {
    const response = await apiGetListBooking();
   // Lấy thông tin người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
    // Kiểm tra nếu API trả về thành công
    if (response && response.status === 200) {
        console.log('response', response.data);

  // Lọc những phần tử có userId = userInfo.id
    const filteredData = response.data.filter((item: any) => item.userId === userInfo.id);
  
  // In ra những phần tử đã lọc
        console.log('Filtered Data', filteredData);
        list_bokings.value = filteredData
} else {
      // toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
    }
  } catch (error) {
    console.error("API Error:", error);
  }
}

// Hàm chuyển đổi startTime thành giờ:phút
function formatTime(startTime: string): string {
  const date = new Date(startTime);
  const hours = date.getHours().toString().padStart(2, '0'); // Lấy giờ và thêm số 0 phía trước nếu cần
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Lấy phút và thêm số 0 phía trước nếu cần
  return `${hours}:${minutes}`; // Trả về giờ:phút
}

// Hàm chuyển đổi số thành định dạng tiền tệ
function formatCurrency(amount: number): string {
  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}





</script>
