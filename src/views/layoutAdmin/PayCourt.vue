<template>
    <div class="px-4 py-8 bg-gray-100 min-h-screen">
        <div class="flex items-center mb-8">
            <button 
                class="bg-green-800 text-white px-4 py-2 rounded-full hover:bg-green-900 transition duration-300 flex items-center shadow-md"
                @click="goBack"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Quay lại
            </button>
            <h2 class="text-3xl font-bold text-green-800 ml-6">Tổng hợp doanh thu sân</h2>
        </div>
        <div class="bg-white shadow-2xl rounded-xl overflow-hidden">
            <table class="w-full border-separate border-spacing-0">
                <thead class="bg-green-800 text-white">
                    <tr>
                        <th class="py-4 px-6 text-left text-sm font-semibold rounded-tl-xl">Tên sân</th>
                        <th class="py-4 px-6 text-left text-sm font-semibold">Tổng doanh thu</th>
                        <th class="py-4 px-6 text-left text-sm font-semibold">Số tiền thanh toán (95%)</th>
                        <th class="py-4 px-6 text-left text-sm font-semibold">Tiền đã thanh toán</th>
                        <th class="py-4 px-6 text-left text-sm font-semibold rounded-tr-xl">Hành động</th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr v-for="court in filteredCourts" :key="court.id" class="hover:bg-green-50 transition duration-200">
                        <td class="py-4 px-6 text-sm text-gray-800">{{ court.courtName }}</td>
                        <td class="py-4 px-6 text-sm text-gray-800">{{ formatCurrency(court.totalRevenue) }}</td>
                        <td class="py-4 px-6 text-sm text-gray-800">{{ formatCurrency(court.paymentAmount) }}</td>
                        <td class="py-4 px-6 text-sm text-gray-800">{{ formatCurrency(court.paidAmount) }}</td>
                        <td class="py-4 px-6 text-sm">
                            <button 
                                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                                @click="showBookingDetails(court.id)"
                            >
                                Thanh toán
                            </button>
                        </td>
                    </tr>
                    <tr v-if="!filteredCourts.length">
                        <td colspan="5" class="py-6 px-6 text-sm text-center text-gray-500">Không có sân nào có lịch đặt đã hoàn thành</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal hiển thị chi tiết lịch đặt -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-green-800">Chi tiết lịch đặt sân {{ selectedCourtName }}</h3>
                    <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <!-- Thông tin tài khoản chủ sân -->
                <div class="mb-6 p-4 bg-green-50 rounded-lg">
                    <h4 class="text-lg font-semibold text-green-800 mb-2">Thông tin tài khoản chủ sân</h4>
                    <p class="text-sm text-gray-800"><strong>Số tài khoản:</strong> {{ ownerBankInfo.bankNumber || 'Chưa cung cấp' }}</p>
                    <p class="text-sm text-gray-800"><strong>Ngân hàng:</strong> {{ ownerBankInfo.bankName || 'Chưa cung cấp' }}</p>
                    <p class="text-sm text-gray-800"><strong>Chủ tài khoản:</strong> {{ ownerBankInfo.bankAccount || 'Chưa cung cấp' }}</p>
                </div>
                <table class="w-full border-separate border-spacing-0">
                    <thead class="bg-green-100">
                        <tr>
                            <th class="py-3 px-4 text-left text-sm font-semibold">Thời gian bắt đầu</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold">Thời gian kết thúc</th>
                            <th class="py-3 px-4 text-left text-sm font-semibold">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="booking in selectedBookings" :key="booking.id" class="hover:bg-gray-50">
                            <td class="py-3 px-4 text-sm">{{ formatDate(booking.startTime) }}</td>
                            <td class="py-3 px-4 text-sm">{{ formatDate(booking.endTime) }}</td>
                            <td class="py-3 px-4 text-sm">{{ formatCurrency(booking.price) }}</td>
                        </tr>
                        <tr v-if="!selectedBookings.length">
                            <td colspan="3" class="py-4 px-4 text-sm text-center text-gray-500">Không có lịch đặt nào</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="mt-4 flex justify-end">
                    <button 
                        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                        @click="handlePayment(selectedCourtId)"
                    >
                        Xác nhận thanh toán
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAppStoreCourt } from '@/stores/appStoreCourt';
import { useAppStore } from '@/stores/appStore';
import { apiGetListBooking, apiUpdateBoking } from '@/service/api/apiBoking';
import { apiGetCourt } from "@/service/api/apiCourt";
import { useRouter } from 'vue-router';
import type { CourtEvent, Court } from '@/interface';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Stores
const store = useAppStore();
const router = useRouter();
const store_court = useAppStoreCourt();
const list_bookings = ref<CourtEvent[]>([]);
const showModal = ref(false);
const selectedBookings = ref<CourtEvent[]>([]);
const selectedCourtId = ref<number | null>(null);
const selectedCourtName = ref<string>('');

// Define ownerBankInfo with explicit types
const ownerBankInfo = ref<{
  bankNumber: string | null;
  bankName: string | null;
  bankAccount: string | null;
}>({
  bankNumber: null,
  bankName: null,
  bankAccount: null,
});

onMounted(async () => {
    await getListBooking();
    await getListCourt();
});

