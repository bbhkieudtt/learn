<template>
    <div class="mx-auto p-8 bg-green-800 min-h-screen text-white">
        <!-- Back Button -->
        <div class="mb-8">
            <button @click="goBack"
                class="flex items-center bg-white text-green-800 px-5 py-2.5 rounded-xl hover:bg-green-100 transition duration-300 shadow-md">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Quay lại
            </button>
        </div>

        <!-- Filter Section -->
        <div class="mb-10 flex items-center">
            <label for="statusFilter" class="mr-4 text-lg font-semibold tracking-wide">
                Lọc theo trạng thái:
            </label>
            <div class="relative w-64">
                <select id="statusFilter" v-model="statusFilter"
                    class="appearance-none w-full bg-white text-green-800 rounded-xl px-4 py-3 pr-10 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 shadow-sm">
                    <option value="all">Tất cả</option>
                    <option value="0">Chưa xác nhận</option>
                    <option value="1">Đã xác nhận</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Reports Grid or No Reports Message -->
        <div v-if="filteredReports.length > 0" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="report in filteredReports" :key="report.id"
                class="bg-white text-green-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-green-100 transform hover:-translate-y-1">
                <h3 class="text-xl font-bold mb-3">
                    Báo cáo #{{ report.id }}
                </h3>
                <p class="mb-2">
                    <span class="font-semibold">Nội dung:</span> {{ report.content }}
                </p>
                <p class="mb-2">
                    <span class="font-semibold">Ngày tạo:</span> {{ formatDate(report.createDate) }}
                </p>
                <p class="mb-2">
                    <span class="font-semibold">Người báo cáo:</span> {{ report.userFullname }}
                </p>
                <p class="mb-2">
                    <span class="font-semibold">Tên sân:</span> {{ report.courtName }}
                </p>
                <p class="mb-4">
                    <span class="font-semibold">Địa chỉ:</span>
                    {{ report.courtStreet }}, {{ report.courtWard }}, {{ report.courtDistrict }}
                </p>
                <button v-if="report.status === 0" @click="openConfirmModal(report)"
                    class="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition duration-300 shadow-md">
                    Xác nhận
                </button>
                <p v-else-if="report.status === 1" class="text-green-600 font-semibold">
                    Báo cáo thành công
                </p>
            </div>
        </div>
        <div v-else class="text-center py-12">
            <svg class="mx-auto w-16 h-16 text-green-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 17v-6h6v6m-6 0h6m-3-9v12m-6 0h6m-9-3h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                </path>
            </svg>
            <h3 class="text-2xl font-semibold">Chưa có báo cáo nào</h3>
            <p class="text-green-200 mt-2">Hiện tại không có báo cáo nào phù hợp với bộ lọc của bạn.</p>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showModal"
            class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300"
            :class="{ 'opacity-0': !showModal, 'opacity-100': showModal }">
            <div class="bg-white text-green-800 p-8 rounded-2xl shadow-2xl transform transition-transform duration-300 max-w-md w-full"
                :class="{ 'scale-95': !showModal, 'scale-100': showModal }">
                <h2 class="text-2xl font-bold mb-4">Xác nhận báo cáo</h2>
                <p class="mb-6 text-gray-700">Bạn có chắc chắn muốn xác nhận báo cáo này?</p>
                <div class="flex justify-end space-x-4">
                    <button @click="showModal = false"
                        class="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-300 transition duration-300">
                        Hủy
                    </button>
                    <button @click="confirmReport"
                        class="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition duration-300">
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

/** API */
import { apiGetListReport, apiUpdateReport } from "@/service/api/apiReport";

/** Kiểu dữ liệu */
import type { RePorts } from "@/interface";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Router để quay lại
const router = useRouter();

// Danh sách báo cáo
const list_reports = ref<RePorts[]>([]);

const select_reports = ref<RePorts>();


// Trạng thái lọc
const statusFilter = ref<string>("all");

// Trạng thái modal
const showModal = ref(false);
const selectedReportId = ref<number | null>(null);

// Lấy danh sách báo cáo
async function getListReport() {
    try {
        const response = await apiGetListReport();
        if (response && response.status === 200) {
            console.log("response", response);
            list_reports.value = response.data;
        } else {
            console.log("lỗi");
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

// Lấy danh sách báo cáo
async function getUpdateReport() {
    if (select_reports?.value)
        select_reports.value.status = 1
    console.log();

    try {
        const response = await apiUpdateReport(select_reports.value);
        if (response && response.status === 200) {
            getListReport()
            toast('Báo cáo thành công')
        } else {
            console.log("lỗi");
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

// Định dạng ngày
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

// Lọc báo cáo theo trạng thái
const filteredReports = computed(() => {
    if (statusFilter.value === "all") {
        return list_reports.value;
    }
    return list_reports.value.filter(
        (report) => report.status === parseInt(statusFilter.value)
    );
});

// Mở modal xác nhận
function openConfirmModal(report: RePorts) {
    select_reports.value = report
    showModal.value = true;
}

// Xử lý xác nhận báo cáo
function confirmReport() {
    if (select_reports.value) {
        getUpdateReport()
    }
    showModal.value = false;
    selectedReportId.value = null;
}

// Xử lý nút quay lại
function goBack() {
    if (router) {
        router.go(-1); // Quay lại trang trước
    } else {
        console.log("Vue Router không khả dụng, cần cấu hình thêm.");
    }
}

// Gọi API khi component được mounted
onMounted(async () => {
    await getListReport();
});
</script>

<style></style>