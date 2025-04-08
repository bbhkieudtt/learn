<template>
    <div class="h-dvh w-dvw bg-green flex flex-col overflow-hidden pt-5 px-5 pb-2 ">
        <header>
            <ArrowLeftIcon @click="goHome" class=" flex-shrink-0 w-6 h-6 cursor-pointer text-white"></ArrowLeftIcon>
            <!-- Hàng 2 -->
            <div class="grid grid-cols-3 gap-3 ">
                <!--  -->
                <div class="flex cursor-pointer gap-2 button rounded-md  ">
                    <ListYardSmall></ListYardSmall>
                </div>
                <!--  -->
                <div class="flex cursor-pointer gap-2 button rounded-md  ">
                    <FilterBokingStatus></FilterBokingStatus>
                </div>
                <!--  -->
                <div @click="selectedTime"
                    class="flex items-center justify-between text-lg cursor-pointer button rounded-md ">
                    <p>

                    </p>
                    <p>{{ time_selected }}</p>
                    <CalendarDateRangeIcon class="w-5 h-5 text-white"></CalendarDateRangeIcon>
                </div>
            </div>
        </header>
        <!--  -->
        <main class="h-full py-5 flex-1 w-full overflow-hidden">
            <!-- Chưa có lịch đặt sân -->
            <div v-if="list_bokings && list_bokings.length === 0"
                class="w-full h-full flex justify-center items-center">
                <div class="flex-col">
                    <img :src="image9" class="justify-center items-center" alt="">
                    <p class="text-lg text-white font-semibold text-center">Sân chưa có lịch đặt</p>
                </div>
            </div>
            <!-- Đã lịch đặt -->
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5 ">
                <div class=" h-full overflow-y-auto flex flex-col items-start w-full   gap-15">
                    <!-- sân -->
                    <div v-for="(boking, index) in filteredBookings" :key="boking.id"
                        :class="{ 'border-b border-yellow-500': index !== list_bokings.length - 1 }" class="flex w-full text-lg px-3 border-b border-slate-400 text-white py-3 flex-col items-start gap-1 
                        transition duration-200 hover:brightness-90 hover:rounded-lg hover:bg-green-800">
                        <div class="flex justify-between w-full items-center">
                            <div class="flex items-center space-x-0">
                                <!-- Đơn ngày -->
                                <span class="bg-green-500 text-white px-6 py-1 text-sm relative">
                                    Lịch

                                </span>
                                <!-- Mũi tên -->
                                <span class="text-white pl-2 pr-7 py-1 text-sm relative" :class="{
                                    'bg-blue-500': boking.status === 0,
                                    'bg-gray-500': boking.status === 1,
                                    'bg-red-500': boking.status === 2,
                                    'bg-yellow-500': boking.status === 3
                                }">
                                    {{
                                        boking.status === 0 ? 'Đã Đặt' :
                                            boking.status === 1 ? 'Đã Khóa' :
                                                boking.status === 2 ? 'Đã hủy' :
                                                    boking.status === 3 ? 'Hủy thành công' :
                                                        'Không xác định'
                                    }}
                                    <div class="absolute left-[-14px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent"
                                        :class="{
                                            'border-r-blue-500': boking.status === 0,
                                            'border-r-gray-500': boking.status === 1,
                                            'border-r-red-500': boking.status === 2,
                                            'border-r-yellow-500': boking.status === 3
                                        }"></div>
                                </span>


                            </div>
                            <!--  -->
                             <!--  -->
                             <button
                            v-if="boking.status === 2"
                            @click="openModal(boking)"
                                class="px-4 flex text-sm items-center gap-1 font-medium py-2 rounded-lg text-white bg-red-500">
                                Hoàn tiền
                                <DocumentCurrencyDollarIcon class="w-4 h-4 text-white"></DocumentCurrencyDollarIcon>
                            </button>
                        </div>


                        <div class="flex justify-between w-full items-center">
                            <p class="font-medium text-yellow-200">
                                {{ boking.courtName }}
                            </p>

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
                                {{ formatCurrency(boking.price) }}
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

    <!--  -->
    <Modal v-if="show_modals" :close="showModal">
        <template #content>
            <div v-if="is_modal" class="w-[300px] h-[300px]">
                <VueDatePicker class="w-full h-full" v-model="store.date" :inline="true" auto-apply locale="vi"
                    :day-names="customDayNames">
                </VueDatePicker>
            </div>
            <div v-else class="w-[500px] flex flex-col px-3 ">
                <header class="flex items-center border-b border-slate-300 py-2  justify-between">
                    <p class="text-red-500 text-xl font-semibold">
                        Thông tin hoàn tiền
                    </p>
                    <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg "></XMarkIcon>
                </header>

                <body class="w-full grid py-2 gap-4 grid-cols-1">
                    <div class="flex-col col-span-1 gap-2 flex text-sm font-medium text-green-700">
                        <!-- Thông tin sân -->
                        <div class="flex gap-3 text-sm text-green-800">
                            <p>
                                Tên sân:
                            </p>
                            <p class="font-bold">
                                {{ cancel_bokings?.courtName }}
                            </p>
                        </div>
                        <!-- Thông tin sân -->
                        <div class="flex gap-3 text-sm text-green-800">
                            <p>
                                Sân con:
                            </p>
                            <p class="font-bold">
                                {{ cancel_bokings?.childCourtName }}
                            </p>
                        </div>
                        <div class="flex gap-3 text-sm text-green-800">
                            <p>
                                Địa chỉ:
                            </p>
                            <p class="font-bold">
                                {{ cancel_bokings?.courtStreet }}, {{ cancel_bokings?.courtWard }},{{
                                cancel_bokings?.courtDistrict }}, Hà Nội
                            </p>
                        </div>
                        <div class="flex gap-3 text-sm text-green-800">
                            <p>
                                Tiền đã thanh toán
                            </p>
                            <p class="font-bold">
                                {{ cancel_bokings?.price }}
                            </p>
                        </div>
                        <div class="flex gap-3 text-sm text-green-800">
                            <ExclamationCircleIcon class="w-5 h-5 text-red-500"></ExclamationCircleIcon>
                            <p>
                                Số tiền bạn cần hoàn lại là 75% số tiền gôc
                            </p>
                            <p v-if="cancel_bokings?.price" class="font-bold">
                                {{ calculate75PercentFormatted(cancel_bokings.price) }}
                            </p>
                        </div>
                    </div>
                </body>
                <!--  -->
                <footer class="w-full flex justify-between py-2 px-3 border-t border-slate-300">
                    <button @click="showModal"
                        class="px-3 py-2 bg-slate-500 text-sm font-semibold text-white rounded-lg w-fit">
                        Đóng
                    </button>

                    <button @click="cancelBokings"
                        class="px-3 py-2 bg-green-600 text-sm font-semibold text-white rounded-lg w-fit">
                        Hoàn Tiền
                    </button>
                </footer>
            </div>

        </template>
    </Modal>