// Lấy danh sách lịch đặt
async function getListBooking() {
    try {
        const response = await apiGetListBooking();
        if (response && response.status === 200) {
            console.log('Dữ liệu API:', response.data);
            list_bookings.value = response.data;
        } else {


            toast('Lấy danh sách lịch đặt thất bại!', { autoClose: 5000 });
        }
    } catch (error) {
        console.error('Lỗi API:', error);
        toast('Có lỗi khi lấy danh sách lịch đặt!', { autoClose: 5000 });
    }
}

// Lấy danh sách sân
async function getListCourt() {
    try {
        const response = await apiGetCourt();
        console.log("Dữ liệu API:", response);
        store_court.list_court = response.data.filter((court: Court) =>
            court.courtName.trim() !== "" &&
            court.street.trim() !== "" &&
            court.ward.trim() !== "" &&
            court.district.trim() !== "" &&
            court.images.length > 0
        );
        console.log('store_court.list_court', store_court.list_court);
    } catch (error) {
        console.error("Lỗi API:", error);
    }
}

// Tính toán danh sách sân với dữ liệu doanh thu
const filteredCourts = computed(() => {
    const now = new Date();
    // Lọc lịch đặt: status=2 (chưa thanh toán) và status=5 (đã thanh toán), thời gian kết thúc đã557 qua
    const completedBookings = list_bookings.value.filter(booking => 
        (booking.status === 2 || booking.status === 5) && new Date(booking.endTime) < now
    );

    // Nhóm lịch đặt theo sân và tính doanh thu
    const courtRevenueMap = completedBookings.reduce((acc, booking) => {
        const courtId = booking.courtId;
        if (!acc[courtId]) {
            const court = store_court.list_court.find(c => c.id === courtId);
            if (court) {
                acc[courtId] = {
                    id: courtId,
                    courtName: court.courtName,
                    totalRevenue: 0, // Tổng doanh thu (status=2)
                    paidAmount: 0    // Tiền đã thanh toán (status=5)
                };
            }
        }
        if (acc[courtId]) {
            if (booking.status === 2) {
                acc[courtId].totalRevenue += booking.price;
            } else if (booking.status === 5) {
                acc[courtId].paidAmount += booking.price;
            }
        }
        return acc;
    }, {} as Record<number, { id: number; courtName: string; totalRevenue: number; paidAmount: number; paymentAmount?: number }>);

    // Tính số tiền thanh toán (95% tổng doanh thu) và chuyển thành mảng
    return Object.values(courtRevenueMap)
        .filter(court => court.totalRevenue > 0 || court.paidAmount > 0)
        .map(court => ({
            ...court,
            paymentAmount: court.totalRevenue * 0.95
        }));
});

// Định dạng tiền tệ (VND)
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Định dạng ngày giờ
const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString));
};

// Hiển thị chi tiết lịch đặt
const showBookingDetails = (courtId: number) => {
    const now = new Date();
    selectedCourtId.value = courtId;
    const court = store_court.list_court.find(c => c.id === courtId);
    selectedCourtName.value = court ? court.courtName : 'Unknown';
    selectedBookings.value = list_bookings.value.filter(
        booking => booking.courtId === courtId && 
                   booking.status === 2 && 
                   new Date(booking.endTime) < now
    );
    
    // Tìm thông tin chủ sân
    const courtOwner = store_court.list_court.find(c => c.id === courtId)?.userId;
    const owner = store.list_user.find(user => user.id === courtOwner);
    ownerBankInfo.value = {
        bankNumber: owner?.bankNumber || null,
        bankName: owner?.bankName || null,
        bankAccount: owner?.bankAccount || null,
    };
    
    showModal.value = true;
};

// Đóng modal
const closeModal = () => {
    showModal.value = false;
    selectedBookings.value = [];
    selectedCourtId.value = null;
    selectedCourtName.value = '';
    ownerBankInfo.value = { bankNumber: null, bankName: null, bankAccount: null };
};

// Xử lý hành động thanh toán
const handlePayment = async (courtId: number | null) => {
    if (!courtId || !selectedBookings.value.length) {
        toast('Không có lịch đặt nào để thanh toán!', { autoClose: 3000 });
        closeModal();
        return;
    }

    try {
        await refundBokings();
        toast(`Đã thanh toán cho sân ID: ${courtId}`, { autoClose: 3000 });
        closeModal();
    } catch (error) {
        toast('Thanh toán thất bại, vui lòng thử lại!', { autoClose: 5000 });
    }
};

// Hàm cập nhật trạng thái lịch đặt
async function refundBokings() {
    try {
        // Cập nhật từng lịch đặt trong selectedBookings thành status=5
        for (const booking of selectedBookings.value) {
            const updatedBooking = { ...booking, status: 5 };
            const response = await apiUpdateBoking(updatedBooking);
            if (!response || response.status !== 200) {
                // throw new Error(`Cập nhật lịch đặt ID ${booking.id} thất bại`);
            }
        }
     
        // Làm mới danh sách lịch đặt
        await getListBooking();
    } catch (error) {
        console.error("API Error:", error);
        toast("Thanh toán thất bại, vui lòng thử lại!", { autoClose: 5000 });
        throw error;
    }
}

// Xử lý nút quay lại
const goBack = () => {
    router.back();
};
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

th, td {
    text-align: left;
}

th {
    font-weight: 600;
}

tbody tr:last-child td {
    border-bottom: none;
}
</style>