<template>
    <div class="h-dvh w-dvw flex flex-col gap-3 px-3 py-2 bg-green ">
        <header class="flex justify-between items-center py-2">
            <ArrowLeftIcon @click='goToDetail' class="w-7 h-7 cursor-pointer text-white"></ArrowLeftIcon>
            <!--  -->
            <p class=" text-2xl font-semibold text-white">
                Đặt lịch ngay
            </p>
            <!--  -->
            <p>

            </p>
        </header>
        <!--  -->
        <main class="h-full flex flex-col gap-5 overflow-auto ">
            <!-- tên -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Tên khách hàng</label>
                <div
                    class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <input type="text" v-model="info_client.name_client" class="text-lg w-full outline-none "
                        placeholder="Nhập tên khách hàng">

                </div>
            </div>
            <!-- sđt -->
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Số điện thoại</label>
                <div
                    class="flex justify-between items-center py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm">
                    <div class="flex gap-2 w-full">
                        <div class="flex gap-2 flex-shrink-0 items-center">
                            <div class="p-1.5 rounded-full bg-red-600">
                                <StarIcon class="w-4 h-4 text-yellow-300"></StarIcon>
                            </div>
                        </div>
                        <input type="tel" v-model="info_client.phone_client" @input="filterSuggestions"
                            @keypress="onlyNumber" class="text-lg w-full  outline-none "
                            placeholder="Nhập số điện thoại">
                    </div>
                    <MagnifyingGlassIcon class="w-6 h-6 text-slate-700 shrink-0"></MagnifyingGlassIcon>
                </div>
                <!-- Danh sách gợi ý -->
                <ul v-if="suggestions.length > 0"
                    class="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto rounded shadow z-10">
                    <li v-for="(user, index) in suggestions" :key="index" @click="selectUser(user)"
                        class="p-2 hover:bg-gray-100 cursor-pointer">
                        {{ user.username }} - {{ user.phoneNumber }}
                    </li>
                </ul>
            </div>
            <!-- Ghi chú
            <div class="flex flex-col gap-2 py-1">
                <label for="" class="text-xl font-semibold text-white"> Ghi chú</label>
                <textarea class="text-lg w-full  py-2 px-3 bg-white rounded-md border border-slate-500 shadow-sm  "
                    placeholder="Nhập tên khách hàng">
                    </textarea>
            </div> -->
            <!-- Thông tin  -->
            <div class="flex flex-col mt-10 bg-green-900 rounded-md opacity-95 gap-3 px-5 py-5 ">
                <div class="flex gap-3  items-center ">
                    <ClipboardDocumentListIcon class="w-10 h-10 text-yellow-200 "></ClipboardDocumentListIcon>
                    <p class="text-xl font-semibold text-yellow-300">
                        Thông tin đặt lịch
                    </p>
                </div>
                <div class="flex gap-2 flex-col  ">
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-xl">Tên sân:</p>
                        <p class="font-semibold">{{ store_court.court_detail?.courtName }}</p>
                    </div>
                    <div class="flex text-lg text-white items-center gap-3">
                        <p class="text-lg">Địa chỉ:</p>
                        <p class="font-semibold">{{ address }}</p>
                    </div>
                    <!--  -->
                    <div class="flex text-lg text-white  gap-3">
                        <p class="text-lg ">Thời gian & sân:</p>

                        <p v-if="store.selectInfo">{{ formattedStartDate }} </p> từ
                        <span> {{ start_boking }} - {{
                                end_boking }}</span>
                    </div>
                    <div class="flex text-lg text-white  gap-3">
                        <p class="text-lg ">Sân con:</p>

                        <p class="font-semibold text-lg text-white "> {{ store_court.chill_detail?.childCourtName }}

                            
                        </p>
                    </div>
                        <!-- Tổng giờ -->
                        <div class="flex text-lg text-white items-center gap-3">
                            <p class="text-lg">Tổng giờ:</p>
                            <p class="font-semibold">{{ total_boking_time }} giờ</p>
                        </div>
                         <!-- Tổng giờ -->
                         <div class="flex text-lg text-white items-center gap-3">
                            <p class="text-lg">Giá (1 tiếng):</p>
                            <p class="font-semibold">{{formattedRentCost}} /giờ</p>
                        </div>
                        <!-- Tổng tiền-->
                        <div class="flex text-lg text-white items-center gap-3">
                            <p class="text-lg">Tổng tiền phải thanh toán:</p>
                            <p class="font-semibold">{{totalRentCost}} </p>
                        </div>
                        <!-- Tổng giờ -->
                        <div class="flex text-xl text-white items-center gap-5">
                            <input type="checkbox" class="w-6 h-6">
                            <p class="font-semibold">Đặt cọc</p>
                        </div>
                    </div>
                </div>

        </main>
        <!--  -->
        <button @click="addBoking" class="text-center text-xl font-semibold text-white bg-yellow-500 rounded-lg py-3">
            Xác nhận
        </button>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'vue-router'
