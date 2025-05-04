<template>
    <div class="h-dvh w-dvw bg-green flex flex-col overflow-hidden pt-2 px-5 pb-2">
        <header class="flex flex-col gap-1">
            <img @click="goHome" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">

            <!-- Hàng 2 -->
            <div class="grid grid-cols-3 gap-3">
                <div class="flex cursor-pointer gap-2 button rounded-md">
                    <ListYardSmall></ListYardSmall>
                </div>
                <div class="flex cursor-pointer gap-2 button rounded-md">
                    <FilterBokingStatus></FilterBokingStatus>
                </div>
                <div class="flex items-center button justify-between bg-green-600 bg-opacity-30 rounded-md p-3 hover:bg-opacity-50 transition-all duration-200">
                    <input
                        v-model="phoneNumber"
                        type="tel"
                        inputmode="numeric"
                        placeholder="Nhập số điện thoại của lịch đặt"
                        class="w-full bg-transparent text-white text-sm outline-none placeholder-white/70"
                        @input="validatePhoneNumber"
                    />
                </div>
            </div>
        </header>
        <!--  -->
        <main class="h-full py-5 flex-1 w-full overflow-hidden">
            <!-- Chưa có lịch đặt sân -->
            <div v-if="list_bokings.length === 0 || filteredBookings.length === 0"
                class="w-full h-full flex justify-center items-center">
                <div class="flex flex-col items-center gap-3">
                    <CalendarIcon class="w-12 h-12 text-white" />
                    <p class="text-lg text-white font-semibold text-center">Sân chưa có lịch đặt!</p>
                </div>
            </div>
            <!-- Đã có lịch đặt -->
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5">
                <div class="h-full overflow-y-auto flex flex-col items-start w-full gap-15">
                    <!-- sân -->
                    <div v-for="(boking, index) in filteredBookings" :key="boking.id"
                        :class="{ 'border-b border-yellow-500': index !== filteredBookings.length - 1 }" 
                        class="flex w-full text-lg px-3 border-b border-slate-400 text-white py-3 flex-col items-start gap-1 
                        transition duration-200 hover:brightness-90 hover:rounded-lg hover:bg-green-800">
                        <div class="flex justify-between w-full items-center">
                            <div class="flex items-center space-x-0">
                                <!-- Đơn ngày -->
                                <span class="bg-green-500 text-white px-6 py-1 text-sm relative">
                                    Lịch
                                </span>
                                <!-- Trạng thái -->
                                <span class="text-white pl-2 pr-7 py-1 text-sm relative" :class="{
                                    'bg-blue-500': boking.status === 2 && new Date(boking.startTime) > new Date(),
                                    'bg-green-600': (boking.status === 2 && new Date(boking.startTime) <= new Date()) || boking.status === 5,
                                    'bg-red-500': boking.status === 3 || boking.status === 4
                                }">
                                    {{
                                        boking.status === 2 && new Date(boking.startTime) > new Date() ? 'Lịch sắp tới' :
                                        (boking.status === 2 && new Date(boking.startTime) <= new Date()) || boking.status === 5 ? 'Lịch hoàn thành' :
                                        boking.status === 3 || boking.status === 4 ? 'Lịch đã bị hủy' :
                                        'Không xác định'
                                    }}
                                    <div class="absolute left-[-14px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent"
                                        :class="{
                                            'border-r-blue-500': boking.status === 2 && new Date(boking.startTime) > new Date(),
                                            'border-r-green-600': (boking.status === 2 && new Date(boking.startTime) <= new Date()) || boking.status === 5,
                                            'border-r-red-500': boking.status === 3 || boking.status === 4
                                        }"></div>
                                </span>
                            </div>
                        </div>

                        <div class="flex justify-between w-full items-center">
                            <p class="font-medium text-yellow-200">
                                {{ boking.courtName }}
                            </p>
                        </div>

                        <div class="flex gap-1 items-center">
                            <p>Chi tiết:</p>
                            <p class="font-medium">{{ boking.childCourtName }}:</p>
                            <p class="font-medium border-r border-white pr-2">{{ formatDate(boking.startTime) }}</p>
                            <p class="font-medium">{{ formatTime(boking.startTime) }} - {{ formatTime(boking.endTime) }}</p>
                        </div>
                        <div class="flex gap-1 items-center">
                            <p>Thông tin người đặt:</p>
                            <p class="font-medium">{{ boking.userFullName }}</p>
                            <p class="font-medium">{{ boking.userPhoneNumber }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p class="flex-shrink-0">Thanh toán:</p>
                            <p class="font-medium">{{ formatCurrency(boking.price) }}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <p class="flex-shrink-0">Địa chỉ:</p>
                            <p class="font-medium">{{ boking.courtStreet }}, {{ boking.courtWard }}, {{ boking.courtDistrict }}, Hà Nội</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, computed,ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { useAppStoreCourt } from '@/stores/appStoreCourt';

/**filter*/
import ListYardSmall from "./ListYardSmall.vue";
import FilterBokingStatus from './FilterBokingStatus.vue';

/**ảnh*/
import image9 from '@/assets/imgs/image9.png';
import logoPick from '@/assets/imgs/logoPick.png';

/**icon*/
import { CalendarIcon } from '@heroicons/vue/24/solid';

/**api*/
import { apiGetListBooking } from "@/service/api/apiBoking";

/**kiểu dữ liệu*/
import type { CourtEvent } from '@/interface';

/**toast*/
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();
const store = useAppStore();
const store_court = useAppStoreCourt();

// Biến để lưu số điện thoại
const phoneNumber = ref('');

// Hàm kiểm tra số điện thoại
const validatePhoneNumber = (event: Event) => {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, ''); // Chỉ cho phép số
    phoneNumber.value = input.value;
    if (input.value.length > 11) {
        input.value = input.value.slice(0, 11); // Giới hạn 11 số
        phoneNumber.value = input.value;
    }
};

