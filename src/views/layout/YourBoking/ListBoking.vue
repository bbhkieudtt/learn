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
            <div v-if="list_bokings && list_bokings.length === 0"
                class="w-full h-full flex justify-center items-center">
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

                            <span :class="[
                                getStatusColor(boking),
                                'text-white pl-2 pr-7 py-1 text-sm relative'
                            ]">
                                {{ getStatusText(boking) }}
                                <div class="absolute left-[-14px] top-1/2 transform -translate-y-1/2 w-0 h-0
               border-t-[15px] border-t-transparent
               border-r-[15px]
               border-b-[15px] border-b-transparent" :class="getStatusColors(boking)"></div>
                            </span>

                        </div>


                        <div class="flex justify-between w-full items-center">
                            <p class="font-medium text-yellow-200">
                                {{ boking.courtName }}
                            </p>
                            <!--  -->
                            <button @click="openModel(boking)" v-if="isMoreThanOneDayAway(boking.startTime) && boking.status != 2 && boking.status != 3 "
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
            <!-- Modal hiện chi tiêt thông tin sự kiện  -->
            <div class="w-[500px] flex flex-col px-3 ">
                <header class="flex items-center border-b border-slate-300 py-2  justify-between">
                    <p class="text-red-500 text-xl font-semibold">
                        Bạn có chắc chắn muốn hủy này sân này ?
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
                                Nếu bạn hủy lịch bạn chỉ được hoàn 75% số tiền
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
                        Hủy lịch
                    </button>
                </footer>
            </div>
        </template>
    </Modal>


</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from "@/stores/appStore";

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"


/**ảnh*/
import image9 from '@/assets/imgs/image9.png'

/**icon*/
import { ArrowLeftIcon, ArchiveBoxXMarkIcon, ExclamationCircleIcon } from "@heroicons/vue/24/solid";

/**api*/
import { apiGetListBooking, apiUpdateBoking } from "@/service/api/apiBoking";

/**kiểu dữ liệu*/
import type { CourtEvent } from '@/interface'


/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**Biến router */
const router = useRouter()

const show_modals = ref(false);

/**hàm đóng modal*/
function showModal() {
    show_modals.value = false;
}


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

const cancel_bokings = ref<CourtEvent>()


onMounted(async () => {
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

/**Hàm kiểm tra thời gian của lịch đặt cách hôm này nhiều hơn hay ít hơn 1 nagyf*/
function isMoreThanOneDayAway(timeStr: string) {
    const inputTime = new Date(timeStr)
    const now = new Date()
    const diffMs = inputTime.getTime() - now.getTime()
    const oneDayMs = 24 * 60 * 60 * 1000
    return diffMs > oneDayMs
}


function getStatusText(booking: CourtEvent) {
    if (booking.status === 2) return 'Đã hủy'
    if (booking.status === 3) return 'Hủy thành công'
    const startTime = new Date(booking.startTime)
    const now = new Date()
    return startTime <= now ? 'Đã hoàn thành' : 'Lịch sắp tới'
}

function getStatusColor(booking: CourtEvent) {
    if (booking.status === 2) return 'bg-red-500 '
     if (booking.status === 3) return 'bg-red-500 '
    const startTime = new Date(booking.startTime)
    const now = new Date()
    return startTime <= now ? 'bg-blue-500 ' : 'bg-yellow-500 '
}

function getStatusColors(booking: CourtEvent) {
    if (booking.status === 2) return 'border-r-red-500 '
     if (booking.status === 3) return 'border-r-red-500 '
    const startTime = new Date(booking.startTime)
    const now = new Date()
    return startTime <= now ? 'border-r-blue-500 ' : 'border-r-yellow-500 '
}

function openModel(boking: CourtEvent) {

    cancel_bokings.value = boking



    //*Mở modal
    show_modals.value = true;
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
        cancel_bokings.value.status = 2
    }
    try {
        const response = await apiUpdateBoking(cancel_bokings.value);
     
        if (response && response.status === 200) {
            toast("Hủy lịch thành công!", { autoClose: 3000 });
            getListBoking()
        } else {
            toast("Đăng ký thất bại, vui lòng thử lại!", { autoClose: 5000 });
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}






</script>
