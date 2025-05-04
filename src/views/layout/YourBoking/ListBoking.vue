<template>
    <div class="h-dvh w-dvw bg-green flex flex-col overflow-hidden pt-5 px-5 pb-2">
        <header class="flex items-center justify-between mb-6 fixed top-0 left-0 w-full bg-green p-5 z-10">
            <img @click="goHome" :src="logoPick" alt="Logo" class="w-12 h-12 rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform">
            <nav class="flex w-full max-w-3xl mx-auto gap-2">
                <div @click="clickMenu(menu.key)" v-for="menu in menu_list" :key="menu.key"
                    :class="{ 'bg-yellow-400 text-green-900': menu.active, 'text-white hover:bg-green-700': !menu.active }"
                    class="flex-1 text-center py-3 rounded-lg cursor-pointer font-semibold text-sm transition-colors duration-200">
                    {{ menu.name_menu }}
                </div>
            </nav>
        </header>
        <main class="flex-1 w-full overflow-hidden mt-24">
            <!-- No bookings -->
            <div v-if="list_bookings && list_bookings.length === 0"
                class="w-full h-full flex justify-center items-center">
                <div class="flex flex-col items-center gap-4">
                    <img :src="image9" class="w-32 h-32" alt="No bookings">
                    <p class="text-xl text-white font-medium text-center">Bạn chưa có lịch đặt nào</p>
                </div>
            </div>
            <!-- Bookings available -->
            <div v-else class="w-full h-full overflow-y-auto px-4">
                <div class="max-w-5xl mx-auto flex flex-col gap-6 pt-4">
                    <!-- Booking item -->
                    <div @click="openBooking(boking)" v-for="(boking, index) in list_bookings" :key="boking.id"
                        class="bg-white bg-opacity-10 backdrop-blur-lg cursor-pointer rounded-xl p-5 text-white shadow-lg 
                        transition-transform duration-200 hover:scale-[1.02] hover:bg-opacity-20">
                        <div class="flex items-center gap-4 mb-4">
                            <!-- Booking type label -->
                            <span class="bg-purple-600 text-white px-4 py-2 text-sm font-medium rounded-full">
                                {{ boking.type === 0 ? 'Lịch ngày' : boking.type === 1 ? 'Lịch tuần' : boking.type === 2 ? 'Lịch tháng' : 'Lịch năm' }}
                            </span>
                            <!-- Status label -->
                            <span :class="[getStatusColor(boking), 'text-white px-4 py-2 text-sm font-medium rounded-full']">
                                {{ getStatusText(boking) }}
                            </span>
                        </div>
                        <div class="flex justify-between items-center mb-3">
                            <p class="font-semibold text-yellow-300 text-lg">{{ boking.courtName }}</p>
                            <div class="flex gap-2">
                                <!-- Cancel button -->
                                <button @click="openModel(boking)"
                                    v-if="isMoreThanOneDayAway(boking.startTime) && boking.status === 2"
                                    class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-full flex items-center gap-2 hover:bg-red-700 transition-colors">
                                    Hủy lịch
                                    <ArchiveBoxXMarkIcon class="w-4 h-4"></ArchiveBoxXMarkIcon>
                                </button>
                                <!-- Comment/Report button -->
                                <button v-if="boking.status === 2 && getStatusText(boking) === 'Đã hoàn thành'"
                                    @click="commentReportCourt(boking)"
                                    class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                                    Bình luận/Báo cáo
                                    <ChatBubbleLeftIcon class="w-4 h-4"></ChatBubbleLeftIcon>
                                </button>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-2 text-sm">
                            <div class="flex gap-2 items-center">
                                <p class="text-gray-300">Chi tiết:</p>
                                <p class="font-medium">{{ boking.childCourtName }}</p>
                                <p class="font-medium border-r border-gray-400 pr-2">{{ formatDate(boking.startTime) }}</p>
                                <p class="font-medium">{{ formatTime(boking.startTime) }} - {{ formatTime(boking.endTime) }}</p>
                            </div>
                            <div class="flex gap-2 items-center">
                                <p class="text-gray-300">Thanh toán:</p>
                                <p class="font-medium">{{ formatCurrency(boking.price) }}</p>
                            </div>
                            <div class="flex gap-2 items-center">
                                <p class="text-gray-300">Địa chỉ:</p>
                                <p class="font-medium">{{ boking.courtStreet }}, {{ boking.courtWard }}, {{ boking.courtDistrict }}, Hà Nội</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <!-- Modal for cancellation -->
    <Modal v-if="show_modals" :close="showModal">
        <template #content>
            <div class="w-full max-w-md bg-white rounded-xl p-6 shadow-2xl">
                <header class="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <p class="text-red-600 text-xl font-semibold">Bạn có chắc chắn muốn hủy sân này?</p>
                    <XMarkIcon @click="showModal" class="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"></XMarkIcon>
                </header>
                <div class="space-y-4 text-sm text-gray-700">
                    <div class="flex gap-3">
                        <p class="font-medium">Tên sân:</p>
                        <p class="font-semibold">{{ cancel_bokings?.courtName }}</p>
                    </div>
                    <div class="flex gap-3">
                        <p class="font-medium">Sân con:</p>
                        <p class="font-semibold">{{ cancel_bokings?.childCourtName }}</p>
                    </div>
                    <div class="flex gap-3">
                        <p class="font-medium">Địa chỉ:</p>
                        <p class="font-semibold">{{ cancel_bokings?.courtStreet }}, {{ cancel_bokings?.courtWard }}, {{ cancel_bokings?.courtDistrict }}, Hà Nội</p>
                    </div>
                    <div class="flex gap-3">
                        <p class="font-medium">Tiền đã thanh toán:</p>
                        <p class="font-semibold">{{ formatCurrency(cancel_bokings?.price || 0) }}</p>
                    </div>
                    <div class="flex gap-3 items-center">
                        <ExclamationCircleIcon class="w-5 h-5 text-red-500"></ExclamationCircleIcon>
                        <p>Nếu bạn hủy lịch bạn chỉ được hoàn 75% số tiền</p>
                        <p v-if="cancel_bokings?.price" class="font-semibold">{{ calculate75PercentFormatted(cancel_bokings.price) }}</p>
                    </div>
                    <div class="flex gap-3 items-center">
                        <ExclamationCircleIcon class="w-5 h-5 text-red-500"></ExclamationCircleIcon>
                        <p>Chủ sân sẽ liên lạc với bạn để hoàn lại tiền!</p>
                    </div>
                </div>
                <footer class="flex justify-between pt-4 mt-4 border-t border-gray-200">
                    <button @click="showModal" class="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-full hover:bg-gray-600 transition-colors">Đóng</button>
                    <button @click="cancelBokings" class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors">Hủy lịch</button>
                </footer>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStoreCourt } from "@/stores/appStoreCourt";