/**Danh sách lịch đặt*/
const list_bokings = shallowRef<CourtEvent[]>([]);

const filteredBookings = computed(() => {
    return list_bokings.value.filter((booking) => {
        // Kiểm tra dữ liệu hợp lệ
        if (!booking || 
            booking.status === undefined || 
            !booking.startTime || 
            !booking.id || 
            !booking.childCourtId) {
            return false;
        }

        // Không hiển thị lịch có status = 1
        if (booking.status === 1) return false;

        // Kiểm tra sân phù hợp
        const isSameCourt = booking.childCourtId === store_court.chill_detail?.id;
        if (!isSameCourt) return false;

        // Lọc theo số điện thoại nếu phoneNumber không rỗng
        const matchesPhoneNumber =
            phoneNumber.value === '' ||
            (booking.userPhoneNumber && booking.userPhoneNumber.includes(phoneNumber.value));
        if (!matchesPhoneNumber) return false;

        const now = new Date();

        // Lọc theo store.status
        if (store.status === 1) {
            // Lịch có status = 2 và startTime chưa tới
            return booking.status === 2 && new Date(booking.startTime) > now;
        } else if (store.status === 2) {
            // Lịch có status = 2 và startTime đã qua, hoặc status = 5
            return (booking.status === 2 && new Date(booking.startTime) <= now) || booking.status === 5;
        } else if (store.status === 3) {
            // Lịch có status = 3 hoặc 4
            return booking.status === 3 || booking.status === 4;
        } else if (store.status === 5) {
            // Hiển thị tất cả lịch phù hợp (trừ status = 1)
            return true;
        }

        // Nếu store.status không khớp, chỉ trả về lịch có status tương ứng
        return booking.status === store.status;
    });
});

onMounted(async () => {
    await getListBoking();
    store.status = 5;
});

/**Hàm trở về trang chủ*/
function goHome() {
    router.push('/detail');
}

/**Hàm lấy danh sách lịch đặt sân */
async function getListBoking() {
    try {
        const response = await apiGetListBooking();
        const CourtId = store_court.court_detail?.courtName;
        if (response && response.status === 200) {
            console.log('response', response.data);
            const filteredData = response.data.filter((item: any) => 
                item && 
                item.courtName === CourtId && 
                item.status !== 1 && 
                item.status !== 0 && 
                item.startTime && 
                item.childCourtId && 
                item.id
            );
            list_bokings.value = filteredData;
            console.log('list_bokings.value', list_bokings.value);
        } else {
            toast("Lấy danh sách lịch đặt thất bại!", { autoClose: 5000 });
        }
    } catch (error) {
        console.error("API Error:", error);
        toast("Có lỗi khi lấy danh sách lịch đặt!", { autoClose: 5000 });
    }
}

// Hàm chuyển đổi startTime thành ngày/tháng/năm
function formatDate(startTime: string): string {
    const date = new Date(startTime);
    return date.toLocaleDateString('vi-VN');
}

// Hàm chuyển đổi startTime thành giờ:phút
function formatTime(startTime: string): string {
    const date = new Date(startTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Hàm chuyển đổi số thành định dạng tiền tệ
function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
}
</script>

<style lang="scss" scoped>
.bg-green {
    background-color: #065f46; /* bg-green-800 */
}
</style>