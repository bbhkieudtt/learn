<template>
    <div class="h-dvh w-dvw bg-green flex flex-col overflow-hidden pt-5 px-5 pb-2">
        <header>
            <img @click="goHome" :src="logoPick" alt="Logo" class="w-10 h-10 rounded-full">

            <!-- Row 2 -->
            <div class="grid grid-cols-3 gap-3">
                <!-- Filter Button -->
                <div class="flex cursor-pointer gap-2 button rounded-md">
                    <FilterBokingStatus></FilterBokingStatus>
                </div>
              
                <!-- Search Input by Court Name -->
                <div class="relative">
                    <input v-model="searchCourtName" placeholder="Tìm kiếm theo tên sân"
                           class="w-full pl-10 pr-3 py-2 bg-green-100 text-green-800 border border-green-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                           type="text" />
                    <!-- Search Icon -->
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div class="flex items-center button justify-between bg-green-600 bg-opacity-30 rounded-md p-3 hover:bg-opacity-50 transition-all duration-200">
                    <input
                        v-model="phoneNumber"
                        type="tel"
                        inputmode="numeric"
                        placeholder="Nhập số điện thoại của lịch đặt"
                        class="w-full bg-transparent  text-white text-sm outline-none placeholder-white/70"
                        @input="validatePhoneNumber"
                    />
                </div>
            </div>
        </header>
        <!-- Main Content -->
        <main class="h-full py-5 flex-1 w-full overflow-hidden">
            <!-- No Bookings -->
            <div v-if="list_bokings && list_bokings.length === 0"
                 class="w-full h-full flex justify-center items-center">
                <div class="flex-col">
                    <img :src="image9" class="justify-center items-center" alt="">
                    <p class="text-lg text-white font-semibold text-center">Sân chưa có lịch đặt</p>
                </div>
            </div>
            <!-- Bookings List -->
            <div v-else class="w-full h-full flex justify-center overflow-y-auto items-center px-5">
                <div class="h-full overflow-y-auto flex flex-col items-start w-full gap-15">
                    <!-- Booking Item -->
                    <div v-for="(boking, index) in filteredBookings" :key="boking.id"
                         :class="{ 'border-b border-yellow-500': index !== filteredBookings.length - 1 }"
                         class="flex w-full text-lg px-3 border-b border-slate-400 text-white py-3 flex-col items-start gap-1 
                         transition duration-200 hover:brightness-90 hover:rounded-lg hover:bg-green-800">
                        <div class="flex justify-between w-full items-center">
                            <div class="flex items-center space-x-0">
                                <!-- Booking Label -->
                                <span class="bg-purple-500 text-white px-6 py-1 text-sm relative">
                                {{ boking.type === 0 ? 'Lịch ngày' : boking.type === 1 ? 'Lịch tuần' : boking.type === 2
                                ? 'Lịch tháng' : 'Lịch năm' }}
                            </span>

                                <!-- Status Label -->
                                <span class="text-white pl-2 pr-7 py-1 text-sm relative" :class="{
                                    'bg-blue-500': boking.status === 2,
                                    'bg-slate-500': boking.status === 3,
                                    'bg-red-500': boking.status === 4,
                                    'bg-yellow-500': boking.status === 1
                                }">
                                    {{
                                        boking.status === 1 ? 'Chưa thanh toán' :
                                        boking.status === 2 ? 'Đã thanh toán' :
                                        boking.status === 3 ? 'Đã hủy' :
                                        boking.status === 4 ? 'Hủy thành công' :
                                        'Không xác định'
                                    }}
                                    <div class="absolute left-[-14px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent"
                                         :class="{
                                             'border-r-blue-500': boking.status === 2,
                                             'border-r-slate-500': boking.status === 3,
                                             'border-r-red-500': boking.status === 4,
                                             'border-r-yellow-500': boking.status === 1
                                         }"></div>
                                </span>
                            </div>
                            <!-- Refund Button -->
                            <button v-if="boking.status === 3" @click="openModal(boking)"
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
                            <p>Chi tiết:</p>
                            <p class="font-medium">{{ boking.childCourtName }}:</p>
                            <p class="font-medium border-r border-white pr-2">{{ formatDate(boking.startTime) }}</p>
                            <p class="font-medium">{{ formatTime(boking.startTime) }} - {{ formatTime(boking.endTime) }}</p>
                        </div>
                        <div class="flex gap-1 items-center">
                            <p>Số lượng:</p>
                            <p class="font-medium">{{ boking.quantity }}:</p>
                           
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

        <!-- Modal -->
        <Modal v-if="show_modals" :close="showModal">
            <template #content>
                <div v-if="is_modal" class="w-[300px] h-[300px]">
                    <VueDatePicker class="w-full h-full" v-model="store.date" :inline="true" auto-apply locale="vi"
                                   :day-names="customDayNames">
                    </VueDatePicker>
                </div>
                <div v-else class="w-[500px] flex flex-col px-3">
                    <header class="flex items-center border-b border-slate-300 py-2 justify-between">
                        <p class="text-red-500 text-xl font-semibold">Thông tin hoàn tiền</p>
                        <XMarkIcon @click="showModal" class="h-5 w-5 hover:bg-slate-300 rounded-lg"></XMarkIcon>
                    </header>
                    <body class="w-full grid py-2 gap-4 grid-cols-1">
                        <div class="flex-col col-span-1 gap-2 flex text-sm font-medium text-green-700">
                            <div class="flex gap-3 text-sm text-green-800">
                                <p>Tên sân:</p>
                                <p class="font-bold">{{ cancel_bokings?.courtName }}</p>
                            </div>
                            <div class="flex gap-3 text-sm text-green-800">
                                <p>Thông tin người đặt:</p>
                                <p class="font-bold">{{ cancel_bokings?.userFullName }}, {{ cancel_bokings?.userPhoneNumber }}</p>
                            </div>
                            <div class="flex gap-3 text-sm text-green-800">
                                <p>Tiền đã thanh toán:</p>
                                <p class="font-bold">{{  formatCurrency(cancel_bokings?.price ?? 0) }}</p>
                            </div>
                            <div class="flex gap-3 text-sm text-green-800">
                                <ExclamationCircleIcon class="w-5 h-5 text-red-500"></ExclamationCircleIcon>
                                <p>Số tiền bạn cần hoàn lại là 75% số tiền gốc:</p>
                                <p class="font-bold">{{ calculate75PercentFormatted(cancel_bokings?.price) }}</p>
                            </div>
                            <div class="flex gap-3 text-sm text-green-800">
                                <ExclamationCircleIcon class="w-5 h-5 text-red-500"></ExclamationCircleIcon>
                                <p>Hãy liên lạc với người đặt để hoàn tiền!</p>
                            </div>
                        </div>
                    </body>
                    <footer class="w-full flex justify-between py-2 px-3 border-t border-slate-300">
                        <button @click="showModal"
                                class="px-3 py-2 bg-slate-500 text-sm font-semibold text-white rounded-lg w-fit">
                            Đóng
                        </button>
                        <button @click="refundBokings"
                                class="px-3 py-2 bg-green-600 text-sm font-semibold text-white rounded-lg w-fit">
                            Hoàn Tiền
                        </button>
                    </footer>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { useAppStoreCourt } from '@/stores/appStoreCourt';