</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { useRouter } from 'vue-router'

import { useAppStore } from '@/stores/appStore'
import { useAppStoreCourt } from '@/stores/appStoreCourt'


/**filter*/
import ListYardSmall from "./ListYardSmall.vue";

import FilterBokingStatus from './FilterBokingStatus.vue';

/**ảnh*/
import image9 from '@/assets/imgs/image9.png'

/**icon*/
import { ArrowLeftIcon, ExclamationCircleIcon,DocumentCurrencyDollarIcon } from "@heroicons/vue/24/solid";

import { CalendarDateRangeIcon } from "@heroicons/vue/24/solid";

/**api*/
import { apiGetListBooking,apiUpdateBoking } from "@/service/api/apiBoking";

/**kiểu dữ liệu*/
import type { CourtEvent } from '@/interface'

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**Biến router */
const router = useRouter()

const store = useAppStore()

/**Format hiển thị thứ trong tuần trên lịch*/
const customDayNames = [
    'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'
];

const is_modal = ref(true)

const show_modals = ref(false);

const store_court = useAppStoreCourt()

// Dùng computed để tự động tính toán giá trị time_selected
const time_selected = computed(() => {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(store.date);
});

/**Danh sách lịch đặt*/
const list_bokings = ref<CourtEvent[]>([])

const cancel_bokings = ref<CourtEvent>()

const filteredBookings = computed(() => {


    return list_bokings.value.filter((booking) => {
        const isSameCourt = booking.childCourtId === store_court.chill_detail?.id;

        if (!isSameCourt) return false;

        if (store.status === 5) {
            return true; // Nếu status = 5 thì lấy tất cả những gì đã lọc ở bước trên
        }

        return booking.status === store.status; // Nếu status khác 5, tiếp tục lọc theo status
    });
});







onMounted(async () => {
    await getListBoking()
    store.status = 5
})

/**hàm đóng modal*/
function showModal() {
    show_modals.value = false;
}

/***/
function selectedTime() {
    is_modal.value = true
    show_modals.value = true;
}

// Hàm chuyển đổi startTime thành ngày/tháng/năm
function formatDate(startTime: string): string {
    const date = new Date(startTime);
    return date.toLocaleDateString('vi-VN'); // Trả về định dạng ngày/tháng/năm
}


/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/detail');
}

/**Hàm lấy danh sách lịch đặt sân */
async function getListBoking() {
    try {
        const response = await apiGetListBooking();
        // Lấy thông tin người dùng từ localStorage
        const CourtId = store_court.court_detail?.courtName
        // Kiểm tra nếu API trả về thành công
        if (response && response.status === 200) {
            console.log('response', response.data);

            // Lọc những lịch thuộc sân cha này 
            const filteredData = response.data.filter((item: any) => item.courtName === CourtId);


            list_bokings.value = filteredData

            console.log('list_bokings.value', list_bokings.value);

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


/**Hoàn tiền*/
function openModal(boking: CourtEvent){
    is_modal.value = false
    show_modals.value = true;
    cancel_bokings.value = boking
}

function calculate75PercentFormatted(number: number) {
    const percentValue = number * 0.75
    return percentValue.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })
}

/**Hàm hủy lịch*/
async function cancelBokings() {
    if (cancel_bokings.value) {
        cancel_bokings.value.status = 3
    }
    try {
        const response = await apiUpdateBoking(cancel_bokings.value);
     
        if (response && response.status === 200) {
            toast("Hoàn tiền thành công!", { autoClose: 3000 });
            getListBoking()
        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}






</script>