import logoPick from "@/assets/imgs/logoPick.png"

/**Modal*/
import Modal from "@/components/Modal/Modal.vue"

/**Icons*/
import { ArchiveBoxXMarkIcon, ExclamationCircleIcon, XMarkIcon, ChatBubbleLeftIcon } from "@heroicons/vue/24/solid";

/**Images*/
import image9 from '@/assets/imgs/image9.png'

/**API*/
import { apiGetListBooking, apiUpdateBoking } from "@/service/api/apiBoking";

/**Types*/
import type { CourtEvent } from '@/interface'

/**Toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

/**Biến store*/
const store_court = useAppStoreCourt() 

/**Danh sách lịch đặt*/
const list_bokings = ref<CourtEvent[]>([])

//* Biến lọc danh sách lịch
const statusList = ref(1)

/**Biến router */
const router = useRouter()

const show_modals = ref(false);

/**Hàm đóng modal*/
function showModal() {
    show_modals.value = false;
}

/**Danh sách menu*/
const menu_list = ref([
    { key: 1, name_menu: 'Lịch đặt của bạn', active: true },
    { key: 2, name_menu: 'Lịch hoàn thành', active: false },
    { key: 4, name_menu: 'Lịch sắp tới', active: false },
    { key: 5, name_menu: 'Lịch đã bị hủy', active: false }
])

const cancel_bokings = ref<CourtEvent>()

onMounted(async () => {
    await getListBoking()
})

const list_bookings = computed(() => {
    return list_bokings.value.filter((booking) => {
        const statusText = getStatusText(booking)
        switch (statusList.value) {
            case 1: return true
            case 2: return statusText === 'Đã hoàn thành'
            case 4: return statusText === 'Lịch sắp tới'
            case 5: return statusText === 'Đã hủy' || statusText === 'Hủy thành công'
            default: return false
        }
    })
})