import FilterBokingStatus from './FilterBokingStatus.vue';
import image9 from '@/assets/imgs/image9.png';
import { ExclamationCircleIcon, DocumentCurrencyDollarIcon } from '@heroicons/vue/24/solid';
import { apiGetListBooking, apiUpdateBoking } from '@/service/api/apiBoking';
import type { CourtEvent } from '@/interface';
import logoPick from '@/assets/imgs/logoPick.png';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Modal from '@/components/Modal/Modal.vue';

// Router
const router = useRouter();

// Stores
const store = useAppStore();
const store_court = useAppStoreCourt();

// Reactive variables
const is_modal = ref(true);
const show_modals = ref(false);
const list_bokings = ref<CourtEvent[]>([]);
const cancel_bokings = ref<CourtEvent>();
const searchCourtName = ref('');

// Format day names for calendar
const customDayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// Computed time_selected
const time_selected = computed(() => {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(store.date);
});

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

// Filtered bookings
const filteredBookings = computed(() => {
    const filtered = list_bokings.value.filter((booking) => {
        // Ensure courtName exists and is a string
        const courtName = booking.courtName && typeof booking.courtName === 'string' 
            ? booking.courtName.toLowerCase() 
            : '';

        // Filter by court name (case-insensitive, partial match)
        const matchesCourtName = searchCourtName.value
            ? courtName.includes(searchCourtName.value.toLowerCase())
            : true;

            // Filter by phone number if phoneNumber is not empty
    const matchesPhoneNumber =
      phoneNumber.value === '' ||
      booking.userPhoneNumber.includes(phoneNumber.value);

    if (!matchesPhoneNumber) return false;

        // Log each booking's courtName and match result
        console.log(`Booking ID: ${booking.id}, courtName: ${courtName}, matches: ${matchesCourtName}`);

        // If status is 5, return bookings that match courtName
        if (store.status === 5) {
            return matchesCourtName;
        }

        // Otherwise, filter by both status and courtName
        return booking.status === store.status && matchesCourtName;
    });

    console.log('filteredBookings:', filtered); // Debug: Log filtered results
    return filtered;
});