import { useAppStoreCourt } from '@/stores/appStoreCourt'


/**icon*/
import { } from "@heroicons/vue/24/outline";

import { ArrowLeftIcon, MagnifyingGlassIcon, StarIcon, ClipboardDocumentListIcon } from "@heroicons/vue/24/solid";

/**kiểu dữ liệu*/
import type {
    ClientBoking
} from '@/interface'
import { log } from 'async';

/**kiểu dữ liệu*/
import type { UserInfo, } from '@/interface'

const address = computed(() => {
    const detail = store_court.court_detail;

    if (!detail) return "";

    return `${detail.street}, ${detail.ward}, ${detail.district}, Hà Nội`;
});




const suggestions = ref<UserInfo[]>([])


/**biến store*/
const store = useAppStore()

const store_court = useAppStoreCourt()

/**Biến router */
const router = useRouter()

/**Biến giờ bắt đầu đặt sân */
const start_boking = computed(() => {
    return store.selectInfo?.start
        ? new Date(store.selectInfo.start).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";
});
/**Biến giờ bắt đầu đặt sân */
const end_boking = computed(() => {
    return store.selectInfo?.start
        ? new Date(store.selectInfo.end).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";
});

/** Biến tính tổng giờ */
const total_boking_time = computed(() => {
    const startTime = store.selectInfo?.start ? new Date(store.selectInfo.start) : null;
    const endTime = store.selectInfo?.end ? new Date(store.selectInfo.end) : null;
    
    if (startTime && endTime) {
        const diff = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60; // Tính chênh lệch theo giờ
        return diff.toFixed(2); // Làm tròn đến 2 chữ số thập phân
    }
    
    return 0; // Nếu không có dữ liệu, trả về 0
});



const formattedStartDate = computed(() => {
  const startStr = store.selectInfo?.startStr;
  if (!startStr) {
    return ''; // or return a default value if needed
  }

  const date = new Date(startStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
});


/**giá sân trong 1 tiếng*/ 
const formattedRentCost = computed(() => {
  if (store_court.chill_detail?.rentCost) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(store_court.chill_detail.rentCost);
  }
  return '';
});

const totalRentCost = computed(() => {
  const rentCost = store_court.chill_detail?.rentCost || 0;
  const totalTime = parseFloat(String(total_boking_time.value)); // Chuyển đổi thành chuỗi trước khi parseFloat
  const totalCost = rentCost * totalTime; // Tính tổng tiền
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalCost); // Định dạng kết quả thành tiền tệ
});




/**Biến lưu thông tin khách đặt lịch*/
const info_client = ref<ClientBoking>({
    name_client: '',      // Add an empty string or default value
    phone_client: '',     // Add an empty string or default value
    note_boking: '',      // Add an empty string or default value
});


/**Hàm kiểm tra chỉ cho nhập số không nhập chữ*/
const onlyNumber = (event: any) => {
    if (!/^\d$/.test(event.key)) {
        // Chặn ký tự không phải số
        event.preventDefault();
    }
};

/**Hàm tạo lịch đặt sân*/
async function addBoking() {
    console.log(' store.add_boking', store.add_boking);
    /**gán thông tin vào store */
    store.info_client = info_client.value
    /**Biến để bên FullCalendar nhận ra sự thay đổi để thêm thêm lịch đặt sân */
    store.add_boking = true
    /*trở về màn danh sách lịch**/
    console.log(' store.add_boking', store.add_boking);
    await nextTick(); // Đảm bảo Vue nhận diện thay đổi trước khi chuyển trang
    setTimeout(() => {
        router.push('/detail');
    }, 100); // Delay 100ms để đảm bảo watch chạy trước
}

function goToDetail() {
    router.push('/detail')
}


const filterSuggestions = () => {
    const input = info_client.value.phone_client.trim();
    if (input.length === 0) {
        suggestions.value = [];
        return;
    }
    console.log('store.list_user', store.list_user);

    suggestions.value = store.list_user.filter((user) =>
        user.phoneNumber.startsWith(input)
    );
};

const selectUser = (user: UserInfo) => {
    info_client.value.phone_client = user.phoneNumber;
    info_client.value.name_client = user.username;
    suggestions.value = []; // Ẩn gợi ý sau khi chọn
};



</script>

<style lang="scss" scoped></style>