/**Hàm chuyển đổi startTime thành ngày/tháng/năm*/
function formatDate(startTime: string): string {
    const date = new Date(startTime);
    return date.toLocaleDateString('vi-VN');
}

/**Bấm chọn danh sách*/
function clickMenu(key: number) {
    statusList.value = key
    menu_list.value.forEach((item) => {
        item.active = false
        if (item.key === key) item.active = true
    });
}

/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/main');
}

/**Hàm lấy danh sách lịch đặt sân*/
async function getListBoking() {
    try {
        const response = await apiGetListBooking();
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
        if (response && response.status === 200) {
            const filteredData = response.data.filter((item: any) => item.userId === userInfo.id && item.status !== 1);
            list_bokings.value = filteredData
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

/**Hàm chuyển đổi startTime thành giờ:phút*/
function formatTime(startTime: string): string {
    const date = new Date(startTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**Hàm chuyển đổi số thành định dạng tiền tệ*/
function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

/**Hàm kiểm tra thời gian của lịch đặt*/
function isMoreThanOneDayAway(timeStr: string) {
    const inputTime = new Date(timeStr)
    const now = new Date()
    const diffMs = inputTime.getTime() - now.getTime()
    const oneDayMs = 24 * 60 * 60 * 1000
    return diffMs > oneDayMs
}

/**Hàm lấy trạng thái văn bản*/
function getStatusText(booking: CourtEvent) {
    if (booking.status === 3) return 'Đã hủy'
    if (booking.status === 4) return 'Hủy thành công'
    if (booking.status === 2) {
        const startTime = new Date(booking.startTime)
        const now = new Date()
        return startTime <= now ? 'Đã hoàn thành' : 'Lịch sắp tới'
    }
    const startTime = new Date(booking.startTime)
    const now = new Date()
    return startTime <= now ? 'Đã hoàn thành' : 'Lịch sắp tới'
}

/**Hàm lấy màu trạng thái*/
function getStatusColor(booking: CourtEvent) {
    if (booking.status === 3) return 'bg-red-600'
    if (booking.status === 4) return 'bg-red-600'
    if (booking.status === 1) {
        const startTime = new Date(booking.startTime)
        const now = new Date()
        return startTime < now ? 'bg-gray-500' : 'bg-yellow-600'
    }
    if (booking.status === 2) {
        const startTime = new Date(booking.startTime)
        const now = new Date()
        return startTime <= now ? 'bg-blue-600' : 'bg-green-600'
    }
    const startTime = new Date(booking.startTime)
    const now = new Date()
    return startTime <= now ? 'bg-blue-600' : 'bg-green-600'
}


/**Hàm mở modal hủy lịch*/
function openModel(boking: CourtEvent) {
    cancel_bokings.value = boking
    show_modals.value = true;
}

/**Hàm tính 75% số tiền*/
function calculate75PercentFormatted(number: number) {
    const percentValue = number * 0.75
    return percentValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

/**Hàm hủy lịch*/
async function cancelBokings() {
    if (cancel_bokings.value) {
        cancel_bokings.value.status = 3
        try {
            const response = await apiUpdateBoking(cancel_bokings.value);
            if (response && response.status === 200) {
                toast("Hủy lịch thành công!", { autoClose: 3000 });
                getListBoking()
                showModal()
            } else {
                toast("Hủy lịch thất bại, vui lòng thử lại!", { autoClose: 5000 });
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    }
}

/**Hàm xử lý bình luận/báo cáo sân*/
function commentReportCourt(boking: CourtEvent) {
  if (store_court?.list_court) {
    const court = store_court.list_court.find(
      (item) => item.id === boking.courtId
    );
    if (court) {
      store_court.court_detail = court;
      router.push('/Info')
    }
  }
}

/**mở ra lịch đặt của sân*/ 
function openBooking(boking :CourtEvent ){
    if (store_court?.list_court) {
    const court = store_court.list_court.find(
      (item) => item.id === boking.courtId
    );
    if (court) {
      store_court.court_detail = court;
      router.push('/detail')
    }
  }
}
</script>