// Watch searchCourtName for changes
watch(searchCourtName, (newValue) => {
    console.log('searchCourtName changed:', newValue); // Debug: Confirm input changes
});

// Fetch bookings on mount
onMounted(async () => {
    await getListBoking();
    store.status = 3; // Set default status to show all bookings
});

// Close modal
function showModal() {
    show_modals.value = false;
}

// Open date picker modal
function selectedTime() {
    is_modal.value = true;
    show_modals.value = true;
}

// Format date
function formatDate(startTime: string): string {
    const date = new Date(startTime);
    return date.toLocaleDateString('vi-VN');
}

// Navigate to home
function goHome() {
    router.push('/main');
}

// Fetch bookings
async function getListBoking() {
    try {
        const response = await apiGetListBooking();
        if (response && response.status === 200) {
            console.log('API Response:', response.data); // Debug: Log API response
            list_bokings.value = response.data; // Assign data to reactive ref
        } else {
            toast('Lấy danh sách lịch đặt thất bại!', { autoClose: 5000 });
        }
    } catch (error) {
        console.error('API Error:', error);
        toast('Đã xảy ra lỗi khi lấy danh sách lịch đặt!', { autoClose: 5000 });
    }
}

// Format time
function formatTime(startTime: string): string {
    const date = new Date(startTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Format currency
function formatCurrency(amount: number): string {
    return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
}

// Open refund modal
function openModal(boking: CourtEvent) {
    is_modal.value = false;
    show_modals.value = true;
    cancel_bokings.value = boking;
}

// Calculate 75% refund
function calculate75PercentFormatted(number: number | undefined) {
    if (number === undefined) return '0 đ';
    const percentValue = number * 0.75;
    return percentValue.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
}

// Refund booking
async function refundBokings() {
    if (cancel_bokings.value) {
        cancel_bokings.value.status = 4;
        try {
            const response = await apiUpdateBoking(cancel_bokings.value);
            if (response && response.status === 200) {
                toast('Hoàn tiền thành công!', { autoClose: 3000 });
                await getListBoking();
                showModal();
            } else {
                toast('Hoàn tiền thất bại, vui lòng thử lại!', { autoClose: 5000 });
            }
        } catch (error) {
            console.error('API Error:', error);
            toast('Đã xảy ra lỗi khi hoàn tiền!', { autoClose: 5000 });
        }
    }
}
</script>